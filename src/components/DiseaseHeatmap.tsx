import type { DailyResult } from '../types';

export default function DiseaseHeatmap({ results, totalDays }: { results: DailyResult[], totalDays: number }) {
  if (!results) return null;

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
         <span>Disease Risk Heatmap</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
         {days.map(d => {
            const res = results.find(r => r.day_number === d);
            let risk = 0;
            let bg = 'bg-slate-900 border border-slate-700';
            
            if (res) {
               risk = res.sim_state.diseaseRisk;
               if (risk < 40) bg = 'bg-emerald-500/80 shadow-inner shadow-emerald-900';
               else if (risk <= 70) bg = 'bg-yellow-500/80 shadow-inner shadow-yellow-900';
               else bg = 'bg-red-500/80 shadow-inner shadow-red-900';
            }

            return (
              <div key={d} className={`aspect-square rounded flex items-center justify-center ${bg}`} title={`Day ${d}: ${risk.toFixed(0)}% Risk`}>
                 <span className="text-[8px] font-bold text-white/50">{d}</span>
              </div>
            );
         })}
      </div>
      <div className="mt-2 flex items-center gap-2 justify-end">
          <div className="w-2 h-2 rounded bg-emerald-500/80" /> <span className="text-[9px] text-slate-400 font-bold uppercase mr-1">Stable</span>
          <div className="w-2 h-2 rounded bg-yellow-500/80" /> <span className="text-[9px] text-slate-400 font-bold uppercase mr-1">Caution</span>
          <div className="w-2 h-2 rounded bg-red-500/80" /> <span className="text-[9px] text-slate-400 font-bold uppercase">Risky</span>
      </div>
    </div>
  );
}
