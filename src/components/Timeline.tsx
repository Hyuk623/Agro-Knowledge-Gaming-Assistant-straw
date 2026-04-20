
import type { DailyResult } from '../types';

interface TimelineProps {
  currentDay: number;
  totalDays: number;
  results?: DailyResult[]; // optional past data
}

export default function Timeline({ currentDay, totalDays, results = [] }: TimelineProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="w-full bg-slate-800 p-4 border-b border-slate-700">
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        <span>Timeline</span>
        <span>Day {currentDay} / {totalDays}</span>
      </div>
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 h-1 bg-slate-700 top-1/2 -translate-y-1/2 z-0" />
        {/* Fill line */}
        <div 
          className="absolute left-0 h-1 bg-brand-500 top-1/2 -translate-y-1/2 z-0 transition-all" 
          style={{ width: `${(currentDay / totalDays) * 100}%` }}
        />

        {days.map((day) => {
          const isPast = day < currentDay;
          const isCurrent = day === currentDay;
          const res = results.find(r => r.day_number === day);
          
          let circleClass = "w-3 h-3 bg-slate-700 border-2 border-slate-900"; // default future
          if (isCurrent) {
            circleClass = "w-4 h-4 bg-white ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-800 z-10 scale-125";
          } else if (isPast) {
            if (res && res.score_delta > 3) circleClass = "w-3 h-3 bg-emerald-400 z-10"; // Good day
            else if (res && res.score_delta < -3) circleClass = "w-3 h-3 bg-red-400 z-10"; // Bad day
            else circleClass = "w-3 h-3 bg-brand-500 z-10"; // Neutral day
          }

          return (
            <div key={day} className={`rounded-full transition-all duration-300 ${circleClass}`} title={`Day ${day}`} />
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[9px] text-emerald-400 font-bold">Good</span>
        <span className="text-[9px] text-red-400 font-bold">Warning</span>
      </div>
    </div>
  );
}
