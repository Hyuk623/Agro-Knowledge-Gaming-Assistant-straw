import { describe, it, expect } from 'vitest';
import {
  initSimulationState,
  computeNextState,
  computeScoreDelta,
  matchesWhen,
  toCropStatus,
} from '../simulationEngine';
import type { ScenarioDay, DailyActionDraft, SimulationState } from '../../types';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const coldDay: ScenarioDay = {
  id: 'test-day-1', scenario_id: 'test', day_number: 1,
  outside_temp_level: 'low', sunlight_level: 'low', disease_pressure_level: 'normal',
};

const normalDay: ScenarioDay = {
  id: 'test-day-2', scenario_id: 'test', day_number: 4,
  outside_temp_level: 'normal', sunlight_level: 'normal', disease_pressure_level: 'low',
};

const diseaseDay: ScenarioDay = {
  id: 'test-day-3', scenario_id: 'test', day_number: 5,
  outside_temp_level: 'low', sunlight_level: 'low', disease_pressure_level: 'high',
};

const goodAction: DailyActionDraft  = { irrigation: 'normal', heating: 'high',   ventilation: 'high', lighting: 'on' };
const badAction: DailyActionDraft   = { irrigation: 'high',   heating: 'low',    ventilation: 'low',  lighting: 'off' };
const normalAction: DailyActionDraft = { irrigation: 'normal', heating: 'normal', ventilation: 'normal', lighting: 'auto' };

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe('initSimulationState', () => {
  it('returns correct starting values', () => {
    const state = initSimulationState();
    expect(state.growthScore).toBe(60);
    expect(state.rootMoistureScore).toBe(60);
    expect(state.lightScore).toBe(60);
    expect(state.diseaseRisk).toBe(20);
    expect(state.yieldPotential).toBe(60);
    expect(state.costScore).toBe(80);
  });

  it('returns a fresh copy each call', () => {
    const a = initSimulationState();
    const b = initSimulationState();
    expect(a).not.toBe(b); // different references
  });
});

describe('computeNextState — cold day, low heating', () => {
  it('penalises growthScore on cold day with low heating', () => {
    const prev  = initSimulationState();
    const { nextState } = computeNextState(prev, coldDay, badAction);
    expect(nextState.growthScore).toBeLessThan(prev.growthScore);
  });

  it('matches cold-low-heat modifier', () => {
    const { matchedModifiers } = computeNextState(initSimulationState(), coldDay, badAction);
    expect(matchedModifiers).toContain('cold-low-heat');
  });

  it('raises diseaseRisk on high irrigation + low ventilation', () => {
    const prev = initSimulationState();
    const { nextState } = computeNextState(prev, coldDay, badAction);
    expect(nextState.diseaseRisk).toBeGreaterThan(prev.diseaseRisk);
  });
});

describe('computeNextState — cold day, optimal actions', () => {
  it('improves or holds growthScore with high heating on cold day', () => {
    const prev  = initSimulationState();
    const { nextState } = computeNextState(prev, coldDay, goodAction);
    // cold-high-heat modifier gives +7, so growth should improve
    expect(nextState.growthScore).toBeGreaterThan(prev.growthScore);
  });

  it('reduces diseaseRisk with high ventilation', () => {
    const prev  = initSimulationState();
    const { nextState } = computeNextState(prev, coldDay, goodAction);
    expect(nextState.diseaseRisk).toBeLessThan(prev.diseaseRisk);
  });

  it('improves lightScore with lighting on during dark day', () => {
    const prev  = initSimulationState();
    const { nextState } = computeNextState(prev, coldDay, goodAction);
    expect(nextState.lightScore).toBeGreaterThan(prev.lightScore);
  });
});

describe('computeNextState — disease day, worst actions', () => {
  it('triggers disease-low-vent modifier', () => {
    const { matchedModifiers } = computeNextState(initSimulationState(), diseaseDay, badAction);
    expect(matchedModifiers).toContain('disease-low-vent');
  });

  it('spikes diseaseRisk significantly', () => {
    const prev = initSimulationState();
    const { nextState } = computeNextState(prev, diseaseDay, badAction);
    // disease-low-vent = +16, wet-still-air = +13, base ventilation low = +8
    expect(nextState.diseaseRisk).toBeGreaterThan(prev.diseaseRisk + 20);
  });
});

