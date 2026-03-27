import { useState, useEffect, useCallback } from 'react';
import { TECHNIQUE_OPTIONS } from '../utils/constants';

interface GuidedSessionProps {
  darkMode: boolean;
  technique: string;
  duration: number; // in minutes
  onComplete: () => void;
  onCancel: () => void;
}

const BREATHING_PHASES = [
  { label: 'Breathe In', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Breathe Out', duration: 6 },
];

const GROUNDING_STEPS = [
  { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see around you' },
  { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can touch or feel' },
  { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear right now' },
  { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell' },
  { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste' },
];

const SELF_TALK_PHRASES = [
  'I have trained hard for this moment.',
  'I am prepared and I am ready.',
  'Nervousness means I care — and that is a strength.',
  'I trust my body and my training.',
  'I focus on what I can control.',
  'I have done this before and I can do it again.',
  'I am strong, I am capable, I am enough.',
  'This is my time to shine.',
];

const VISUALIZATION_PROMPTS = [
  'Close your eyes. Take a deep breath.',
  'Picture yourself arriving at the competition. You feel calm and confident.',
  'See yourself warming up. Your body feels strong and ready.',
  'Imagine the moment right before you start. You are focused.',
  'Visualize yourself performing at your best. Every movement is smooth.',
  'Feel the confidence flowing through you. You belong here.',
  'See yourself finishing strong. You did it.',
  'Open your eyes. Carry this confidence with you.',
];

const BODY_SCAN_AREAS = [
  { area: 'Feet & Legs', instruction: 'Notice any tension in your feet and legs. Wiggle your toes, then relax.' },
  { area: 'Stomach & Core', instruction: 'Feel your stomach. Take a deep breath and let your core soften.' },
  { area: 'Hands & Arms', instruction: 'Clench your fists tight for 3 seconds, then release and shake them out.' },
  { area: 'Shoulders & Neck', instruction: 'Roll your shoulders back slowly. Drop them down away from your ears.' },
  { area: 'Face & Jaw', instruction: 'Unclench your jaw. Relax your forehead. Let your face soften.' },
];

export default function GuidedSession({
  darkMode,
  technique,
  duration,
  onComplete,
  onCancel,
}: GuidedSessionProps) {
  const totalSeconds = duration * 60;
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const remaining = totalSeconds - elapsed;
  const progress = (elapsed / totalSeconds) * 100;

  useEffect(() => {
    if (isPaused || elapsed >= totalSeconds) return;
    const timer = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= totalSeconds) {
          clearInterval(timer);
          return totalSeconds;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, elapsed, totalSeconds]);

  const isFinished = elapsed >= totalSeconds;

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }, []);

  const techInfo = TECHNIQUE_OPTIONS.find((t) => t.id === technique);
  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
      {/* Timer display */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{techInfo?.label ?? technique}</h2>
        <div className="text-5xl font-mono font-bold text-calm-400">
          {formatTime(remaining)}
        </div>
      </div>

      {/* Progress ring */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={darkMode ? '#334155' : '#e2e8f0'}
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#3a9eff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Technique-specific content */}
      <div className={`w-full max-w-md rounded-2xl border p-6 ${cardBg} ${cardBorder}`}>
        {technique === 'breathing' && <BreathingContent elapsed={elapsed} darkMode={darkMode} />}
        {technique === 'grounding' && <GroundingContent elapsed={elapsed} totalSeconds={totalSeconds} darkMode={darkMode} />}
        {technique === 'self-talk' && <SelfTalkContent elapsed={elapsed} darkMode={darkMode} />}
        {technique === 'visualization' && <VisualizationContent elapsed={elapsed} totalSeconds={totalSeconds} darkMode={darkMode} />}
        {technique === 'body-scan' && <BodyScanContent elapsed={elapsed} totalSeconds={totalSeconds} darkMode={darkMode} />}
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={onCancel}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
            darkMode
              ? 'bg-dark-card hover:bg-dark-muted/30 text-dark-text'
              : 'bg-light-card hover:bg-gray-200 text-light-text'
          }`}
        >
          End Early
        </button>
        {isFinished ? (
          <button
            onClick={onComplete}
            className="flex-1 py-3 px-6 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            Done!
          </button>
        ) : (
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="flex-1 py-3 px-6 rounded-xl font-semibold bg-calm-500 hover:bg-calm-600 text-white transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  );
}

function BreathingContent({ elapsed, darkMode }: { elapsed: number; darkMode: boolean }) {
  const cycleLength = BREATHING_PHASES.reduce((a, p) => a + p.duration, 0);
  const posInCycle = elapsed % cycleLength;
  let acc = 0;
  let currentPhase = BREATHING_PHASES[0];
  let phaseProgress = 0;
  for (const phase of BREATHING_PHASES) {
    if (posInCycle < acc + phase.duration) {
      currentPhase = phase;
      phaseProgress = (posInCycle - acc) / phase.duration;
      break;
    }
    acc += phase.duration;
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-2xl font-bold text-calm-400">{currentPhase.label}</p>
      <div className="flex justify-center">
        <div
          className="rounded-full bg-calm-400/20 transition-all duration-1000 flex items-center justify-center"
          style={{
            width: `${80 + phaseProgress * 40}px`,
            height: `${80 + phaseProgress * 40}px`,
          }}
        >
          <div
            className="rounded-full bg-calm-400/40 transition-all duration-1000"
            style={{
              width: `${40 + phaseProgress * 30}px`,
              height: `${40 + phaseProgress * 30}px`,
            }}
          />
        </div>
      </div>
      <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
        4-4-6 breathing pattern
      </p>
    </div>
  );
}

function GroundingContent({ elapsed, totalSeconds, darkMode }: { elapsed: number; totalSeconds: number; darkMode: boolean }) {
  const stepDuration = totalSeconds / GROUNDING_STEPS.length;
  const stepIndex = Math.min(Math.floor(elapsed / stepDuration), GROUNDING_STEPS.length - 1);
  const step = GROUNDING_STEPS[stepIndex];

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl font-bold text-calm-400">{step.count}</div>
      <p className="text-xl font-semibold">{step.sense}</p>
      <p className={`text-lg ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
        {step.prompt}
      </p>
    </div>
  );
}

function SelfTalkContent({ elapsed, darkMode }: { elapsed: number; darkMode: boolean }) {
  const phraseIndex = Math.floor(elapsed / 8) % SELF_TALK_PHRASES.length;

  return (
    <div className="text-center space-y-4">
      <p className="text-xl font-semibold leading-relaxed">
        &ldquo;{SELF_TALK_PHRASES[phraseIndex]}&rdquo;
      </p>
      <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
        Read this slowly to yourself. Believe it.
      </p>
    </div>
  );
}

function VisualizationContent({ elapsed, totalSeconds, darkMode }: { elapsed: number; totalSeconds: number; darkMode: boolean }) {
  const stepDuration = totalSeconds / VISUALIZATION_PROMPTS.length;
  const stepIndex = Math.min(Math.floor(elapsed / stepDuration), VISUALIZATION_PROMPTS.length - 1);

  return (
    <div className="text-center space-y-4">
      <p className="text-xl leading-relaxed">{VISUALIZATION_PROMPTS[stepIndex]}</p>
      <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
        Step {stepIndex + 1} of {VISUALIZATION_PROMPTS.length}
      </p>
    </div>
  );
}

function BodyScanContent({ elapsed, totalSeconds, darkMode }: { elapsed: number; totalSeconds: number; darkMode: boolean }) {
  const stepDuration = totalSeconds / BODY_SCAN_AREAS.length;
  const stepIndex = Math.min(Math.floor(elapsed / stepDuration), BODY_SCAN_AREAS.length - 1);
  const area = BODY_SCAN_AREAS[stepIndex];

  return (
    <div className="text-center space-y-4">
      <p className="text-xl font-semibold text-calm-400">{area.area}</p>
      <p className={`text-lg ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
        {area.instruction}
      </p>
    </div>
  );
}
