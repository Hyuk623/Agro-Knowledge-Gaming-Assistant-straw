import type { LevelScale, LightingOption, SimulationState } from '../types';

// ─────────────────────────────────────────────
// Strawberry Winter Greenhouse Ruleset
// All numeric deltas are additive per-day values.
// Created as a typed TS const so it can be read by the engine
// and later replaced by a Supabase fetch in Phase 2.
// ─────────────────────────────────────────────

export interface StateEffect {
  growthScore?: number;
  rootMoistureScore?: number;
  lightScore?: number;
  diseaseRisk?: number;
  yieldPotential?: number;
  costScore?: number;
}

export interface ConditionModifierWhen {
  // Environmental conditions
  outside_temp_level?: LevelScale;
  sunlight_level?: LevelScale;
  disease_pressure_level?: LevelScale;
  // Player actions (checked in combination with conditions above)
  irrigation?: LevelScale;
  heating?: LevelScale;
  ventilation?: LevelScale;
  lighting?: LightingOption;
}

export interface ConditionModifier {
  when: ConditionModifierWhen;
  effect: StateEffect;
  label: string; // human-readable label used in feedback generation
}

export interface StatePenalty {
  if_above?: Partial<Record<keyof SimulationState, number>>;
  if_below?: Partial<Record<keyof SimulationState, number>>;
  effect: StateEffect;
  label: string;
}

export interface StrawberryRuleset {
  initial_state: SimulationState;
  target_ranges: {
    rootMoistureScore: { optimal_min: number; optimal_max: number };
    diseaseRisk: { optimal_max: number };
    growthScore: { optimal_min: number };
    lightScore: { optimal_min: number };
    costScore: { optimal_min: number };
  };
  action_effects: {
    heating: Record<LevelScale, StateEffect>;
    irrigation: Record<LevelScale, StateEffect>;
    ventilation: Record<LevelScale, StateEffect>;
    lighting: Record<LightingOption, StateEffect>;
  };
  condition_modifiers: ConditionModifier[];
  state_penalties: StatePenalty[];
  yield_formula: {
    growthScore_weight: number;
    lightScore_weight: number;
    diseaseRisk_penalty_weight: number;
    costScore_weight: number;
  };
}

