import { useState } from 'react';
import { ANXIETY_LEVELS, TECHNIQUE_OPTIONS, SESSION_DURATIONS } from '../utils/constants';
import GuidedSession from './GuidedSession';
import type { Session } from '../types';

type SessionStep = 'check-in' | 'technique' | 'duration' | 'guided' | 'checkout';

interface SessionFlowProps {
  darkMode: boolean;
  onComplete: (session: Session) => void;
  onCancel: () => void;
}

export default function SessionFlow({ darkMode, onComplete, onCancel }: SessionFlowProps) {
  const [step, setStep] = useState<SessionStep>('check-in');
  const [preAnxiety, setPreAnxiety] = useState(4);
  const [technique, setTechnique] = useState('breathing');
  const [duration, setDuration] = useState(5);
  const [postAnxiety, setPostAnxiety] = useState(3);

  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';

  if (step === 'guided') {
    return (
      <GuidedSession
        darkMode={darkMode}
        technique={technique}
        duration={duration}
        onComplete={() => setStep('checkout')}
        onCancel={() => setStep('checkout')}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
      {/* Step indicator */}
      <div className="flex gap-2 items-center">
        {(['check-in', 'technique', 'duration', 'guided', 'checkout'] as SessionStep[]).map(
          (s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-calm-400'
                  : i < ['check-in', 'technique', 'duration', 'guided', 'checkout'].indexOf(step)
                    ? 'w-2.5 bg-calm-600'
                    : darkMode
                      ? 'w-2.5 bg-dark-card'
                      : 'w-2.5 bg-gray-300'
              }`}
            />
          )
        )}
      </div>

      <div className={`w-full max-w-md rounded-2xl border p-6 space-y-6 ${cardBg} ${cardBorder}`}>
        {step === 'check-in' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How are you feeling?</h2>
              <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                Rate your anxiety level right now
              </p>
            </div>
            <div className="space-y-2">
              {ANXIETY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setPreAnxiety(level.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    preAnxiety === level.value
                      ? 'ring-2 ring-calm-400 bg-calm-400/10'
                      : darkMode
                        ? 'hover:bg-dark-card'
                        : 'hover:bg-light-card'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${level.color}`} />
                  <span className="font-medium">{level.value}</span>
                  <span className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('technique')}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg bg-calm-500 hover:bg-calm-600 text-white transition-colors"
            >
              Next
            </button>
          </>
        )}

        {step === 'technique' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Choose a technique</h2>
              <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                What would help you feel calmer?
              </p>
            </div>
            <div className="space-y-2">
              {TECHNIQUE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTechnique(t.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    technique === t.id
                      ? 'ring-2 ring-calm-400 bg-calm-400/10'
                      : darkMode
                        ? 'hover:bg-dark-card'
                        : 'hover:bg-light-card'
                  }`}
                >
                  <p className="font-semibold">{t.label}</p>
                  <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('check-in')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                  darkMode
                    ? 'bg-dark-card hover:bg-dark-muted/30 text-dark-text'
                    : 'bg-light-card hover:bg-gray-200 text-light-text'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep('duration')}
                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-calm-500 hover:bg-calm-600 text-white transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 'duration' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How much time do you have?</h2>
              <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                Pick a session length
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SESSION_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    duration === d.value
                      ? 'ring-2 ring-calm-400 bg-calm-400/10'
                      : darkMode
                        ? 'bg-dark-card hover:bg-dark-muted/30'
                        : 'bg-light-card hover:bg-gray-200'
                  }`}
                >
                  <p className="text-2xl font-bold">{d.label}</p>
                  <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                    {d.description}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('technique')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                  darkMode
                    ? 'bg-dark-card hover:bg-dark-muted/30 text-dark-text'
                    : 'bg-light-card hover:bg-gray-200 text-light-text'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep('guided')}
                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-calm-500 hover:bg-calm-600 text-white transition-colors"
              >
                Start Session
              </button>
            </div>
          </>
        )}

        {step === 'checkout' && (
          <>
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">&#10003;</div>
              <h2 className="text-2xl font-bold">Great job!</h2>
              <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                How are you feeling now?
              </p>
            </div>
            <div className="space-y-2">
              {ANXIETY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setPostAnxiety(level.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    postAnxiety === level.value
                      ? 'ring-2 ring-calm-400 bg-calm-400/10'
                      : darkMode
                        ? 'hover:bg-dark-card'
                        : 'hover:bg-light-card'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${level.color}`} />
                  <span className="font-medium">{level.value}</span>
                  <span className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
            {postAnxiety < preAnxiety && (
              <div className="text-center p-3 rounded-xl bg-green-500/10 text-green-400 font-medium">
                Your anxiety went down by {preAnxiety - postAnxiety} point{preAnxiety - postAnxiety > 1 ? 's' : ''}!
              </div>
            )}
            <button
              onClick={() => {
                const session: Session = {
                  id: Date.now().toString(),
                  date: new Date().toISOString(),
                  preAnxietyLevel: preAnxiety,
                  postAnxietyLevel: postAnxiety,
                  sport: '',
                  competitionType: '',
                  techniques: [technique],
                  duration,
                  notes: '',
                };
                onComplete(session);
              }}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg bg-calm-500 hover:bg-calm-600 text-white transition-colors"
            >
              Save &amp; Finish
            </button>
          </>
        )}
      </div>

      {step !== 'checkout' && (
        <button
          onClick={onCancel}
          className={`text-sm underline ${
            darkMode ? 'text-dark-muted hover:text-dark-text' : 'text-light-muted hover:text-light-text'
          }`}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
