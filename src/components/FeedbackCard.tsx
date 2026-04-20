import { CheckCircle, XCircle, Info } from 'lucide-react';

interface FeedbackCardProps {
  messages: string[];
  scoreDelta: number;
  dayNumber: number;
}

export default function FeedbackCard({ messages, scoreDelta, dayNumber }: FeedbackCardProps) {
  const isPositive = scoreDelta >= 0;

  return (
    <div
      className={[
        'rounded-2xl border p-4 space-y-3',
        isPositive
          ? 'bg-brand-900/30 border-brand-700/50'
          : 'bg-red-900/30 border-red-700/50',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPositive ? (
            <CheckCircle size={18} className="text-brand-400" />
          ) : (
            <XCircle size={18} className="text-red-400" />
          )}
          <span className="text-sm font-semibold text-slate-200">Day {dayNumber} Result</span>
        </div>

        <span
          className={[
            'text-sm font-bold px-3 py-0.5 rounded-full',
            isPositive
              ? 'bg-brand-900/60 text-brand-300'
              : 'bg-red-900/60 text-red-300',
          ].join(' ')}
        >
          {isPositive ? '+' : ''}{scoreDelta} pts
        </span>
      </div>

      {/* Messages */}
      <ul className="space-y-1.5">
        {messages.map((msg, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <Info size={12} className="mt-0.5 shrink-0 text-slate-500" />
            <span>{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
