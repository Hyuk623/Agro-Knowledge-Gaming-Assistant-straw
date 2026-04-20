import type {
  SimulationState,
  StateDelta,
  ScenarioDay,
  DailyActionDraft,
  DailyResult,
  CropStatus,
  LevelScale,
} from '../types';
import {
  STRAWBERRY_RULESET,
  type StateEffect,
  type ConditionModifierWhen,
  type StatePenalty,
} from '../data/strawberryRuleset';
import { clamp } from './utils';

// ─────────────────────────────────────────────
// Simulation Engine – pure functions only.
// No React, no side effects, no I/O.
// Same inputs always produce same outputs.
// ─────────────────────────────────────────────

/** Returns a fresh copy of the initial simulation state. */
export function initSimulationState(): SimulationState {
  return { ...STRAWBERRY_RULESET.initial_state };
}

// ─────────────────────────────────────────────
// Main day computation
// ─────────────────────────────────────────────

export interface DayComputeResult {
  nextState: SimulationState;
  delta: StateDelta;
  /** Matched condition modifier labels (used by feedback generator) */
  matchedModifiers: string[];
  /** Triggered penalty labels */
  triggeredPenalties: string[];
}

/**
 * Compute the next state for one day.
 * Steps:
 *   1. Apply base action effects
 *   2. Apply matching condition modifiers
 *   3. Apply state threshold penalties
 *   4. Recalculate yieldPotential from formula
 *   5. Clamp all values to [0, 100]
 *   6. Return deltas and diagnostic labels
 */
export function computeNextState(
  prevState: SimulationState,
  day: ScenarioDay,
  action: DailyActionDraft,
): DayComputeResult {
  const accum: StateEffect = {};
  const matchedModifiers: string[] = [];
  const triggeredPenalties: string[] = [];

  const add = (eff: StateEffect) => {
    for (const [k, v] of Object.entries(eff) as [keyof StateEffect, number][]) {
      accum[k] = (accum[k] ?? 0) + v;
    }
  };

  // 1. Base action effects (unconditional per-action cost)
  add(STRAWBERRY_RULESET.action_effects.heating[action.heating]);
  add(STRAWBERRY_RULESET.action_effects.irrigation[action.irrigation]);
  add(STRAWBERRY_RULESET.action_effects.ventilation[action.ventilation]);
  add(STRAWBERRY_RULESET.action_effects.lighting[action.lighting]);

  // 2. Condition modifiers (fire only when all `when` fields match)
  for (const mod of STRAWBERRY_RULESET.condition_modifiers) {
    if (matchesWhen(mod.when, day, action)) {
      add(mod.effect);
      matchedModifiers.push(mod.label);
    }
  }

  // 3. Apply accumulated effect to get intermediate state
  let intermediate = applyEffect(prevState, accum);

  // 4. State threshold penalties (based on intermediate values)
  for (const penalty of STRAWBERRY_RULESET.state_penalties) {
    if (penaltyTriggered(penalty, intermediate)) {
      intermediate = applyEffect(intermediate, penalty.effect);
      triggeredPenalties.push(penalty.label);
    }
  }

  // 5. Recompute yieldPotential from weighted formula
  const { growthScore_weight, lightScore_weight, diseaseRisk_penalty_weight, costScore_weight } =
    STRAWBERRY_RULESET.yield_formula;

  const formulaYield =
    intermediate.growthScore        * growthScore_weight +
    intermediate.lightScore         * lightScore_weight +
    (100 - intermediate.diseaseRisk) * diseaseRisk_penalty_weight +
    intermediate.costScore           * costScore_weight;

  // Cap per-day yield swing at ±12 to prevent wild single-day jumps
  const clampedYield = clamp(formulaYield, prevState.yieldPotential - 12, prevState.yieldPotential + 10);
  intermediate.yieldPotential = clamp(clampedYield, 0, 100);

  // 6. Clamp everything to [0, 100]
  const nextState: SimulationState = {
    growthScore:       clamp(intermediate.growthScore,       0, 100),
    rootMoistureScore: clamp(intermediate.rootMoistureScore, 0, 100),
    lightScore:        clamp(intermediate.lightScore,        0, 100),
    diseaseRisk:       clamp(intermediate.diseaseRisk,       0, 100),
    yieldPotential:    clamp(intermediate.yieldPotential,    0, 100),
    costScore:         clamp(intermediate.costScore,         0, 100),
  };

  const delta: StateDelta = {
    growthScore:       nextState.growthScore       - prevState.growthScore,
    rootMoistureScore: nextState.rootMoistureScore - prevState.rootMoistureScore,
    lightScore:        nextState.lightScore        - prevState.lightScore,
    diseaseRisk:       nextState.diseaseRisk       - prevState.diseaseRisk,
    yieldPotential:    nextState.yieldPotential    - prevState.yieldPotential,
    costScore:         nextState.costScore         - prevState.costScore,
  };

  return { nextState, delta, matchedModifiers, triggeredPenalties };
}

/**
 * Convert a SimulationState into the legacy CropStatus shape
 * still used by StatusCard and DayHeader components.
 */
