import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  PlaySession,
  DailyAction,
  DailyResult,
  DailyActionDraft,
  SimulationState,
  FinalReport,
} from '../types';
import { MOCK_SCENARIO_DAYS, getScenarioFlow, getCurrentScenario } from '../data/mockData';
import { initSimulationState, computeDayResult } from '../lib/simulationEngine';
import { generateDayFeedback } from '../lib/feedbackGenerator';
import { generateFinalReport } from '../lib/reportGenerator';

// ─────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────

interface SessionState {
  session:    PlaySession | null;
  simState:   SimulationState;          // Live simulation state (updates each day)
  actions:    DailyAction[];
  results:    DailyResult[];
  finalReport: FinalReport | null;
  previousReport?: FinalReport | null;
}

const STORAGE_KEY = 'agro_sim_session_v1';

const defaultState: SessionState = {
  session: null,
  simState: initSimulationState(),
  actions: [],
  results: [],
  finalReport: null,
};

type SessionAction =
  | { type: 'START_SESSION'; payload: PlaySession }
  | { type: 'SUBMIT_DAY'; payload: { action: DailyAction; result: DailyResult; nextSim: SimulationState } }
  | { type: 'COMPLETE_SESSION'; payload: { finalScore: number; report: FinalReport } }
  | { type: 'RESET' };

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session:     action.payload,
        simState:    initSimulationState(),
        actions:     [],
        results:     [],
        previousReport: state.finalReport || state.previousReport,
        finalReport: null,
      };

    case 'SUBMIT_DAY': {
      const { action: act, result, nextSim } = action.payload;
      const updatedSession = state.session
        ? { ...state.session, current_day: state.session.current_day + 1 }
        : null;
      return {
        ...state,
        session:  updatedSession,
        simState: nextSim,
        actions:  [...state.actions, act],
        results:  [...state.results, result],
      };
    }

    case 'COMPLETE_SESSION':
      return state.session
        ? {
            ...state,
            session: {
              ...state.session,
              status:       'completed',
              completed_at: new Date().toISOString(),
              final_score:  action.payload.finalScore,
            },
            finalReport: action.payload.report,
          }
        : state;

    case 'RESET':
      return {
        session:     null,
        simState:    initSimulationState(),
        actions:     [],
        results:     [],
        previousReport: null,
        finalReport: null,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

interface SessionContextValue extends SessionState {
  startSession:  (scenarioId?: string) => void;
  submitDay:     (draft: DailyActionDraft) => DailyResult;
  resetSession:  () => void;
  currentDayData: ReturnType<typeof MOCK_SCENARIO_DAYS['find']> | null;
  lastResult:    DailyResult | null;
  totalScore:    number;
}
// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext<SessionContextValue | undefined>(undefined);
let _guestCounter = 0;

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or use default
  const [state, dispatch] = useReducer(sessionReducer, defaultState, (initial) => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached) as SessionState;
      }
    } catch (e) {
      console.warn('Failed to parse cached session', e);
    }
    return initial;
  });

  // Automatically save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save session to localStorage', e);
    }
  }, [state]);

  const startSession = useCallback((scenarioId?: string) => {
    _guestCounter += 1;
    const nextScenario = getScenarioFlow(scenarioId);
    const session: PlaySession = {
      id:          `session-guest-${_guestCounter}-${Date.now()}`,
      scenario_id: nextScenario.id,
      guest_id:    `guest-${_guestCounter}`,
      current_day: 1,
      status:      'in_progress',
      started_at:  new Date().toISOString(),
    };
    dispatch({ type: 'START_SESSION', payload: session });
    // TODO (Phase 2): persist session to Supabase play_sessions
  }, []);

  const submitDay = useCallback(
    (draft: DailyActionDraft): DailyResult => {
      if (!state.session) throw new Error('submitDay called with no active session');

      const dayNumber = state.session.current_day;
      const dayData   = MOCK_SCENARIO_DAYS.find(d => d.day_number === dayNumber);
      if (!dayData) throw new Error(`Day ${dayNumber} not found in scenario`);

      // ── Run the real simulation engine ──
      const { dayCompute, result } = computeDayResult(
        state.simState,
        dayData,
        draft,
        state.session.id,
      );

      // ── Generate deterministic feedback ──
      const feedbackObj = generateDayFeedback({
        day:                dayData,
        action:             draft,
        prevState:          state.simState,
        nextState:          dayCompute.nextState,
        delta:              dayCompute.delta,
        matchedModifiers:   dayCompute.matchedModifiers,
        triggeredPenalties: dayCompute.triggeredPenalties,
      });

      result.feedback_messages = feedbackObj.messages;
      result.feedback_data = feedbackObj.data;

      const submitAction: DailyAction = {
        id:           `action-${state.session.id}-day${dayNumber}`,
        session_id:   state.session.id,
        day_number:   dayNumber,
        ...draft,
        submitted_at: new Date().toISOString(),
      };

      dispatch({
        type:    'SUBMIT_DAY',
        payload: { action: submitAction, result, nextSim: dayCompute.nextState },
      });

      // TODO (Phase 2): persist action + result to Supabase

      // ── Auto-complete on final day ──
      const scenario = getCurrentScenario(state.session.scenario_id);
      const isLastDay = dayNumber >= scenario.duration_days;
      if (isLastDay) {
        const allActions  = [...state.actions, submitAction];
        const allResults  = [...state.results, result];
        const scenarioDays = MOCK_SCENARIO_DAYS.filter(d => d.scenario_id === scenario.id);
        const finalReport = generateFinalReport(allResults, allActions, scenarioDays);
        const finalScore  = allResults.reduce((s, r) => s + r.score_delta, 0);

        dispatch({ type: 'COMPLETE_SESSION', payload: { finalScore, report: finalReport } });
        // TODO (Phase 2): update Supabase play_sessions.status + final_score
      }

      return result;
    },
    [state.session, state.simState, state.actions, state.results],
  );

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentDayData =
    state.session
      ? MOCK_SCENARIO_DAYS.find(d => d.scenario_id === state.session!.scenario_id && d.day_number === state.session!.current_day) ?? null
      : null;

  const lastResult  = state.results.at(-1) ?? null;
  const totalScore  = state.results.reduce((s, r) => s + r.score_delta, 0);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        startSession,
        submitDay,
        resetSession,
        currentDayData,
        lastResult,
        totalScore,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
