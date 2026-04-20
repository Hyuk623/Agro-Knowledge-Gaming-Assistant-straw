import type { ScenarioDay } from '../types';

export function getAdvisorHintKey(day: ScenarioDay): string {
  // Return the translation key based on the day's conditions
  if (day.disease_pressure_level === 'high') {
    return 'advisor.highDisease';
  }
  if (day.outside_temp_level === 'low' && day.sunlight_level === 'low') {
    return 'advisor.coldDark';
  }
  if (day.outside_temp_level === 'low') {
    return 'advisor.cold';
  }
  if (day.outside_temp_level === 'high') {
    return 'advisor.hot';
  }
  if (day.sunlight_level === 'high') {
    return 'advisor.sunny';
  }
  return 'advisor.neutral';
}

export function getPreActionTradeoffs(draft: import('../types').DailyActionDraft): string[] {
  const tradeoffs = [];
  
  if (draft.irrigation === 'high') {
    tradeoffs.push('advisor.tradeoff.highIrrig');
  } else if (draft.irrigation === 'low') {
    tradeoffs.push('advisor.tradeoff.lowIrrig');
  }

  if (draft.ventilation === 'high') {
    tradeoffs.push('advisor.tradeoff.highVent');
  } else if (draft.ventilation === 'low') {
    tradeoffs.push('advisor.tradeoff.lowVent');
  }

  if (draft.heating === 'high') {
    tradeoffs.push('advisor.tradeoff.highHeat');
  }

  if (draft.lighting === 'on') {
    tradeoffs.push('advisor.tradeoff.lightOn');
  }

  return tradeoffs;
}