export function toCropStatus(state: SimulationState, dayNumber: number): CropStatus {
  // Health = blend of growth quality and disease freedom
  const health = Math.round(
    state.growthScore * 0.45 +
    (100 - state.diseaseRisk) * 0.45 +
    (state.rootMoistureScore >= 45 && state.rootMoistureScore <= 75 ? 10 : 0),
  );

  const waterStress: LevelScale =
    state.rootMoistureScore < 35 ? 'high' :
    state.rootMoistureScore > 80 ? 'high' :   // waterlogged = also "high" stress
    state.rootMoistureScore < 48 || state.rootMoistureScore > 72 ? 'normal' : 'low';

  const tempStress: LevelScale =
    state.growthScore < 35 ? 'high' :
    state.growthScore < 55 ? 'normal' : 'low';

  const diseaseLevel: LevelScale =
    state.diseaseRisk > 60 ? 'high' :
    state.diseaseRisk > 35 ? 'normal' : 'low';

  const notes = buildStatusNotes(state, waterStress, diseaseLevel);

  return {
    health_score:          clamp(health, 0, 100),
    growth_stage:          resolveGrowthStage(dayNumber),
    water_stress:          waterStress,
    temperature_stress:    tempStress,
    disease_risk:          diseaseLevel,
    notes,
  };
}

/**
 * Compute the day's score delta — how well the player performed.
 * Positive = good decisions, negative = poor decisions.
 * Range is roughly −20 to +15.
 */
export function computeScoreDelta(prev: SimulationState, next: SimulationState): number {
  const yieldChange    = next.yieldPotential - prev.yieldPotential;
  const diseaseImproved = prev.diseaseRisk   - next.diseaseRisk;   // positive = disease went down = good
  const growthChange   = next.growthScore    - prev.growthScore;
  const costChange     = next.costScore      - prev.costScore;

  const raw =
    yieldChange    * 2.5 +
    diseaseImproved * 1.5 +
    growthChange   * 1.0 +
    costChange     * 0.5;

  return Math.round(raw);
}

/**
 * Convenience: run computeNextState + toCropStatus + computeScoreDelta
 * and return a complete DailyResult ready for storage / display.
 */
export function computeDayResult(
  prevState: SimulationState,
  day: ScenarioDay,
  action: DailyActionDraft,
  sessionId: string,
): { dayCompute: DayComputeResult; result: DailyResult } {
  const dayCompute = computeNextState(prevState, day, action);
  const { nextState } = dayCompute;

  const scoreDelta = computeScoreDelta(prevState, nextState);

  const result: DailyResult = {
    id:                `result-${sessionId}-day${day.day_number}`,
    session_id:        sessionId,
    day_number:        day.day_number,
    sim_state:         nextState,
    crop_status:       toCropStatus(nextState, day.day_number),
    score_delta:       scoreDelta,
    feedback_messages: [], // filled by feedbackGenerator
    calculated_at:     new Date().toISOString(),
  };

  return { dayCompute, result };
}

// ─────────────────────────────────────────────
// Private helpers (exported for unit testing)
// ─────────────────────────────────────────────

/** Returns true when ALL defined `when` keys match the action + day conditions. */
export function matchesWhen(
  when: ConditionModifierWhen,
  day: ScenarioDay,
  action: DailyActionDraft,
): boolean {
  if (when.outside_temp_level     && when.outside_temp_level     !== day.outside_temp_level)     return false;
  if (when.sunlight_level         && when.sunlight_level         !== day.sunlight_level)         return false;
  if (when.disease_pressure_level && when.disease_pressure_level !== day.disease_pressure_level) return false;
  if (when.irrigation             && when.irrigation             !== action.irrigation)           return false;
  if (when.heating                && when.heating                !== action.heating)               return false;
  if (when.ventilation            && when.ventilation            !== action.ventilation)           return false;
  if (when.lighting               && when.lighting               !== action.lighting)              return false;
  return true;
}

function penaltyTriggered(penalty: StatePenalty, state: SimulationState): boolean {
  if (penalty.if_above) {
    for (const [k, threshold] of Object.entries(penalty.if_above) as [keyof SimulationState, number][]) {
      if (state[k] <= threshold) return false;
    }
  }
  if (penalty.if_below) {
    for (const [k, threshold] of Object.entries(penalty.if_below) as [keyof SimulationState, number][]) {
      if (state[k] >= threshold) return false;
    }
  }
  return true;
}

function applyEffect(state: SimulationState, eff: StateEffect): SimulationState {
  return {
    growthScore:       state.growthScore       + (eff.growthScore       ?? 0),
    rootMoistureScore: state.rootMoistureScore + (eff.rootMoistureScore ?? 0),
    lightScore:        state.lightScore        + (eff.lightScore        ?? 0),
    diseaseRisk:       state.diseaseRisk       + (eff.diseaseRisk       ?? 0),
    yieldPotential:    state.yieldPotential    + (eff.yieldPotential    ?? 0),
    costScore:         state.costScore         + (eff.costScore         ?? 0),
  };
}

function resolveGrowthStage(day: number): string {
  if (day <= 3)  return 'Establishment';
  if (day <= 6)  return 'Vegetative Growth';
  if (day <= 9)  return 'Flower Initiation';
  if (day <= 12) return 'Flowering & Fruiting';
  return 'Fruit Ripening';
}

function buildStatusNotes(
  state: SimulationState,
  waterStress: LevelScale,
  diseaseLevel: LevelScale,
): string[] {
  const notes: string[] = [];
  if (waterStress === 'high' && state.rootMoistureScore < 45) notes.push('⚠ Drought stress — increase irrigation.');
  if (waterStress === 'high' && state.rootMoistureScore > 80) notes.push('⚠ Waterlogged roots — reduce irrigation.');
  if (diseaseLevel === 'high')  notes.push('🍄 Disease risk critical — improve ventilation.');
  if (diseaseLevel === 'normal') notes.push('⚡ Disease pressure building — monitor closely.');
  if (state.lightScore < 35)   notes.push('🌑 Light deficiency — use supplemental lighting.');
  if (state.growthScore > 75)  notes.push('🌱 Excellent growth conditions maintained!');
  if (notes.length === 0)       notes.push('✅ Crop is healthy today.');
  return notes;
}
