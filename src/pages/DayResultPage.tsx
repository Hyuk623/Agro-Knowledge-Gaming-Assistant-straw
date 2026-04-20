import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../context/SessionContext';
import Timeline from '../components/Timeline';
import CropVisualizer from '../components/CropVisualizer';
import StatusPanel from '../components/StatusPanel';
import { getCurrentScenario, MOCK_SCENARIO_DAYS } from '../data/mockData';
import { ChevronDown, ChevronUp, AlertCircle, TrendingUp, CheckCircle2, BotMessageSquare } from 'lucide-react';

export default function DayResultPage() {
  const navigate = useNavigate();
  const { session, results, lastResult, totalScore } = useSession();
  const { t } = useTranslation();
  const [showDetail, setShowDetail] = useState(false);

  if (!session || !lastResult || !lastResult.feedback_data) {
    return (
      <div className="p-8 text-white min-h-dvh bg-slate-900">
        No result available. Start a day first!
        <button onClick={() => navigate('/')} className="block mt-4 text-brand-400 underline">Home</button>
      </div>
    );
  }

  const scenario = getCurrentScenario(session.scenario_id);
  const isFinalDay = lastResult.day_number >= scenario.duration_days;
  const fb = lastResult.feedback_data;
  const dayData = MOCK_SCENARIO_DAYS.find(d => d.scenario_id === scenario.id && d.day_number === lastResult.day_number);

  const getStatusColor = (lbl: string) => {
    if (lbl === 'risky') return 'bg-red-500 text-white';
    if (lbl === 'caution') return 'bg-yellow-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getStatusIcon = (lbl: string) => {
    if (lbl === 'risky') return <AlertCircle size={14} />;
    if (lbl === 'caution') return <AlertCircle size={14} />;
    return <CheckCircle2 size={14} />;
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900 pb-safe">
      <Timeline currentDay={lastResult.day_number} totalDays={scenario.duration_days} results={results} />

      <div className="flex-1 px-4 py-8 overflow-y-auto space-y-6">
        
        {/* Big Score Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
            {t('common.day', { day: lastResult.day_number })} {t('play.dailyFeedback')}
          </div>
          
          <div className="text-5xl font-black tracking-tighter text-white mb-2">
            {totalScore}
          </div>
          
          <div className="font-bold text-sm">
            {lastResult.score_delta > 0 ? (
              <span className="text-brand-400">{t('play.pointsEarned', { points: lastResult.score_delta })}</span>
            ) : lastResult.score_delta < 0 ? (
              <span className="text-red-400">{t('play.pointsLost', { points: Math.abs(lastResult.score_delta) })}</span>
            ) : (
              <span className="text-slate-400">0 pts</span>
            )}
          </div>
        </div>

        {/* Visualizer */}
        <CropVisualizer simState={lastResult.sim_state} day={dayData} />

        {/* Detailed Status Panel */}
        <StatusPanel simState={lastResult.sim_state} />

        {/* Status Bubble */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(fb.statusLabel)} mx-auto mt-2`}>
          {getStatusIcon(fb.statusLabel)} {t(`play.status.${fb.statusLabel}`)}
        </div>

        {/* New 3-part educational layout */}
        <div className="space-y-3 pt-2">
           {/* Block 1: What changed */}
           <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> {t('play.resultWhat')}
              </h3>
              <p className="text-sm text-slate-200 font-medium leading-relaxed break-keep">
                {fb.whatChanged}
              </p>
           </div>

           {/* Block 2: Why it happened */}
           <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> {t('play.resultWhy')}
              </h3>
              <p className="text-sm text-slate-200 font-medium leading-relaxed break-keep">
                {fb.whyItChanged}
              </p>

              <button 
                onClick={() => setShowDetail(!showDetail)}
                className="w-full mt-3 flex items-center justify-between px-3 py-2 bg-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition"
              >
                 {t('play.resultWhyDetail')}
                 {showDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showDetail && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-sm text-slate-300 leading-relaxed break-keep animate-in slide-in-from-top-2">
                   {fb.whyDetail}
                </div>
              )}
           </div>

           {/* Block 3: Tomorrow's tip */}
           <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-4">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <BotMessageSquare size={14} /> {t('play.resultTomorrow')}
              </h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed break-keep">
                {fb.tomorrow}
              </p>
           </div>
        </div>

      </div>

      {/* Footer sticky bottom */}
      <div className="shrink-0 p-4 bg-slate-900 border-t border-slate-800 z-10 w-full relative">
        <button
          onClick={() => navigate(isFinalDay ? '/report' : '/play')}
          className="w-full bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-900/40"
        >
          {isFinalDay ? t('play.finish') : t('play.nextDay')}
        </button>
      </div>
    </div>
  );
}
