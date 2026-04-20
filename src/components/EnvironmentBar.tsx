
import type { ScenarioDay } from '../types';
import { useTranslation } from 'react-i18next';
import { Thermometer, Sun, Bug } from 'lucide-react';

interface EnvironmentBarProps {
  day: ScenarioDay;
}

export default function EnvironmentBar({ day }: EnvironmentBarProps) {
  const { t } = useTranslation();

  const getLevelColor = (type: 'temp' | 'sun' | 'disease', level: string) => {
    if (type === 'disease' && level === 'high') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (type === 'disease' && level === 'normal') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (type === 'disease') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

    if (type === 'temp' && level === 'low') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (type === 'temp' && level === 'high') return 'bg-red-500/20 text-red-300 border-red-500/30';
    
    if (type === 'sun' && level === 'high') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (type === 'sun' && level === 'low') return 'bg-slate-500/20 text-slate-300 border-slate-500/30';

    return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
  };

  return (
    <div className="flex gap-2 w-full pt-1 pb-3 overflow-x-auto snap-x scrollbar-hide">
      <div className={`snap-center shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border ${getLevelColor('temp', day.outside_temp_level)}`}>
        <Thermometer size={16} />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase opacity-70 leading-none">{t('play.conditions.temp')}</span>
          <span className="text-sm font-black leading-tight">{t(`common.level.${day.outside_temp_level}`)}</span>
        </div>
      </div>

      <div className={`snap-center shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border ${getLevelColor('sun', day.sunlight_level)}`}>
        <Sun size={16} />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase opacity-70 leading-none">{t('play.conditions.sun')}</span>
          <span className="text-sm font-black leading-tight">{t(`common.level.${day.sunlight_level}`)}</span>
        </div>
      </div>

      <div className={`snap-center shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border ${getLevelColor('disease', day.disease_pressure_level)}`}>
        <Bug size={16} />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase opacity-70 leading-none">{t('play.conditions.disease')}</span>
          <span className="text-sm font-black leading-tight">{t(`common.level.${day.disease_pressure_level}`)}</span>
        </div>
      </div>
    </div>
  );
}
