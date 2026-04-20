interface ProgressBarProps {
  value: number;       // 0–100
  max?: number;
  label?: string;
  colorClass?: string; // Tailwind bg-* class
  showPercent?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  colorClass = 'bg-brand-500',
  showPercent = true,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full space-y-1">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-slate-400">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
