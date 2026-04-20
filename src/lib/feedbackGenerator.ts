import type {
  ScenarioDay,
  DailyActionDraft,
  SimulationState,
  StateDelta,
  DailyFeedback,
} from '../types';
import i18n from '../i18n';

export interface FeedbackInput {
  day: ScenarioDay;
  action: DailyActionDraft;
  prevState: SimulationState;
  nextState: SimulationState;
  delta: StateDelta;
  matchedModifiers: string[];
  triggeredPenalties: string[];
}

export function generateDayFeedback(input: FeedbackInput): {
  messages: string[];
  data: DailyFeedback;
} {
  const whatChanged = buildSummary(input);
  const whyItChanged = buildMainCause(input);
  const whyDetail = buildWhyDetail(input);
  const tomorrow = buildRecommendation(input.nextState, input.day.day_number);
  
  let statusLabel: 'stable' | 'caution' | 'risky' = 'stable';
  if (input.nextState.diseaseRisk > 70 || input.nextState.rootMoistureScore < 20 || input.nextState.rootMoistureScore > 85) {
    statusLabel = 'risky';
  } else if (input.nextState.diseaseRisk > 50 || input.nextState.rootMoistureScore < 35 || input.nextState.rootMoistureScore > 75) {
    statusLabel = 'caution';
  }

  return {
    messages: [whatChanged, whyItChanged, tomorrow],
    data: {
      whatChanged,
      whyItChanged,
      whyDetail,
      tomorrow,
      statusLabel
    }
  };
}

// ── Sentence 1: Daily summary ────────────────────────────────────

function buildSummary(input: FeedbackInput): string {
  const { delta, day } = input;
  const net = delta.yieldPotential * 2 + (-delta.diseaseRisk) * 1.5 + delta.growthScore;
  const tId = 'engine.summary.';

  if (net > 6) return i18n.t(`${tId}exc`, { day: day.day_number });
  if (net > 2) return i18n.t(`${tId}good`, { day: day.day_number });
  if (net > -3) return i18n.t(`${tId}mixed`, { day: day.day_number });
  if (net > -8) return i18n.t(`${tId}diff`, { day: day.day_number });
  return i18n.t(`${tId}crit`, { day: day.day_number });
}

// ── Sentence 2: Main cause ───────────────────────────────────────

function buildMainCause({ delta, matchedModifiers, triggeredPenalties }: FeedbackInput): string {
  const tId = 'engine.cause.';

  if (triggeredPenalties.includes('root-rot')) return i18n.t(`${tId}rootRot`);
  if (triggeredPenalties.includes('drought-stress')) return i18n.t(`${tId}drought`);
  if (triggeredPenalties.includes('severe-disease')) return i18n.t(`${tId}sevDisease`);

  if (matchedModifiers.includes('cold-low-heat')) return i18n.t(`${tId}coldLowHeat`);
  if (matchedModifiers.includes('disease-low-vent')) return i18n.t(`${tId}disLowVent`);
  if (matchedModifiers.includes('wet-still-air')) return i18n.t(`${tId}wetStill`);
  if (matchedModifiers.includes('dark-no-light')) return i18n.t(`${tId}darkNoLight`);
  if (matchedModifiers.includes('hot-high-heat')) return i18n.t(`${tId}hotHighHeat`);
  if (matchedModifiers.includes('cold-high-heat')) return i18n.t(`${tId}coldHighHeat`);
  if (matchedModifiers.includes('dark-full-light')) return i18n.t(`${tId}darkFullLight`);
  if (matchedModifiers.includes('disease-high-vent')) return i18n.t(`${tId}disHighVent`);

  const drivers = [
    { key: 'growthScore', value: delta.growthScore, labelKey: 'growth' },
    { key: 'diseaseRisk', value: -delta.diseaseRisk, labelKey: 'disease' },
    { key: 'rootMoistureScore', value: delta.rootMoistureScore, labelKey: 'moisture' },
    { key: 'lightScore', value: delta.lightScore, labelKey: 'light' },
    { key: 'costScore', value: delta.costScore, labelKey: 'cost' },
  ];

  const top = drivers.reduce((best, d) => (Math.abs(d.value) > Math.abs(best.value) ? d : best));

  if (Math.abs(top.value) < 2) return i18n.t(`${tId}neutral`);
  
  const translatedLabel = i18n.t(`${tId}labels.${top.labelKey}`);
  
  if (top.value > 0) return i18n.t(`${tId}biggestGain`, { label: translatedLabel, val: top.value.toFixed(1) });
  return i18n.t(`${tId}biggestLoss`, { label: translatedLabel, val: top.value.toFixed(1) });
}

// ── Sentence 2.5: Why Detail (Deep Dive) ────────────────────────

function buildWhyDetail({ action, day, triggeredPenalties }: FeedbackInput): string {
  // A simple structured educational blurb.
  // We can build this from raw conditions instead of just rule matching.
  const isKo = i18n.language.startsWith('ko');
  
  const rules = [];
  if (action.irrigation === 'high' && action.ventilation === 'low') {
    rules.push(isKo 
      ? '관수를 많이 한 상태에서 환기를 안 하면 공기 중 습도가 100%에 달해 잿빛곰팡이병 포자가 발아하기 완벽한 환경이 됩니다.'
      : 'High irrigation without ventilation creates ~100% humidity, perfect for Gray Mold spores to germinate.');
  }
  if (day.outside_temp_level === 'low' && action.heating === 'low') {
    rules.push(isKo 
      ? '밤 기온이 너무 낮을 때 난방을 하지 않으면 뿌리 활력이 떨어져 물과 양분 흡수를 전혀 하지 못합니다.'
      : 'When night temperatures drop, lack of heating shuts down root activity, preventing nutrient uptake.');
  }
  if (triggeredPenalties.includes('drought-stress')) {
    rules.push(isKo
      ? '토양 내 수분張力이 너무 높아져 작물이 물을 빨아들이는 힘보다 흙이 물을 잡고 있는 힘이 커진 상태(위조점)입니다.'
      : 'Soil tension has exceeded the roots ability to extract water, leading to permanent wilting point if not reversed.');
  }

  if (rules.length > 0) return rules.join(' ');

  return isKo 
    ? '농업은 다양한 환경 인자(온도, 습도, 광량)가 어떻게 상호작용하는지 이해하고 밸런스를 맞추는 과정입니다.'
    : 'Agriculture is about balancing interacting environmental factors (temperature, humidity, light) to create optimal growth conditions.';
}

// ── Sentence 3: Tomorrow's recommendation ───────────────────────

function buildRecommendation(state: SimulationState, currentDay: number): string {
  const tId = 'engine.rec.';

  if (currentDay >= 14) return i18n.t(`${tId}final`);

  if (state.diseaseRisk > 70) return i18n.t(`${tId}ventHigh`);
  if (state.rootMoistureScore < 35) return i18n.t(`${tId}irrigNormal`);
  if (state.rootMoistureScore > 82) return i18n.t(`${tId}irrigDownVentUp`);
  if (state.diseaseRisk > 50) return i18n.t(`${tId}ventUp`);
  if (state.lightScore < 40) return i18n.t(`${tId}lightOn`);
  if (state.growthScore < 45) return i18n.t(`${tId}checkHeat`);
  if (state.costScore < 45) return i18n.t(`${tId}reduceCost`);

  return i18n.t(`${tId}stable`);
}
