import { useState } from 'react';

interface AgeGateProps {
  darkMode: boolean;
  onVerified: () => void;
}

export default function AgeGate({ darkMode, onVerified }: AgeGateProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canProceed = ageConfirmed && parentConsent && privacyAccepted;

  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="text-5xl mb-4" aria-hidden="true">
          &#9672;
        </div>
        <h1 className="text-3xl font-bold tracking-tight">CalmCompete</h1>
        <p className={`text-lg ${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
          Pre-competition anxiety management for young athletes
        </p>
      </div>

      {/* Consent card */}
      <div
        className={`w-full max-w-md rounded-2xl border p-6 space-y-5 ${cardBg} ${cardBorder}`}
      >
        <h2 className="text-xl font-semibold">Before we start</h2>
        <p className={`${darkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
          This app is designed for young athletes. Please confirm the following
          to continue.
        </p>

        <div className="space-y-4">
          <Checkbox
            id="age"
            checked={ageConfirmed}
            onChange={setAgeConfirmed}
            darkMode={darkMode}
            label="I am between 10 and 18 years old (or I am a parent/guardian setting this up)"
          />
          <Checkbox
            id="parent"
            checked={parentConsent}
            onChange={setParentConsent}
            darkMode={darkMode}
            label="A parent or guardian knows I am using this app"
          />
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onChange={setPrivacyAccepted}
            darkMode={darkMode}
            label="I understand my data stays on this device and is never shared"
          />
        </div>

        <button
          onClick={onVerified}
          disabled={!canProceed}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all ${
            canProceed
              ? 'bg-calm-500 hover:bg-calm-600 text-white shadow-lg shadow-calm-500/25 active:scale-[0.98]'
              : darkMode
                ? 'bg-dark-card text-dark-muted cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Get Started
        </button>
      </div>

      {/* Privacy note */}
      <p
        className={`text-sm text-center max-w-sm ${
          darkMode ? 'text-dark-muted' : 'text-light-muted'
        }`}
      >
        Your data never leaves this device. No accounts, no tracking, no ads.
      </p>
    </div>
  );
}

function Checkbox({
  id,
  checked,
  onChange,
  darkMode,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  darkMode: boolean;
  label: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer group p-3 rounded-xl transition-colors ${
        darkMode ? 'hover:bg-dark-card/50' : 'hover:bg-light-card'
      }`}
    >
      <div className="pt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            checked
              ? 'bg-calm-500 border-calm-500'
              : darkMode
                ? 'border-dark-muted'
                : 'border-gray-300'
          }`}
        >
          {checked && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      <span
        className={`text-base leading-snug ${
          darkMode ? 'text-dark-text' : 'text-light-text'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
