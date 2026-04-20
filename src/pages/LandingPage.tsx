import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf, Sprout, PlayCircle, BarChart3, RotateCcw, Globe } from 'lucide-react';
import { MOCK_SCENARIO_MAIN, MOCK_CROP } from '../data/mockData';
import { useSession } from '../context/SessionContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { session, resetSession, startSession } = useSession();
  const { t, i18n } = useTranslation();

  const handleStartNew = () => {
    resetSession();
    setTimeout(() => {
      startSession(); // Starts tutorial flow
      navigate('/play');
    }, 50);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('ko') ? 'en' : 'ko');
  };

  const hasInProgressSession = session?.status === 'in_progress';
  const hasCompletedSession = session?.status === 'completed';

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950">
      {/* Header with Lang Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-700 transition"
        >
          <Globe size={14} />
          {i18n.language.toUpperCase()}
        </button>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-16 pb-8 text-center gap-6">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-brand-900/50 border border-brand-700/50 px-4 py-1.5 rounded-full">
          <Sprout size={14} className="text-brand-400" />
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
            {t('landing.badge')}
          </span>
        </div>

        {/* Big emoji */}
        <div className="text-8xl animate-bounce [animation-duration:3s]">🍓</div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            {t('landing.title')}<br />
            <span className="text-brand-400">{t('landing.subtitle')}</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            {t('landing.description')}
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { icon: '📅', label: t('landing.stats.days') },
            { icon: '🌡', label: t('landing.stats.scenario') },
            { icon: '🏆', label: t('landing.stats.score') },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full text-xs text-slate-300"
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-4 w-full max-w-xs space-y-3">
          {hasInProgressSession && (
            <button
              onClick={() => navigate('/play')}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-brand-900/40"
            >
              <PlayCircle size={18} />
              {t('landing.actions.resume', { day: session.current_day })}
            </button>
          )}

          {hasCompletedSession && (
            <button
              onClick={() => navigate('/report')}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-brand-900/40"
            >
              <BarChart3 size={18} />
              {t('landing.actions.viewReport')}
            </button>
          )}

          <button
            onClick={handleStartNew}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all active:scale-95 ${
              session ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/40'
            }`}
          >
            {session ? <><RotateCcw size={16} /> {t('common.startOver')}</> : t('landing.actions.startNew')}
          </button>
          
          <button
            onClick={() => navigate('/quiz')}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold py-3.5 rounded-2xl transition-all active:scale-95"
          >
            {t('landing.actions.quiz')}
          </button>
        </div>

        <p className="text-xs text-slate-600">{t('landing.actions.guestMode')}</p>
      </div>

      {/* Footer */}
      <div className="pb-8 flex justify-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Leaf size={12} />
          <span>{i18n.language.startsWith('ko') ? MOCK_CROP.name_ko : MOCK_CROP.name} · {t('landing.actions.difficulty', { difficulty: MOCK_SCENARIO_MAIN.difficulty })}</span>
        </div>
      </div>
    </div>
  );
}