export const STRAWBERRY_RULESET: StrawberryRuleset = {

  initial_state: {
    growthScore:       60,
    rootMoistureScore: 60,
    lightScore:        60,
    diseaseRisk:       20,
    yieldPotential:    60,
    costScore:         80,
  },

  target_ranges: {
    rootMoistureScore: { optimal_min: 45, optimal_max: 75 },
    diseaseRisk:       { optimal_max: 40 },
    growthScore:       { optimal_min: 55 },
    lightScore:        { optimal_min: 50 },
    costScore:         { optimal_min: 55 },
  },

  // ── Base effects: applied unconditionally for each action choice ──
  // These are the "cost floor" of each decision before any interactions.
  action_effects: {
    heating: {
      low:    { costScore: +6 },                          // saves energy
      normal: {},                                          // balanced
      high:   { growthScore: +2, costScore: -10 },        // warm but expensive
    },
    irrigation: {
      low:    { rootMoistureScore: -14 },                 // dries out quickly
      normal: { rootMoistureScore: +2 },                  // slight top-up
      high:   { rootMoistureScore: +16, diseaseRisk: +5 },// wets + humidity risk
    },
    ventilation: {
      low:    { diseaseRisk: +8 },                        // stagnant air
      normal: { diseaseRisk: -2 },                        // slight improve
      high:   { diseaseRisk: -10 },                       // strong air exchange
    },
    lighting: {
      off:  { lightScore: -5,  costScore: +5  },          // saves power, less light
      auto: { lightScore: +1,  costScore: +2  },          // sensor-managed
      on:   { lightScore: +10, costScore: -8  },          // full supplement
    },
  },

  // ── Condition modifiers: action × environment interactions ──
  // Each entry fires only when ALL `when` fields simultaneously match.
  condition_modifiers: [

    // ── Heating × Outside Temperature ─────────────────────────────

    { when: { outside_temp_level: 'low', heating: 'low' },
      effect: { growthScore: -10, rootMoistureScore: -5 },
      label: 'cold-low-heat' },

    { when: { outside_temp_level: 'low', heating: 'normal' },
      effect: { growthScore: -3 },
      label: 'cold-normal-heat' },

    { when: { outside_temp_level: 'low', heating: 'high' },
      effect: { growthScore: +7 },
      label: 'cold-high-heat' },

    { when: { outside_temp_level: 'normal', heating: 'high' },
      effect: { growthScore: -2, costScore: -4 },
      label: 'normal-high-heat' },

    { when: { outside_temp_level: 'high', heating: 'high' },
      effect: { growthScore: -9, costScore: -6 },
      label: 'hot-high-heat' },

    { when: { outside_temp_level: 'high', heating: 'normal' },
      effect: { growthScore: +2 },
      label: 'hot-normal-heat' },

    // ── Ventilation × Outside Temperature ─────────────────────────

    // Cold air rushing in drops greenhouse temp
    { when: { outside_temp_level: 'low', ventilation: 'high' },
      effect: { growthScore: -5 },
      label: 'cold-high-vent' },

    // Ventilation helps cool on a hot day
    { when: { outside_temp_level: 'high', ventilation: 'high' },
      effect: { growthScore: +4 },
      label: 'hot-high-vent' },

    // No ventilation on a hot day → heat stress
    { when: { outside_temp_level: 'high', ventilation: 'low' },
      effect: { growthScore: -5 },
      label: 'hot-low-vent' },

    // ── Lighting × Sunlight ───────────────────────────────────────

    { when: { sunlight_level: 'low', lighting: 'off' },
      effect: { lightScore: -13, growthScore: -7 },
      label: 'dark-no-light' },

    { when: { sunlight_level: 'low', lighting: 'auto' },
      effect: { lightScore: +4, growthScore: +1 },
      label: 'dark-auto-light' },

    { when: { sunlight_level: 'low', lighting: 'on' },
      effect: { lightScore: +13, growthScore: +4 },
      label: 'dark-full-light' },

    // Mild waste when overlit on a normal day
    { when: { sunlight_level: 'normal', lighting: 'on' },
      effect: { costScore: -3 },
      label: 'normal-full-light' },

    // Clear waste on a bright day
    { when: { sunlight_level: 'high', lighting: 'on' },
      effect: { costScore: -6 },
      label: 'bright-full-light' },

    // ── Disease Pressure × Ventilation ────────────────────────────

    { when: { disease_pressure_level: 'high', ventilation: 'low' },
      effect: { diseaseRisk: +16 },
      label: 'disease-low-vent' },

    { when: { disease_pressure_level: 'high', ventilation: 'normal' },
      effect: { diseaseRisk: +5 },
      label: 'disease-normal-vent' },

    { when: { disease_pressure_level: 'high', ventilation: 'high' },
      effect: { diseaseRisk: -8, growthScore: +2 },
      label: 'disease-high-vent' },

    { when: { disease_pressure_level: 'low', ventilation: 'high' },
      effect: { diseaseRisk: -4 },
      label: 'healthy-high-vent' },

    // ── Irrigation × Ventilation (humidity accumulation) ──────────

    { when: { irrigation: 'high', ventilation: 'low' },
      effect: { diseaseRisk: +13 },
      label: 'wet-still-air' },

    { when: { irrigation: 'high', ventilation: 'normal' },
      effect: { diseaseRisk: +4 },
      label: 'wet-normal-air' },

    { when: { irrigation: 'high', ventilation: 'high' },
      effect: { diseaseRisk: -2 },
      label: 'wet-moving-air' },

    // ── Irrigation × Temperature ───────────────────────────────────

    // Cold + under-watering → drought stress worsens
    { when: { outside_temp_level: 'low', irrigation: 'low' },
      effect: { rootMoistureScore: -8 },
      label: 'cold-dry' },

    // Cold + over-watering → root rot risk
    { when: { outside_temp_level: 'low', irrigation: 'high' },
      effect: { diseaseRisk: +8, rootMoistureScore: +5 },
      label: 'cold-wet' },
  ],

  // ── State penalties: threshold-based, applied after deltas are summed ──
  state_penalties: [

    { if_below: { rootMoistureScore: 35 },
      effect: { growthScore: -9, yieldPotential: -6 },
      label: 'drought-stress' },

    { if_below: { rootMoistureScore: 45 },
      effect: { growthScore: -4 },
      label: 'moisture-low' },

    { if_above: { rootMoistureScore: 80 },
      effect: { growthScore: -6, diseaseRisk: +8 },
      label: 'waterlogged-risk' },

    { if_above: { rootMoistureScore: 90 },
      effect: { growthScore: -10, diseaseRisk: +12 },
      label: 'root-rot' },

    { if_above: { diseaseRisk: 55 },
      effect: { growthScore: -7, yieldPotential: -5 },
      label: 'disease-growth-penalty' },

    { if_above: { diseaseRisk: 75 },
      effect: { yieldPotential: -10, growthScore: -10 },
      label: 'severe-disease' },

    { if_below: { lightScore: 35 },
      effect: { growthScore: -6, yieldPotential: -4 },
      label: 'light-deficiency' },

    // Reward for sustained good growth
    { if_above: { growthScore: 75 },
      effect: { yieldPotential: +3 },
      label: 'strong-growth-bonus' },
  ],

  // yieldPotential is recalculated every day from this weighted formula
  yield_formula: {
    growthScore_weight:          0.35,
    lightScore_weight:           0.25,
    diseaseRisk_penalty_weight:  0.25,  // applied as (100 - diseaseRisk) * weight
    costScore_weight:            0.15,
  },
};