describe('computeNextState — normal day, normal actions', () => {
  it('keeps all values in a reasonable range', () => {
    let state = initSimulationState();
    // Simulate 14 days of normal-normal-normal-auto
    for (let i = 0; i < 14; i++) {
      ({ nextState: state } = computeNextState(state, normalDay, normalAction));
      expect(state.growthScore).toBeGreaterThanOrEqual(0);
      expect(state.growthScore).toBeLessThanOrEqual(100);
      expect(state.diseaseRisk).toBeGreaterThanOrEqual(0);
      expect(state.diseaseRisk).toBeLessThanOrEqual(100);
      expect(state.yieldPotential).toBeGreaterThanOrEqual(0);
      expect(state.yieldPotential).toBeLessThanOrEqual(100);
    }
  });
});

describe('state threshold penalties', () => {
  it('triggers drought-stress when rootMoistureScore drops below 35', () => {
    // Start from a very dry state
    const dryState: SimulationState = { ...initSimulationState(), rootMoistureScore: 20 };
    const { triggeredPenalties } = computeNextState(dryState, normalDay, normalAction);
    expect(triggeredPenalties).toContain('drought-stress');
  });

  it('triggers waterlogged-risk when rootMoistureScore exceeds 80', () => {
    const wetState: SimulationState = { ...initSimulationState(), rootMoistureScore: 85 };
    const { triggeredPenalties } = computeNextState(wetState, normalDay, normalAction);
    expect(triggeredPenalties).toContain('waterlogged-risk');
  });

  it('triggers severe-disease when diseaseRisk exceeds 75', () => {
    const sickState: SimulationState = { ...initSimulationState(), diseaseRisk: 80 };
    const { triggeredPenalties } = computeNextState(sickState, normalDay, normalAction);
    expect(triggeredPenalties).toContain('severe-disease');
  });
});

describe('computeScoreDelta', () => {
  it('returns positive when yield and disease improve', () => {
    const prev: SimulationState = initSimulationState();
    const next: SimulationState = { ...prev, yieldPotential: 70, diseaseRisk: 10 };
    expect(computeScoreDelta(prev, next)).toBeGreaterThan(0);
  });

  it('returns negative when yield falls and disease rises', () => {
    const prev: SimulationState = initSimulationState();
    const next: SimulationState = { ...prev, yieldPotential: 50, diseaseRisk: 40 };
    expect(computeScoreDelta(prev, next)).toBeLessThan(0);
  });
});

describe('matchesWhen', () => {
  it('matches when all conditions align', () => {
    expect(matchesWhen(
      { outside_temp_level: 'low', heating: 'low' },
      coldDay,
      badAction,
    )).toBe(true);
  });

  it('does not match when one condition differs', () => {
    expect(matchesWhen(
      { outside_temp_level: 'low', heating: 'high' },
      coldDay,
      badAction,    // badAction has heating: 'low'
    )).toBe(false);
  });

  it('matches empty when clause (always true)', () => {
    expect(matchesWhen({}, coldDay, badAction)).toBe(true);
  });
});

describe('toCropStatus', () => {
  it('reports high disease_risk when diseaseRisk > 60', () => {
    const state: SimulationState = { ...initSimulationState(), diseaseRisk: 70 };
    const status = toCropStatus(state, 7);
    expect(status.disease_risk).toBe('high');
  });

  it('reports low water_stress when moisture is in optimal range', () => {
    const state: SimulationState = { ...initSimulationState(), rootMoistureScore: 60 };
    const status = toCropStatus(state, 5);
    expect(status.water_stress).toBe('low');
  });

  it('reports correct growth stage per day number', () => {
    expect(toCropStatus(initSimulationState(), 2).growth_stage).toBe('Establishment');
    expect(toCropStatus(initSimulationState(), 7).growth_stage).toBe('Flower Initiation');
    expect(toCropStatus(initSimulationState(), 14).growth_stage).toBe('Fruit Ripening');
  });
});
