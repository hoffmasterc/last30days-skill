import { type AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  showNav: boolean;
}

export default function Layout({
  children,
  darkMode,
  onToggleDarkMode,
  currentView,
  onNavigate,
  showNav,
}: LayoutProps) {
  const bg = darkMode ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text';

  return (
    <div className={`min-h-screen flex flex-col ${bg} transition-colors duration-300`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${
          darkMode
            ? 'bg-dark-bg/90 border-dark-card'
            : 'bg-light-surface/90 border-gray-200'
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => showNav && onNavigate('home')}
            className="flex items-center gap-2 font-semibold text-xl tracking-tight"
          >
            <span className="text-calm-400 text-2xl" aria-hidden="true">
              &#9672;
            </span>
            CalmCompete
          </button>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl transition-colors ${
                darkMode
                  ? 'bg-dark-card hover:bg-dark-muted/30'
                  : 'bg-light-card hover:bg-gray-200'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* Bottom nav — only shown after onboarding */}
      {showNav && (
        <nav
          className={`sticky bottom-0 border-t backdrop-blur-md ${
            darkMode
              ? 'bg-dark-bg/90 border-dark-card'
              : 'bg-light-surface/90 border-gray-200'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around">
            <NavButton
              label="Home"
              active={currentView === 'home'}
              darkMode={darkMode}
              onClick={() => onNavigate('home')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            />
            <NavButton
              label="Session"
              active={currentView === 'session'}
              darkMode={darkMode}
              onClick={() => onNavigate('session')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
            />
            <NavButton
              label="Progress"
              active={currentView === 'dashboard'}
              darkMode={darkMode}
              onClick={() => onNavigate('dashboard')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              }
            />
            <NavButton
              label="Learn"
              active={currentView === 'info'}
              darkMode={darkMode}
              onClick={() => onNavigate('info')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              }
            />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavButton({
  label,
  active,
  darkMode,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  darkMode: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
        active
          ? 'text-calm-400'
          : darkMode
            ? 'text-dark-muted hover:text-dark-text'
            : 'text-light-muted hover:text-light-text'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
