import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import LandingPage from './pages/LandingPage';
import ScenarioIntroPage from './pages/ScenarioIntroPage';
import PlayPage from './pages/PlayPage';
import DayResultPage from './pages/DayResultPage';
import FinalReportPage from './pages/FinalReportPage';
import QuizPage from './pages/QuizPage';

// Mobile-first wrapper – constrains max-width to 420px and centres on desktop
function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-950 flex justify-center">
      <div className="w-full max-w-[420px] bg-slate-900 relative shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <MobileShell>
          <Routes>
            <Route path="/"             element={<LandingPage />} />
            <Route path="/intro"        element={<ScenarioIntroPage />} />
            <Route path="/play"         element={<PlayPage />} />
            <Route path="/day-result"   element={<DayResultPage />} />
            <Route path="/final-report" element={<FinalReportPage />} />
            <Route path="/quiz"         element={<QuizPage />} />
            {/* Fallback */}
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </MobileShell>
      </BrowserRouter>
    </SessionProvider>
  );
}
