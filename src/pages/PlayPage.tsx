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
import { ArrowLeft, BotMessageSquare, Sprout, DollarSign, Bug, ShieldCheck, Play } from 'lucide-react';

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

  useEffect(() => {
    if (!session) {
      navigate('/');
    } else if (session.status === 'completed') {
      navigate('/report');
    }
  }, [session, navigate]);

  useEffect(() => {
    // Reset draft when a new day starts
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
  const healthPercent = simState.growthScore * 0.5 + (100 - simState.diseaseRisk) * 0.5;
  const isDiseased = simState.diseaseRisk > 50;
  
  const allowedControls = scenario.allowed_controls || ['irrigation', 'heating', 'ventilation', 'lighting'];

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900 pb-safe">
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

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

        {/* 1. Environment section */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            Today's Environment
          </h2>
          <EnvironmentBar day={currentDayData} />
        </div>

        {/* 2. Visualizer (Tycoon Mini Board) */}
        <CropVisualizer simState={simState} day={currentDayData} />

        {/* 3. Current Status Panel */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 grid grid-cols-3 gap-2">
           <div className="flex flex-col items-center justify-center bg-slate-800/80 rounded-xl p-2 border border-slate-700">
             <Sprout size={16} className="text-brand-400 mb-1" />
             <span className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Growth</span>
             <span className="text-sm font-black text-white">{simState.growthScore.toFixed(0)}</span>
           </div>
           <div className="flex flex-col items-center justify-center bg-slate-800/80 rounded-xl p-2 border border-slate-700">
             <DollarSign size={16} className="text-yellow-400 mb-1" />
             <span className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Yield Est.</span>
             <span className="text-sm font-black text-white">{simState.yieldPotential.toFixed(0)}</span>
           </div>
           <div className={`flex flex-col items-center justify-center rounded-xl p-2 border ${isDiseased ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
             {isDiseased ? <Bug size={16} className="text-rose-400 mb-1" /> : <ShieldCheck size={16} className="text-emerald-400 mb-1" />}
             <span className={`text-[10px] uppercase font-bold mb-0.5 ${isDiseased ? 'text-rose-400' : 'text-emerald-400'}`}>Condition</span>
             <span className={`text-sm font-black ${isDiseased ? 'text-white' : 'text-white'}`}>{isDiseased ? 'Risky' : 'Stable'}</span>
           </div>
        </div>

        {/* 4. Advisor Hint & Objective */}
        <div className="flex flex-col gap-3">
          {(currentDayData.daily_objective || currentDayData.daily_objective_ko) && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex gap-3 items-center">
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">🎯</div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 mb-0.5 uppercase tracking-wide">Daily Goal</div>
                <div className="text-sm font-bold text-emerald-100 break-keep leading-snug">
                  {isKo && currentDayData.daily_objective_ko ? currentDayData.daily_objective_ko : currentDayData.daily_objective}
                </div>
              </div>
            </div>
          )}

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex gap-3 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
              <BotMessageSquare size={20} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                {t('advisor.title')}
              </h3>
              <p className="text-sm text-indigo-50 leading-snug font-medium break-keep">
                {t(hintKey)}
              </p>
            </div>
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
          className="group w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 active:scale-95 transition-all text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-900/40 flex justify-center items-center gap-3 mt-4 mb-4"
        >
          <span>RUN PROGRESS</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Play size={16} className="fill-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
