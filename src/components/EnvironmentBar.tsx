import type { ScenarioDay } from '../types';
import { useTranslation } from 'react-i18next';
import { Thermometer, Sun, Bug, AlertTriangle } from 'lucide-react';

interface EnvironmentBarProps {
  day: ScenarioDay;
}

export default function EnvironmentBar({ day }: EnvironmentBarProps) {
  const { t, i18n } = useTranslation();
  const isKo = i18n.language.startsWith('ko');

  const getLevelStyle = (type: 'temp' | 'sun' | 'disease', level: string) => {
    if (type === 'disease' && level === 'high') return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (type === 'disease' && level === 'normal') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (type === 'disease') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

    if (type === 'temp' && level === 'low') return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (type === 'temp' && level === 'high') return 'bg-red-500/10 text-red-400 border-red-500/30';
    
    if (type === 'sun' && level === 'high') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (type === 'sun' && level === 'low') return 'bg-slate-500/10 text-slate-400 border-slate-500/30';

    return 'bg-slate-800/50 text-slate-300 border-slate-700/50';
  };

  const hasEvent = !!day.event_card;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Event Banner */}
      {hasEvent && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full" />
          <div className="w-10 h-10 shrink-0 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 border border-rose-500/20">
            <AlertTriangle size={20} />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-[10px] uppercase font-black text-rose-400 tracking-widest">{t('play.eventTitle')}</span>
            <span className="text-sm font-bold text-white shadow-sm">
              {isKo && day.event_card?.title_ko ? day.event_card.title_ko : day.event_card?.title}
            </span>
          </div>
        </div>
      )}

      {/* Main Environmental Factors Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${getLevelStyle('temp', day.outside_temp_level)}`}>
          <div className="flex items-center gap-1.5 opacity-80">
            <Thermometer size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('play.conditions.temp')}</span>
          </div>
          <span className="text-sm font-black mt-1">{t(`common.level.${day.outside_temp_level}`)}</span>
        </div>

        <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${getLevelStyle('sun', day.sunlight_level)}`}>
          <div className="flex items-center gap-1.5 opacity-80">
            <Sun size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('play.conditions.sun')}</span>
          </div>
          <span className="text-sm font-black mt-1">{t(`common.level.${day.sunlight_level}`)}</span>
        </div>

        <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${getLevelStyle('disease', day.disease_pressure_level)}`}>
          <div className="flex items-center gap-1.5 opacity-80">
            <Bug size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none line-clamp-1">{t('play.conditions.disease')}</span>
          </div>
          <span className="text-sm font-black mt-1">{t(`common.level.${day.disease_pressure_level}`)}</span>
        </div>
      </div>
    </div>
  );
}
