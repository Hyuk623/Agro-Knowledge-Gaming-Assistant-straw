import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { MOCK_SCENARIO_MAIN, MOCK_CROP } from '../data/mockData';

const TIPS = [
  { icon: '💧', text: 'Reduce irrigation on cold days to prevent root rot.' },
  { icon: '🔥', text: 'Keep heating high when outside temperature is low.' },
  { icon: '🌬', text: 'Increase ventilation when disease pressure is high.' },
  { icon: '💡', text: 'Turn on supplemental lighting on cloudy days.' },
];

export default function ScenarioIntroPage() {
  const navigate = useNavigate();
  const { startSession } = useSession();

  const handleStart = () => {
    startSession();
    navigate('/play');
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900 px-4 py-6 gap-5">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm w-fit"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Title card */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-900/50 to-slate-800/70 border border-brand-700/30 p-5 space-y-3">
        <div className="text-5xl">🍓</div>
        <h1 className="text-xl font-extrabold text-white leading-snug">
          {MOCK_SCENARIO_MAIN.title}
        </h1>
        <p className="text-sm text-slate-400">{MOCK_SCENARIO_MAIN.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Tag>🌱 {MOCK_CROP.name}</Tag>
          <Tag>📅 {MOCK_SCENARIO_MAIN.duration_days} Days</Tag>
          <Tag>⭐ {MOCK_SCENARIO_MAIN.difficulty}</Tag>
          <Tag>🌡 {MOCK_CROP.optimum_temp_night}–{MOCK_CROP.optimum_temp_day}°C optimal</Tag>
        </div>
      </div>

      {/* How to play */}
      <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <BookOpen size={16} className="text-brand-400" />
          <span>How to Play</span>
        </div>
        <ul className="space-y-2.5">
          {[
            'Each day you choose 4 actions: irrigation, heating, ventilation, and lighting.',
            'Conditions change daily. React to the weather and disease pressure.',
            'Your crop health and score update after every decision.',
            'After 14 days you receive a final grade and report.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
              <span className="bg-brand-900/60 text-brand-400 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-4 space-y-3">
        <span className="text-sm font-semibold text-slate-300">🧠 Quick Tips</span>
        <ul className="space-y-2">
          {TIPS.map((t) => (
            <li key={t.icon} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="shrink-0">{t.icon}</span>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        id="btn-begin-scenario"
        onClick={handleStart}
        className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-900/40"
      >
        Begin Day 1
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-slate-700/60 border border-slate-600/40 text-slate-300 px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}
