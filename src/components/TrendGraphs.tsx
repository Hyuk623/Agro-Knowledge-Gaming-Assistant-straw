import type { DailyResult } from '../types';

export default function TrendGraphs({ results }: { results: DailyResult[] }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-4">
      <MiniChart data={results.map(r => r.sim_state.growthScore)} color="#10b981" label="Growth Score" />
      <MiniChart data={results.map(r => r.sim_state.diseaseRisk)} color="#f87171" label="Disease Risk" />
      <MiniChart data={results.map(r => r.sim_state.costScore)} color="#818cf8" label="Cost Efficiency" />
    </div>
  );
}

function MiniChart({ data, color, label }: { data: number[], color: string, label: string }) {

  const count = Math.max(14, data.length);
  const dx = 100 / (count - 1);

  // Build SVG path
  const points = data.map((val, i) => `${i * dx},${100 - val}`).join(' L ');
  const pathData = `M 0,${100 - (data[0] || 0)} L ${points}`;

  return (
    <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex flex-col gap-2">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
         <span>{label}</span>
         {data.length > 0 && <span style={{ color }}>{data[data.length - 1].toFixed(0)}</span>}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12 overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        
        {/* Data lines */}
        <path d={pathData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points */}
        {data.map((val, i) => (
          <circle key={i} cx={i * dx} cy={100 - val} r="1.5" fill={color} />
        ))}
      </svg>
    </div>
  );
}
