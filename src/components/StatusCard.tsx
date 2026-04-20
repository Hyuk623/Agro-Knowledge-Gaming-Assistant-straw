import ProgressBar from './ProgressBar';
import type { CropStatus } from '../types';

interface StatusCardProps {
  cropStatus: CropStatus;
  dayNumber?: number;
}

const LEVEL_BADGE: Record<string, { label: string; cls: string }> = {
  low:    { label: 'Low',    cls: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' },
  normal: { label: 'Normal', cls: 'bg-slate-700/60   text-slate-300   border border-slate-600/50' },
  high:   { label: 'High',   cls: 'bg-red-900/60     text-red-300     border border-red-700/50' },
};

function healthColor(score: number) {
  if (score >= 70) return 'bg-brand-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function StatusCard({ cropStatus }: StatusCardProps) {
  const { health_score, growth_stage, water_stress, temperature_stress, disease_risk, notes } =
    cropStatus;

  return (
    <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">Crop Status</span>
        <span className="text-xs text-slate-500 bg-slate-700/60 px-2 py-0.5 rounded-full">{growth_stage}</span>
      </div>

      {/* Health bar */}
      <ProgressBar
        value={health_score}
        label="Health"
        colorClass={healthColor(health_score)}
        showPercent
      />

      {/* Stress indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <StressChip label="Water Stress" level={water_stress} />
        <StressChip label="Temp Stress" level={temperature_stress} />
        <StressChip label="Disease Risk" level={disease_risk} />
      </div>

      {/* Notes */}
      {notes.length > 0 && (
        <ul className="space-y-1">
          {notes.map((n, i) => (
            <li key={i} className="text-xs text-slate-400">
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StressChip({ label, level }: { label: string; level: 'low' | 'normal' | 'high' }) {
  const badge = LEVEL_BADGE[level];
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  );
}
