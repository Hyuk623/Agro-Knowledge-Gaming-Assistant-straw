import type {
  DailyResult,
  DailyAction,
  ScenarioDay,
  SimulationState,
  FinalReport,
  Grade,
  DayDecisionNote,
} from '../types';
import i18n from '../i18n';

/**
 * Generate the complete end-of-game report.
 */
export function generateFinalReport(
  results:  DailyResult[],
  actions:  DailyAction[],
  days:     ScenarioDay[],
): FinalReport {
  if (results.length === 0) throw new Error('generateFinalReport: results array is empty');

  const finalState = results[results.length - 1].sim_state;

  const gradeScore = Math.round(
    finalState.yieldPotential * 0.40 +
    (100 - finalState.diseaseRisk) * 0.30 +
    finalState.costScore * 0.20 +
    finalState.growthScore * 0.10,
  );

  const grade = scoreToGrade(gradeScore);

  const sortedByWorst = [...results].sort((a, b) => a.score_delta - b.score_delta);
  const top_mistakes: DayDecisionNote[] = sortedByWorst
    .filter(r => r.score_delta < -2)
    .slice(0, 3)
    .map(r => ({
      day_number: r.day_number,
      note:       buildMistakeNote(r, findAction(actions, r.day_number), findDay(days, r.day_number)),
      type:       'bad' as const,
    }));

  const top_good_decisions: DayDecisionNote[] = [...results]
    .sort((a, b) => b.score_delta - a.score_delta)
    .filter(r => r.score_delta > 1)
    .slice(0, 3)
    .map(r => ({
      day_number: r.day_number,
      note:       buildGoodNote(r, findAction(actions, r.day_number), findDay(days, r.day_number)),
      type:       'good' as const,
    }));

  const worstDayByDelta = [...results].sort((a, b) => a.score_delta - b.score_delta)[0];
  const most_risky_day = worstDayByDelta ? worstDayByDelta.day_number : undefined;

  const badges: string[] = [];
  const maxDiseaseRisk = Math.max(...results.map(r => r.sim_state.diseaseRisk));
  const minScoreDelta = Math.min(...results.map(r => r.score_delta));
  if (maxDiseaseRisk <= 40) badges.push('disease_control');
  if (finalState.costScore >= 75) badges.push('low_cost');
  if (minScoreDelta >= -1) badges.push('stable_streak');
  if (finalState.yieldPotential >= 85) badges.push('yield_master');

  let retry_recommendation = i18n.t('report.retryTip.default');
  if (finalState.diseaseRisk > 60) retry_recommendation = i18n.t('report.retryTip.disease');
  else if (finalState.costScore < 45) retry_recommendation = i18n.t('report.retryTip.cost');
  else if (finalState.growthScore < 50) retry_recommendation = i18n.t('report.retryTip.growth');

  return {
    final_state:           finalState,
    grade,
    grade_score:           gradeScore,
    top_good_decisions,
    top_mistakes,
    final_yield_label:     yieldLabel(finalState.yieldPotential),
    cost_efficiency_label: costLabel(finalState.costScore),
    disease_outcome_label: diseaseLabel(finalState.diseaseRisk),
    summary_sentences:     buildSummary(finalState, grade, gradeScore, results),
    most_risky_day,
    badges,
    retry_recommendation,
  };
}

export function scoreToGrade(score: number): Grade {
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'F';
}

export function gradeLabel(grade: Grade): string {
  const lbl = i18n.t(`report.grades.${grade}`);
  return lbl;
}

export function gradeColor(grade: Grade): string {
  const map: Record<Grade, string> = {
    S: 'text-amber-400',
    A: 'text-brand-400',
    B: 'text-sky-400',
    C: 'text-yellow-400',
    F: 'text-red-400',
  };
  return map[grade];
}

export function yieldLabel(yieldPotential: number): string {
  const pre = 'report.labels.yield.';
  if (yieldPotential >= 80) return i18n.t(`${pre}exc`);
  if (yieldPotential >= 65) return i18n.t(`${pre}good`);
  if (yieldPotential >= 50) return i18n.t(`${pre}avg`);
  if (yieldPotential >= 35) return i18n.t(`${pre}poor`);
  return i18n.t(`${pre}fail`);
}

