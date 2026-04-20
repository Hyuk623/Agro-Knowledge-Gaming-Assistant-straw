import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, RotateCcw, Home } from 'lucide-react';
import { MOCK_QUIZ_ITEMS } from '../data/mockData';

export default function QuizPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // State machine: 'start' | 'playing' | 'summary'
  const [gameState, setGameState] = useState<'start' | 'playing' | 'summary'>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // State for current question
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = MOCK_QUIZ_ITEMS[currentIndex];
  const isKo = i18n.language.startsWith('ko');

  const questionText = isKo && currentQuestion.question_ko ? currentQuestion.question_ko : currentQuestion.question;
  const optionsList = isKo && currentQuestion.options_ko ? currentQuestion.options_ko : currentQuestion.options;
  const explanationText = isKo && currentQuestion.explanation_ko ? currentQuestion.explanation_ko : currentQuestion.explanation;

  const handleStart = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return; // Prevent changing answer after submitted
    setSelectedOption(idx);
    setShowExplanation(true);
    
    if (idx === currentQuestion.correct_index) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < MOCK_QUIZ_ITEMS.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('summary');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-dvh flex flex-col bg-slate-900 px-4 py-8 items-center justify-center">
        <div className="w-20 h-20 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-3 text-center">
          {t('quiz.title')}<br/>{t('quiz.subtitle')}
        </h1>
        <p className="text-slate-400 text-sm text-center mb-10 max-w-xs">
          {t('quiz.description')}
        </p>
        
        <div className="w-full flex-col flex gap-3 pb-8">
          <button 
            onClick={handleStart}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold"
          >
            {t('quiz.start')}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 text-slate-300 py-4 rounded-xl font-semibold"
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const percentage = Math.round((score / MOCK_QUIZ_ITEMS.length) * 100);
    return (
      <div className="min-h-dvh flex flex-col bg-slate-900 px-4 py-8 items-center justify-center">
        <h2 className="text-slate-400 font-semibold mb-2">{t('quiz.completed')}</h2>
        <div className="text-6xl font-black text-white mb-6 tracking-tighter">
          {score}<span className="text-2xl text-slate-500">/{MOCK_QUIZ_ITEMS.length}</span>
        </div>
        
        <div className="bg-slate-800/80 border border-slate-700 w-full rounded-2xl p-6 text-center space-y-2 mb-10">
          <p className="font-bold text-white text-lg">
            {percentage >= 80 ? t('quiz.excellent') 
              : percentage >= 50 ? t('quiz.good') 
              : t('quiz.needsPractice')}
          </p>
          <p className="text-sm text-slate-400">
            {t('quiz.accuracy', { percentage })}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={handleStart}
            className="flex w-full items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl"
          >
            <RotateCcw size={18} /> {t('quiz.retry')}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex w-full items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 rounded-xl"
          >
            <Home size={18} /> {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shrink-0">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center relative -left-2 text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
            {t('quiz.questionPos', { current: currentIndex + 1, total: MOCK_QUIZ_ITEMS.length })}
          </span>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 w-full shrink-0">
        <div 
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / MOCK_QUIZ_ITEMS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5 pb-24">
          
          {/* Image */}
          {currentQuestion.image_url && (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-800 relative">
              <img 
                src={currentQuestion.image_url} 
                alt="Disease symptom"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-lg font-bold text-white leading-snug break-keep">
            {questionText}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {optionsList.map((opt, idx) => {
               const isSelected = selectedOption === idx;
               const isCorrect = idx === currentQuestion.correct_index;
               
               let btnClass = "text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex justify-between items-center bg-slate-800 border-slate-700/50 hover:border-slate-600 text-slate-200 break-keep";
               let Icon = null;
               
               if (showExplanation) {
                 if (isCorrect) {
                   btnClass = "text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex justify-between items-center bg-brand-900/40 border-brand-500 text-brand-100 ring-1 ring-brand-500/50 break-keep";
                   Icon = <CheckCircle2 className="text-brand-400" size={18} />;
                 } else if (isSelected && !isCorrect) {
                   btnClass = "text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex justify-between items-center bg-red-900/30 border-red-500 text-red-200 stroke-red-500 line-through decoration-red-500/50 break-keep";
                   Icon = <XCircle className="text-red-400" size={18} />;
                 } else {
                   btnClass = "text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex justify-between items-center bg-slate-800 border-transparent opacity-50 text-slate-400 break-keep";
                 }
               } else if (isSelected) {
                 btnClass = "text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex justify-between items-center bg-slate-700 border-slate-500 text-white break-keep";
               }

               return (
                 <button 
                   key={idx}
                   onClick={() => handleSelectOption(idx)}
                   disabled={showExplanation}
                   className={btnClass}
                 >
                   <span>{opt}</span>
                   {Icon}
                 </button>
               );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 ${
              selectedOption === currentQuestion.correct_index 
              ? 'bg-brand-900/20 border-brand-800' 
              : 'bg-red-900/20 border-red-900/50'
            }`}>
              <h3 className={`text-xs font-bold mb-1.5 uppercase tracking-wide ${
                selectedOption === currentQuestion.correct_index ? 'text-brand-400' : 'text-red-400'
              }`}>
                {selectedOption === currentQuestion.correct_index ? t('quiz.correct') : t('quiz.incorrect')}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed break-keep">
                {explanationText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer sticky bottom */}
      {showExplanation && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-5">
           <button 
             onClick={handleNext}
             className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
           >
             {currentIndex + 1 < MOCK_QUIZ_ITEMS.length ? t('quiz.nextQuestion') : t('quiz.viewResults')}
             <ChevronRight size={18} />
           </button>
        </div>
      )}
    </div>
  );
}
