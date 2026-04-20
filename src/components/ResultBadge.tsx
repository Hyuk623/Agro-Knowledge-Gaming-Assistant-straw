interface ResultBadgeProps {
  score: number;        // Final 0–100 style total
  maxScore?: number;
}

function resolveGrade(score: number, max: number): { label: string; emoji: string; cls: string } {
  const pct = (score / max) * 100;
  if (pct >= 85) return { label: 'Expert Grower',   emoji: '🏆', cls: 'text-amber-400  border-amber-600/60  bg-amber-900/30'  };
  if (pct >= 65) return { label: 'Skilled Farmer',  emoji: '🥇', cls: 'text-brand-400  border-brand-600/60  bg-brand-900/30'  };
  if (pct >= 45) return { label: 'Apprentice',       emoji: '🥈', cls: 'text-sky-400    border-sky-600/60    bg-sky-900/30'    };
  return               { label: 'Needs Practice',   emoji: '🌱', cls: 'text-slate-400  border-slate-600/60  bg-slate-800/30'  };
}

export default function ResultBadge({ score, maxScore = 100 }: ResultBadgeProps) {
  const grade = resolveGrade(score, maxScore);

  return (
    <div className={`flex flex-col items-center gap-2 rounded-2xl border px-6 py-5 ${grade.cls}`}>
      <span className="text-5xl">{grade.emoji}</span>
      <span className="text-lg font-bold">{grade.label}</span>
      <span className="text-3xl font-extrabold">
        {score}
        <span className="text-base font-normal text-slate-400"> / {maxScore}</span>
      </span>
      <span className="text-xs text-slate-400">Final Score</span>
    </div>
  );
}
