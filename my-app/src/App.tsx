import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Layout from './components/Layout';
import AgeGate from './components/AgeGate';
import Onboarding from './components/Onboarding';
import SessionFlow from './components/SessionFlow';
import Dashboard from './components/Dashboard';
import InfoSection from './components/InfoSection';
import type { AppView, Session } from './types';

export default function App() {
  const { data, updateAppState, addSession } = useLocalStorage();
  const { appState, sessions } = data;
  const { darkMode, ageVerified, onboardingComplete, currentView } = appState;

  // Apply dark/light class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('light', !darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => updateAppState({ darkMode: !darkMode });

  const navigate = (view: AppView) => updateAppState({ currentView: view });

  const handleAgeVerified = () => {
    updateAppState({ ageVerified: true, currentView: 'onboarding' });
  };

  const handleOnboardingComplete = () => {
    updateAppState({
      onboardingComplete: true,
      firstLaunchComplete: true,
      currentView: 'home',
    });
  };

  const handleSessionComplete = (session: Session) => {
    addSession(session);
    updateAppState({ currentView: 'home' });
  };

  const showNav = ageVerified && onboardingComplete;

  // Determine what to render
  let content: React.ReactNode;

  if (!ageVerified) {
    content = <AgeGate darkMode={darkMode} onVerified={handleAgeVerified} />;
  } else if (!onboardingComplete) {
    content = <Onboarding darkMode={darkMode} onComplete={handleOnboardingComplete} />;
  } else {
    switch (currentView) {
      case 'session':
        content = (
          <SessionFlow
            darkMode={darkMode}
            onComplete={handleSessionComplete}
            onCancel={() => navigate('home')}
          />
        );
        break;
      case 'dashboard':
        content = <Dashboard darkMode={darkMode} sessions={sessions} />;
        break;
      case 'info':
        content = <InfoSection darkMode={darkMode} />;
        break;
      default:
        content = <HomeScreen darkMode={darkMode} onNavigate={navigate} sessionCount={sessions.length} />;
    }
  }

  return (
    <Layout
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
      currentView={currentView}
      onNavigate={navigate}
      showNav={showNav}
    >
      {content}
    </Layout>
  );
}

function HomeScreen({
  darkMode,
  onNavigate,
  sessionCount,
}: {
  darkMode: boolean;
  onNavigate: (v: AppView) => void;
  sessionCount: number;
}) {
  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';
  const muted = darkMode ? 'text-dark-muted' : 'text-light-muted';

  return (
    <div className="flex-1 flex flex-col items-center gap-6 py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Ready to compete?</h1>
        <p className={`text-lg ${muted}`}>
          Take a few minutes to feel calm and focused before your event.
        </p>
      </div>

      {/* Main CTA */}
      <button
        onClick={() => onNavigate('session')}
        className="w-full max-w-md py-5 px-8 rounded-2xl font-bold text-xl bg-calm-500 hover:bg-calm-600 text-white shadow-lg shadow-calm-500/25 active:scale-[0.98] transition-all"
      >
        Start a Session
      </button>

      {/* Quick info cards */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`rounded-2xl border p-5 text-left transition-colors ${cardBg} ${cardBorder} hover:border-calm-400/50`}
        >
          <p className="text-3xl font-bold text-calm-400">{sessionCount}</p>
          <p className={`text-sm font-medium mt-1 ${muted}`}>
            {sessionCount === 1 ? 'Session' : 'Sessions'} completed
          </p>
        </button>
        <button
          onClick={() => onNavigate('info')}
          className={`rounded-2xl border p-5 text-left transition-colors ${cardBg} ${cardBorder} hover:border-calm-400/50`}
        >
          <p className="text-3xl">&#128218;</p>
          <p className={`text-sm font-medium mt-1 ${muted}`}>Learn about anxiety</p>
        </button>
      </div>

      {/* Motivational quote */}
      <div
        className={`w-full max-w-md rounded-2xl border p-6 text-center ${cardBg} ${cardBorder}`}
      >
        <p className="text-lg italic leading-relaxed">
          &ldquo;Courage is not the absence of fear, but the triumph over it.&rdquo;
        </p>
        <p className={`text-sm mt-2 ${muted}`}>— Nelson Mandela</p>
      </div>
    </div>
  );
}
