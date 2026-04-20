import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../context/SessionContext';
import { BarChart3, Home, RotateCcw, AlertTriangle, GraduationCap, PlayCircle, Star, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { gradeColor, gradeLabel } from '../lib/reportGenerator';
import { getScenarioFlow, getCurrentScenario } from '../data/mockData';
import TrendGraphs from '../components/TrendGraphs';
import DiseaseHeatmap from '../components/DiseaseHeatmap';

export default function FinalReportPage() {
  const navigate = useNavigate();
  const { session, results, finalReport, previousReport, resetSession, startSession } = useSession();
  const { t, i18n } = useTranslation();

  if (!finalReport) {
    return (
      <div className="p-8 text-white min-h-dvh bg-slate-900">
        No report available. Play a session first.
        <button onClick={() => navigate('/')} className="block mt-4 text-brand-400 underline">Home</button>
      </div>
    );
  }

  const {
    grade,
    grade_score,
    top_good_decisions,
    top_mistakes,
    summary_sentences,
    most_risky_day,
    badges,
    retry_recommendation,
  } = finalReport;

  const isKo = i18n.language.startsWith('ko');
  const handleStartOver = () => {
    resetSession();
    navigate('/');
  };

  const nextScenario = session ? getScenarioFlow(session.scenario_id) : null;
  const currentScenario = session ? getCurrentScenario(session.scenario_id) : null;
  const isMain = currentScenario?.id === 'scenario-winter-1';

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900 pb-safe">
      <header className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur z-10 flex items-center justify-between">
         <div className="flex items-center gap-2 text-brand-400">
           <BarChart3 size={20} />
           <span className="font-bold text-sm uppercase tracking-widest">{t('report.title')}</span>
          </div>
         <div className="text-xs font-bold text-slate-400">{t('report.daysPlayed')}: {results?.length || currentScenario?.duration_days}</div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8">
        
        {/* Core Outcome Envelope */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl relative border border-slate-700/50">
           {/* Badges Floating Top Right */}
           {badges && badges.length > 0 && (
              <div className="absolute top-4 right-4 flex gap-1">
                 {badges.map(b => (
                   <span key={b} className="text-xl drop-shadow-md" title={t(`report.badges.${b}`)}>
                     {t(`report.badges.${b}`).split(' ')[0]}
                   </span>
                 ))}
              </div>
           )}

           <div className="text-[10px] font-bold text-brand-400/80 uppercase tracking-widest mb-1">
             {isKo && currentScenario?.title_ko ? currentScenario?.title_ko : currentScenario?.title}
           </div>
           
           <h2 className={`text-6xl font-black ${gradeColor(grade)} mb-1 drop-shadow-lg`}>{grade}</h2>
           <div className="text-sm font-bold text-slate-300 mb-6">{gradeLabel(grade)} — {t('report.compositeScore')}: {grade_score}/100</div>

           <div className="space-y-4">
              {summary_sentences.map((s, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed font-medium break-keep">
                  {s}
                </p>
              ))}
           </div>
        </div>

        {/* Replay Comparison */}
        {previousReport && (
          <div className="bg-indigo-900/30 rounded-2xl border border-indigo-500/30 p-5">
             <h3 className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-3">{t('report.compare.title')}</h3>
             <div className="grid grid-cols-2 gap-3">
                <CompareMetric label={t('report.compositeScore')} current={grade_score} previous={previousReport.grade_score} />
                <CompareMetric label={t('report.diseaseControl')} current={100 - finalReport.final_state.diseaseRisk} previous={100 - previousReport.final_state.diseaseRisk} />
                <CompareMetric label={t('report.yield')} current={finalReport.final_state.yieldPotential} previous={previousReport.final_state.yieldPotential} />
                <CompareMetric label={t('report.cost')} current={finalReport.final_state.costScore} previous={previousReport.final_state.costScore} />
             </div>
          </div>
        )}

        {/* Breakdown bars & Charts */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-6">
           <div>
             <h3 className="text-white font-bold mb-4">{t('report.breakdown')}</h3>
             <div className="space-y-4">
               <ScoreBar label={t('report.yieldPotential')} val={finalReport.final_state.yieldPotential} />
               <ScoreBar label={t('report.diseaseControl')} val={100 - finalReport.final_state.diseaseRisk} />
               <ScoreBar label={t('report.growthScore')} val={finalReport.final_state.growthScore} />
               <ScoreBar label={t('report.costEfficiency')} val={finalReport.final_state.costScore} />
             </div>
           </div>
           
           <div className="border-t border-slate-700/50 pt-6"></div>
           <TrendGraphs results={results || []} />
           
           <div className="border-t border-slate-700/50 pt-6"></div>
           <DiseaseHeatmap results={results || []} totalDays={currentScenario?.duration_days || 14} />
        </div>

        {/* Reflection & Learning Summary */}
        <div className="space-y-5">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Learning Reflection</h3>

           {/* Good decisions */}
           {top_good_decisions.length > 0 && (
             <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-5">
                <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><Star size={16} /> {t('report.bestDecisions')}</h4>
                <ul className="space-y-3">
                  {top_good_decisions.map((g, i) => (
                    <li key={i} className="text-sm text-emerald-100/80 leading-snug break-keep flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span> <span>{g.note}</span>
                    </li>
                  ))}
                </ul>
             </div>
           )}

           {/* Mistakes */}
           {top_mistakes.length > 0 && (
             <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-5">
                <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2"><AlertTriangle size={16} /> {t('report.biggestMistakes')}</h4>
                <ul className="space-y-3">
                  {top_mistakes.map((m, i) => (
                    <li key={i} className="text-sm text-red-200/80 leading-snug break-keep flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> <span>{m.note}</span>
                    </li>
                  ))}
                </ul>
                {most_risky_day !== undefined && (
                  <div className="mt-4 pt-3 border-t border-red-900/30 text-xs font-bold text-red-400">
                     Most Risky Day: Day {most_risky_day}
                  </div>
                )}
             </div>
           )}

           {/* Strategy for next time */}
           {retry_recommendation && (
             <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-5 flex gap-3">
                <Info className="text-blue-400 shrink-0" size={18} />
                <div>
                   <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">{t('report.retryTip.title')}</h4>
                   <p className="text-sm text-blue-100/90 leading-relaxed font-medium break-keep">
                     {retry_recommendation}
                   </p>
                </div>
             </div>
           )}
        </div>

        <div className="pt-8 pb-10 space-y-3">
          {/* Main call to action is the Quiz to reinforce learning */}
          {isMain && (
             <div className="mb-6 space-y-2">
               <div className="text-center text-xs font-bold text-indigo-400 mb-2">Test your diagnostic skills!</div>
               <button 
                  onClick={() => navigate('/quiz')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-900/50 active:scale-95 transition"
               >
                  <GraduationCap size={18} /> {t('report.takeQuiz')} 
               </button>
             </div>
          )}

          {!isMain && nextScenario && (
             <button 
               onClick={() => { resetSession(); setTimeout(() => { startSession(nextScenario.id); navigate('/play'); }, 50); }}
               className="w-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition"
             >
               <PlayCircle size={18} /> {isKo && nextScenario.title_ko ? nextScenario.title_ko : nextScenario.title}
             </button>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={() => { resetSession(); setTimeout(() => { startSession(currentScenario?.id); navigate('/play'); }, 50); }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition"
            >
              <RotateCcw size={18} /> {t('common.playAgain')}
            </button>
            <button 
              onClick={() => handleStartOver()}
              className="px-6 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 active:scale-95 transition"
            >
              <Home size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, val }: { label: string, val: number }) {
  let color = 'bg-brand-500';
  if (val < 40) color = 'bg-red-500';
  else if (val < 70) color = 'bg-yellow-500';

  return (
    <div>
       <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="text-slate-300">{val.toFixed(0)}</span>
       </div>
       <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
       </div>
    </div>
  );
}

function CompareMetric({ label, current, previous }: { label: string, current: number, previous: number }) {
  const diff = current - previous;
  const isBetter = diff > 0;
  const isWorse = diff < 0;

  return (
    <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/20">
      <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1 line-clamp-1">{label}</div>
      <div className="flex items-end justify-between">
         <span className="text-lg font-black text-indigo-100">{current.toFixed(0)}</span>
         <div className={`flex items-center text-[10px] font-bold ${isBetter ? 'text-emerald-400' : isWorse ? 'text-red-400' : 'text-slate-400'}`}>
           {isBetter ? <TrendingUp size={12} className="mr-0.5" /> : isWorse ? <TrendingDown size={12} className="mr-0.5" /> : <Minus size={12} className="mr-0.5" />}
           {Math.abs(diff).toFixed(0)}
         </div>
      </div>
    </div>
  );
}