export function costLabel(costScore: number): string {
  const pre = 'report.labels.cost.';
  if (costScore >= 75) return i18n.t(`${pre}v_eff`);
  if (costScore >= 55) return i18n.t(`${pre}eff`);
  if (costScore >= 40) return i18n.t(`${pre}over`);
  return i18n.t(`${pre}costly`);
}

export function diseaseLabel(diseaseRisk: number): string {
  const pre = 'report.labels.disease.';
  if (diseaseRisk <= 25) return i18n.t(`${pre}ctrl`);
  if (diseaseRisk <= 45) return i18n.t(`${pre}mng`);
  if (diseaseRisk <= 65) return i18n.t(`${pre}high`);
  return i18n.t(`${pre}unctrl`);
}

// ── Private note builders ────────────────────────────────────────

function buildMistakeNote(
  result:  DailyResult,
  action?: DailyAction,
  day?:    ScenarioDay,
): string {
  const tId = 'engine.report.notes.';

  // Fall back to action description
  if (action && day) {
    if (day.outside_temp_level === 'low' && action.heating === 'low')
      return i18n.t(`${tId}lowHeat`, { day: result.day_number, pts: result.score_delta });
    if (action.irrigation === 'high' && action.ventilation === 'low')
      return i18n.t(`${tId}wetSoil`, { day: result.day_number, pts: result.score_delta });
    if (day.sunlight_level === 'low' && action.lighting === 'off')
      return i18n.t(`${tId}noLight`, { day: result.day_number, pts: result.score_delta });
  }

  // Use feedback message second sentence if no specific matched actions
  if (result.feedback_messages.length > 1) {
    return i18n.t(`${tId}relay`, { day: result.day_number, msg: result.feedback_messages[1] });
  }

  return i18n.t(`${tId}badGen`, { day: result.day_number, pts: result.score_delta });
}

function buildGoodNote(
  result:  DailyResult,
  action?: DailyAction,
  day?:    ScenarioDay,
): string {
  const tId = 'engine.report.notes.';

  if (action && day) {
    if (day.outside_temp_level === 'low' && action.heating === 'high')
      return i18n.t(`${tId}highHeat`, { day: result.day_number, pts: result.score_delta });
    if (day.disease_pressure_level === 'high' && action.ventilation === 'high')
      return i18n.t(`${tId}highVent`, { day: result.day_number, pts: result.score_delta });
    if (day.sunlight_level === 'low' && action.lighting === 'on')
      return i18n.t(`${tId}goodLight`, { day: result.day_number, pts: result.score_delta });
  }

  if (result.feedback_messages.length > 1) {
    return i18n.t(`${tId}relay`, { day: result.day_number, msg: result.feedback_messages[1] });
  }

  return i18n.t(`${tId}goodGen`, { day: result.day_number, pts: result.score_delta });
}

function buildSummary(
  finalState: SimulationState,
  grade:      Grade,
  gradeScore: number,
  results:    DailyResult[],
): string[] {
  const totalScore = results.reduce((s, r) => s + r.score_delta, 0);
  const tId = 'engine.report.summary.';

  const s1 = grade === 'S' || grade === 'A'
    ? i18n.t(`${tId}s1.good`, { score: gradeScore })
    : grade === 'B'
    ? i18n.t(`${tId}s1.ok`, { score: gradeScore })
    : i18n.t(`${tId}s1.bad`, { score: gradeScore });

  const s2 = finalState.diseaseRisk > 60
    ? i18n.t(`${tId}s2.disease`)
    : finalState.costScore < 45
    ? i18n.t(`${tId}s2.cost`)
    : finalState.yieldPotential > 70
    ? i18n.t(`${tId}s2.yield`, { yield: finalState.yieldPotential.toFixed(0) })
    : i18n.t(`${tId}s2.growth`);

  const s3 = totalScore > 0
    ? i18n.t(`${tId}s3.win`, { pts: totalScore })
    : i18n.t(`${tId}s3.loss`, { pts: Math.abs(totalScore) });

  return [s1, s2, s3];
}

// ── Utility ──────────────────────────────────────────────────────

function findAction(actions: DailyAction[], day: number): DailyAction | undefined {
  return actions.find(a => a.day_number === day);
}

function findDay(days: ScenarioDay[], day: number): ScenarioDay | undefined {
  return days.find(d => d.day_number === day);
}
