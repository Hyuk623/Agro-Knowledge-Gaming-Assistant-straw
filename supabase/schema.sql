-- ============================================================
-- Agro-Knowledge Gaming Assistant – Supabase Schema
-- Strawberry Edition MVP
-- Run in Supabase SQL editor or via supabase/migrations/
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. CROPS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  name_ko                TEXT,
  image_url              TEXT,
  description            TEXT,
  optimal_temp_min_c     NUMERIC(4,1) NOT NULL DEFAULT 15,
  optimal_temp_max_c     NUMERIC(4,1) NOT NULL DEFAULT 22,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. SCENARIOS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scenarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id         UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  duration_days   INT NOT NULL DEFAULT 14,
  difficulty      TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. SCENARIO DAYS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scenario_days (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id              UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  day_number               INT NOT NULL,
  outside_temp_level       TEXT NOT NULL CHECK (outside_temp_level IN ('low','normal','high')),
  sunlight_level           TEXT NOT NULL CHECK (sunlight_level IN ('low','normal','high')),
  disease_pressure_level   TEXT NOT NULL CHECK (disease_pressure_level IN ('low','normal','high')),
  narrative_hint           TEXT,
  UNIQUE (scenario_id, day_number)
);

-- ─────────────────────────────────────────────
-- 4. USERS (extends Supabase auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. PLAY SESSIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS play_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id   UUID NOT NULL REFERENCES scenarios(id),
  user_id       UUID REFERENCES users(id),          -- NULL = guest
  guest_id      TEXT,                               -- Client-generated guest token
  current_day   INT NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','abandoned')),
  final_score   NUMERIC(6,2),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

-- ─────────────────────────────────────────────
-- 6. DAILY ACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES play_sessions(id) ON DELETE CASCADE,
  day_number    INT NOT NULL,
  irrigation    TEXT NOT NULL CHECK (irrigation IN ('low','normal','high')),
  heating       TEXT NOT NULL CHECK (heating IN ('low','normal','high')),
  ventilation   TEXT NOT NULL CHECK (ventilation IN ('low','normal','high')),
  lighting      TEXT NOT NULL CHECK (lighting IN ('off','auto','on')),
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, day_number)
);

-- ─────────────────────────────────────────────
-- 7. DAILY RESULTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES play_sessions(id) ON DELETE CASCADE,
  day_number          INT NOT NULL,
  health_score        NUMERIC(5,2) NOT NULL,
  growth_stage        TEXT,
  water_stress        TEXT CHECK (water_stress IN ('low','normal','high')),
  temperature_stress  TEXT CHECK (temperature_stress IN ('low','normal','high')),
  disease_risk        TEXT CHECK (disease_risk IN ('low','normal','high')),
  notes               TEXT[],                  -- Array of advisory strings
  score_delta         NUMERIC(6,2) NOT NULL DEFAULT 0,
  feedback_messages   TEXT[],
  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, day_number)
);

-- ─────────────────────────────────────────────
-- 8. RULE SETS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rule_sets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id  UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  condition    JSONB NOT NULL DEFAULT '{}',   -- RuleCondition
  action       JSONB NOT NULL DEFAULT '{}',   -- RuleAction
  outcome      JSONB NOT NULL DEFAULT '{}',   -- RuleOutcome
  priority     INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 9. QUIZ ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id     UUID REFERENCES scenarios(id),
  crop_id         UUID REFERENCES crops(id),
  question        TEXT NOT NULL,
  question_ko     TEXT,
  type            TEXT NOT NULL CHECK (type IN ('multiple_choice','true_false')),
  options         TEXT[] NOT NULL,
  correct_index   INT NOT NULL,
  explanation     TEXT,
  difficulty      TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 10. QUIZ ATTEMPTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES play_sessions(id) ON DELETE CASCADE,
  quiz_item_id    UUID NOT NULL REFERENCES quiz_items(id),
  selected_index  INT NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_scenario_days_scenario ON scenario_days(scenario_id);
CREATE INDEX IF NOT EXISTS idx_play_sessions_user ON play_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_play_sessions_guest ON play_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_daily_actions_session ON daily_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_results_session ON daily_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_rule_sets_scenario ON rule_sets(scenario_id, priority DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) stubs
-- TODO (Phase 2): Enable and tighten these policies
-- ─────────────────────────────────────────────
ALTER TABLE play_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_actions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts    ENABLE ROW LEVEL SECURITY;

-- Allow read-only access to reference data for everyone
CREATE POLICY "Public read crops"         ON crops         FOR SELECT USING (TRUE);
CREATE POLICY "Public read scenarios"     ON scenarios     FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read scenario_days" ON scenario_days FOR SELECT USING (TRUE);
CREATE POLICY "Public read quiz_items"    ON quiz_items    FOR SELECT USING (TRUE);
CREATE POLICY "Public read rule_sets"     ON rule_sets     FOR SELECT USING (TRUE);

-- Sessions: owner or guest token match
-- TODO (Phase 2): Replace guest_id comparison with a secure token check
CREATE POLICY "Users own sessions" ON play_sessions
  FOR ALL USING (
    auth.uid() = user_id OR
    guest_id IS NOT NULL   -- Guest sessions are open for MVP; restrict in production
  );
