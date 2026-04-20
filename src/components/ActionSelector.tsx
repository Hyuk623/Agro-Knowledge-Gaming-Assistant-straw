import { useTranslation } from 'react-i18next';

interface ActionSelectorProps {
  label: string;
  options: readonly string[];
  currentValue: string;
  onChange: (val: string) => void;
}

export default function ActionSelector({
  label,
  options,
  currentValue,
  onChange,
}: ActionSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 mb-3">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{label}</div>
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const isSelected = opt === currentValue;
          const displayLabel = t(`common.level.${opt}`);
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
