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
    <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/50">
      <div className="text-sm font-semibold text-slate-300 mb-2.5 ml-1">{label}</div>
      <div className="flex gap-2">
        {options.map((opt) => {
          const isSelected = opt === currentValue;
          const displayLabel = t(`common.level.${opt}`);
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.3)] shadow-brand-700 ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-800'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
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
