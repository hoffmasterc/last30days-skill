import { useState } from 'react';
import { ONBOARDING_SCREENS } from '../utils/constants';

interface OnboardingProps {
  darkMode: boolean;
  onComplete: () => void;
}

export default function Onboarding({ darkMode, onComplete }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const total = ONBOARDING_SCREENS.length;
  const screen = ONBOARDING_SCREENS[currentScreen];
  const isLast = currentScreen === total - 1;

  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
      {/* Card */}
      <div
        className={`w-full max-w-md rounded-2xl border p-8 text-center space-y-6 ${cardBg} ${cardBorder}`}
      >
        <div className="text-6xl" aria-hidden="true">
          {screen.icon}
        </div>
        <h2 className="text-2xl font-bold">{screen.title}</h2>
        <p
          className={`text-lg leading-relaxed ${
            darkMode ? 'text-dark-muted' : 'text-light-muted'
          }`}
        >
          {screen.description}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2" role="tablist" aria-label="Onboarding progress">
        {ONBOARDING_SCREENS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentScreen(i)}
            role="tab"
            aria-selected={i === currentScreen}
            aria-label={`Screen ${i + 1} of ${total}`}
            className={`h-2.5 rounded-full transition-all ${
              i === currentScreen
                ? 'w-8 bg-calm-400'
                : darkMode
                  ? 'w-2.5 bg-dark-card hover:bg-dark-muted'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 w-full max-w-md">
        {currentScreen > 0 && (
          <button
            onClick={() => setCurrentScreen((s) => s - 1)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-colors ${
              darkMode
                ? 'bg-dark-card hover:bg-dark-muted/30 text-dark-text'
                : 'bg-light-card hover:bg-gray-200 text-light-text'
            }`}
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (isLast) {
              onComplete();
            } else {
              setCurrentScreen((s) => s + 1);
            }
          }}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-calm-500 hover:bg-calm-600 text-white shadow-lg shadow-calm-500/25 active:scale-[0.98] transition-all"
        >
          {isLast ? "Let's Go!" : 'Next'}
        </button>
      </div>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onComplete}
          className={`text-sm underline ${
            darkMode ? 'text-dark-muted hover:text-dark-text' : 'text-light-muted hover:text-light-text'
          }`}
        >
          Skip intro
        </button>
      )}
    </div>
  );
}
