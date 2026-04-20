import { Calendar, CloudSun, Wind } from 'lucide-react';
import type { ScenarioDay } from '../types';

interface DayHeaderProps {
  day: ScenarioDay;
  totalDays: number;
}

const LEVEL_LABEL: Record<string, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
};

const TEMP_COLOR: Record<string, string> = {
  low: 'text-sky-400',
  normal: 'text-emerald-400',
  high: 'text-orange-400',
};

const SUN_COLOR: Record<string, string> = {
  low: 'text-slate-400',
  normal: 'text-yellow-300',
  high: 'text-amber-400',
};

const DISEASE_COLOR: Record<string, string> = {
  low: 'text-emerald-400',
  normal: 'text-yellow-400',
  high: 'text-red-400',
};

export default function DayHeader({ day, totalDays }: DayHeaderProps) {
  return (
    <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-4 space-y-3">
      {/* Day label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-brand-400" />
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Day {day.day_number} / {totalDays}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {resolveStageLabel(day.day_number)}
        </span>
      </div>

      {/* Conditions row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <ConditionPill
          icon={<span className="text-base">🌡</span>}
          label="Outside Temp"
          value={LEVEL_LABEL[day.outside_temp_level]}
          colorClass={TEMP_COLOR[day.outside_temp_level]}
        />
        <ConditionPill
          icon={<CloudSun size={15} />}
          label="Sunlight"
          value={LEVEL_LABEL[day.sunlight_level]}
          colorClass={SUN_COLOR[day.sunlight_level]}
        />
        <ConditionPill
          icon={<Wind size={15} />}
          label="Disease"
          value={LEVEL_LABEL[day.disease_pressure_level]}
          colorClass={DISEASE_COLOR[day.disease_pressure_level]}
        />
      </div>

      {/* Narrative hint */}
      {day.narrative_hint && (
        <p className="text-xs text-slate-400 italic border-t border-slate-700/50 pt-2">
          "{day.narrative_hint}"
        </p>
      )}
    </div>
  );
}

function ConditionPill({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-900/40 rounded-xl py-2 px-1">
      <span className={`${colorClass}`}>{icon}</span>
      <span className="text-[10px] text-slate-500 leading-tight">{label}</span>
      <span className={`text-xs font-bold ${colorClass}`}>{value}</span>
    </div>
  );
}

function resolveStageLabel(day: number): string {
  if (day <= 3) return '🌱 Establishment';
  if (day <= 6) return '🌿 Vegetative';
  if (day <= 9) return '🌸 Flower Init';
  if (day <= 12) return '🍓 Fruiting';
  return '🍓 Ripening';
}
