// ─────────────────────────────────────────────
// Core domain types for Agro-Knowledge Gaming Assistant
// Strawberry Edition MVP
// ─────────────────────────────────────────────

/** Low/normal/high scale used across conditions and actions */
export type LevelScale = 'low' | 'normal' | 'high';

/** Lighting action options */
export type LightingOption = 'off' | 'auto' | 'on';

// ─── Crop ────────────────────────────────────

export interface Crop {
  id: string;
  name: string;              // e.g. "Strawberry"
  name_ko: string;           // Korean label
  image_url?: string;
  description?: string;
  optimal_temp_min_c: number;
  optimal_temp_max_c: number;
  created_at: string;
}

// ─── Scenario ────────────────────────────────

export interface Scenario {
  id: string;
  crop_id: string;
  title: string;
  title_ko?: string;
  description: string;
  description_ko?: string;
  duration_days: number;     // 14 for MVP
  difficulty: 'tutorial' | 'beginner' | 'intermediate' | 'advanced';
  learning_goal?: string;    // E.g. "Learn to manage irrigation"
  learning_goal_ko?: string;
  allowed_controls?: ('irrigation' | 'heating' | 'ventilation' | 'lighting')[];
  is_active: boolean;
  created_at: string;
}

export interface EventCard {
  title: string;
  title_ko?: string;
  description: string;
  description_ko?: string;
  type: 'weather' | 'disease' | 'growth';
}

// ─── ScenarioDay ─────────────────────────────

/** Environmental conditions for a single day of the scenario */
export interface ScenarioDay {
  id: string;
  scenario_id: string;
  day_number: number;        // 1–14
  outside_temp_level: LevelScale;
  sunlight_level: LevelScale;
  disease_pressure_level: LevelScale;
  narrative_hint?: string;   // Optional flavour text
  narrative_hint_ko?: string;
  daily_objective?: string;  // Direct learning objective for the day
  daily_objective_ko?: string;
  event_card?: EventCard;    // Pop up event
}

// ─── PlaySession ─────────────────────────────

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface PlaySession {
  id: string;
  scenario_id: string;
  user_id?: string;          // null for guest mode
  guest_id?: string;
  current_day: number;       // 1-indexed day player is on
  status: SessionStatus;
  final_score?: number;      // 0-100, set on completion
  started_at: string;
  completed_at?: string;
}

// ─── DailyAction ─────────────────────────────

export interface DailyAction {
  id: string;
  session_id: string;
  day_number: number;
  irrigation: LevelScale;
  heating: LevelScale;
  ventilation: LevelScale;
  lighting: LightingOption;
  submitted_at: string;
}

// ─── DailyResult ─────────────────────────────

/** Computed crop status snapshot after applying actions */
export interface CropStatus {
  health_score: number;      // 0–100
  growth_stage: string;      // e.g. "Flowering", "Fruiting"
  water_stress: LevelScale;
  temperature_stress: LevelScale;
  disease_risk: LevelScale;
  notes: string[];           // Short advisory messages
}

export interface DailyFeedback {
  whatChanged: string;
  whyItChanged: string;
  whyDetail: string;
  tomorrow: string;
  statusLabel: 'stable' | 'caution' | 'risky';
}

export interface DailyResult {
  id: string;
  session_id: string;
  day_number: number;
  crop_status: CropStatus;
  sim_state: SimulationState;    // Full numeric state snapshot for this day
  score_delta: number;           // Points earned/lost this day
  feedback_messages: string[];   // Legacy string array
  feedback_data?: DailyFeedback; // New structured educational feedback
  calculated_at: string;
}

// ─── Simulation State ─────────────────────────

/** All numeric state variables tracked by the simulation engine */
export interface SimulationState {
  growthScore: number;        // 0–100  cumulative crop growth quality
  rootMoistureScore: number;  // 0–100  optimal 45–75
  lightScore: number;         // 0–100  accumulated photosynthesis sufficiency
  diseaseRisk: number;        // 0–100  lower = healthier
  yieldPotential: number;     // 0–100  projected harvest quality
  costScore: number;          // 0–100  higher = more economical
}

/** Per-variable change for a single day (positive or negative) */
export interface StateDelta {
  growthScore: number;
  rootMoistureScore: number;
  lightScore: number;
  diseaseRisk: number;
  yieldPotential: number;
  costScore: number;
}

// ─── Final Report ─────────────────────────────

export type Grade = 'S' | 'A' | 'B' | 'C' | 'F';

export interface DayDecisionNote {
  day_number: number;
  note: string;
  type: 'good' | 'bad';
}

export interface FinalReport {
  final_state: SimulationState;
  grade: Grade;
  grade_score: number;             // 0–100 composite
  top_good_decisions: DayDecisionNote[];
  top_mistakes: DayDecisionNote[];
  final_yield_label: string;       // e.g. "Good Yield"
  cost_efficiency_label: string;   // e.g. "Efficient"
  disease_outcome_label: string;   // e.g. "Under Control"
  summary_sentences: string[];     // 3-sentence final narrative
  badges?: string[];
  most_risky_day?: number;
  retry_recommendation?: string;
  retry_recommendation_ko?: string;
}

// ─── RuleSet ─────────────────────────────────

/** Decision rule: if condition matches actions, apply outcome */
export interface RuleCondition {
  outside_temp_level?: LevelScale;
  sunlight_level?: LevelScale;
  disease_pressure_level?: LevelScale;
}

export interface RuleAction {
  irrigation?: LevelScale;
  heating?: LevelScale;
  ventilation?: LevelScale;
  lighting?: LightingOption;
}

export interface RuleOutcome {
  score_delta: number;
  feedback: string;
  health_delta: number;
}

export interface RuleSet {
  id: string;
  scenario_id: string;
  name: string;
  condition: RuleCondition;
  action: RuleAction;
  outcome: RuleOutcome;
  priority: number;          // Higher = evaluated first
  created_at: string;
}

// ─── Quiz ─────────────────────────────────────

export type QuizType = 'multiple_choice' | 'true_false';

export interface QuizItem {
  id: string;
  scenario_id?: string;
  crop_id?: string;
  question: string;
  image_url?: string;
  question_ko?: string;
  type: QuizType;
  options: string[];         // Array of answer options
  options_ko?: string[];
  correct_index: number;    // Index into options[]
  explanation: string;
  explanation_ko?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  session_id: string;
  quiz_item_id: string;
  selected_index: number;
  is_correct: boolean;
  answered_at: string;
}

// ─── UI helpers ──────────────────────────────

/** Combined view model used in PlayPage */
export interface DayViewModel {
  day: ScenarioDay;
  previousResult?: DailyResult;
  currentSession: PlaySession;
}

/** Draft state held in PlayPage before submission */
export interface DailyActionDraft {
  irrigation: LevelScale;
  heating: LevelScale;
  ventilation: LevelScale;
  lighting: LightingOption;
}
