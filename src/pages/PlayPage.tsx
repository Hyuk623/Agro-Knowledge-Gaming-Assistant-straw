import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../context/SessionContext';
import ActionSelector from '../components/ActionSelector';
import Timeline from '../components/Timeline';
import CropVisualizer from '../components/CropVisualizer';
import EnvironmentBar from '../components/EnvironmentBar';
import { getAdvisorHintKey, getPreActionTradeoffs } from '../lib/advisorRules';
import { getCurrentScenario } from '../data/mockData';
import type { DailyActionDraft } from '../types';
import { ArrowLeft, BotMessageSquare, AlertCircle } from 'lucide-react';

export default function PlayPage() {
  const navigate = useNavigate();
  const { session, results, simState, currentDayData, submitDay } = useSession();
  const { t, i18n } = useTranslation();
  const isKo = i18n.language.startsWith('ko');

  const [draft, setDraft] = useState<DailyActionDraft>({
    irrigation: 'normal',
    heating: 'normal',
    ventilation: 'normal',
    lighting: 'auto',
  });
  
  const [eventConfirmed, setEventConfirmed] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/');
    } else if (session.status === 'completed') {
      navigate('/report');
    }
  }, [session, navigate]);

  useEffect(() => {
    // Reset confirmation status and draft when a new day starts
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventConfirmed(false);
    setDraft({
      irrigation: 'normal',
      heating: 'normal',
      ventilation: 'normal',
      lighting: 'auto',
    });
  }, [session?.current_day]);

  if (!session || !currentDayData) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  const scenario = getCurrentScenario(session.scenario_id);
  const totalDays = scenario.duration_days;

  const handleActionChange = (key: keyof DailyActionDraft, val: string) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    submitDay(draft);
    if (session.current_day >= totalDays) {
      navigate('/report');
    } else {
      navigate('/result');
    }
  };

  const hintKey = getAdvisorHintKey(currentDayData);
  const tradeoffs = getPreActionTradeoffs(draft);
  const hasEvent = !!currentDayData.event_card;
  const isEventBlocking = hasEvent && !eventConfirmed;
  
  const allowedControls = scenario.allowed_controls || ['irrigation', 'heating', 'ventilation', 'lighting'];

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900 pb-safe">
      {/* Event Block Overlay */}
      {isEventBlocking && currentDayData.event_card && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                 <AlertCircle size={32} />
              </div>
              <h2 className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1">{t('play.eventTitle')}</h2>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                 {isKo && currentDayData.event_card.title_ko ? currentDayData.event_card.title_ko : currentDayData.event_card.title}
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                 {isKo && currentDayData.event_card.description_ko ? currentDayData.event_card.description_ko : currentDayData.event_card.description}
              </p>
              <button 
                onClick={() => setEventConfirmed(true)}
                className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold active:scale-95 transition-transform"
              >
                {t('play.eventConfirm')}
              </button>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shrink-0">
         <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center relative -left-2 text-slate-400 hover:text-white">
           <ArrowLeft size={20} />
         </button>
         <div className="flex flex-col items-center">
           <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
             {isKo && scenario.title_ko ? scenario.title_ko : scenario.title}
           </span>
           <span className="text-sm font-black text-white">{t('common.day', { day: session.current_day })}</span>
         </div>
         <div className="w-10 h-10 flex items-center justify-center relative -right-2">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-brand-400 ring-1 ring-brand-500/20">
             {(simState.growthScore).toFixed(0)}
           </div>
         </div>
      </header>

      {/* Progress */}
      <Timeline currentDay={session.current_day} totalDays={totalDays} results={results || []} />

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        
        {/* Daily Objective if present */}
        {(currentDayData.daily_objective || currentDayData.daily_objective_ko) && (
          <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-3 flex gap-3 animate-pulse">
            <div className="shrink-0 text-emerald-400 pt-0.5">🎯</div>
            <div>
              <div className="text-[10px] font-bold text-emerald-400/80 mb-0.5 uppercase tracking-wide">{t('play.objective')}</div>
              <div className="text-sm font-semibold text-emerald-100 break-keep">
                {isKo && currentDayData.daily_objective_ko ? currentDayData.daily_objective_ko : currentDayData.daily_objective}
              </div>
            </div>
          </div>
        )}

        {/* Environment section */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {t('play.environment')}
          </h2>
          <EnvironmentBar day={currentDayData} />
        </div>

        {/* Visualizer */}
        <CropVisualizer simState={simState} day={currentDayData} />

        {/* Advisor Hint */}
        <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 flex gap-3 shadow-lg shadow-indigo-900/20">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300">
            <BotMessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              {t('advisor.title')}
            </h3>
            <p className="text-sm text-indigo-100/90 leading-snug font-medium break-keep">
              {t(hintKey)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            {t('play.actionsTitle')}
          </h2>
          <div className="space-y-4">
            {allowedControls.includes('irrigation') && (
              <ActionSelector
                label={t('play.irrigation')}
                options={['low', 'normal', 'high']}
                currentValue={draft.irrigation}
                onChange={(val) => handleActionChange('irrigation', val)}
              />
            )}
            {allowedControls.includes('heating') && (
              <ActionSelector
                label={t('play.heating')}
                options={['low', 'normal', 'high']}
                currentValue={draft.heating}
                onChange={(val) => handleActionChange('heating', val)}
              />
            )}
            {allowedControls.includes('ventilation') && (
              <ActionSelector
                label={t('play.ventilation')}
                options={['low', 'normal', 'high']}
                currentValue={draft.ventilation}
                onChange={(val) => handleActionChange('ventilation', val)}
              />
            )}
            {allowedControls.includes('lighting') && (
              <ActionSelector
                label={t('play.lighting')}
                options={['off', 'auto', 'on']}
                currentValue={draft.lighting}
                onChange={(val) => handleActionChange('lighting', val)}
              />
            )}
          </div>
        </div>

        {/* Pre-action trade-off hint block */}
        {tradeoffs.length > 0 && (
          <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 space-y-2">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('play.hintsTitle')}</div>
             <ul className="space-y-1">
               {tradeoffs.map((tk) => (
                 <li key={tk} className="text-sm text-slate-300 leading-snug break-keep flex items-start gap-2">
                   <span className="text-slate-500 mt-0.5">•</span>
                   <span>{t(tk)}</span>
                 </li>
               ))}
             </ul>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand-900/30 flex justify-center items-center gap-2 mb-8"
        >
          {t('play.submitDay')}
        </button>
      </div>
    </div>
  );
}
