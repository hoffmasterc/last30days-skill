export const APP_NAME = 'CalmCompete';
export const STORAGE_KEY = 'calmcompete-data';

export const ONBOARDING_SCREENS = [
  {
    title: 'Welcome to CalmCompete',
    description:
      'A safe space to manage pre-competition anxiety. Built specifically for young athletes like you.',
    icon: '🏅',
  },
  {
    title: 'Understand Your Feelings',
    description:
      'Check in with how you are feeling before a competition. Tracking your anxiety helps you understand patterns and feel more in control.',
    icon: '📊',
  },
  {
    title: 'Guided Techniques',
    description:
      'Follow breathing exercises, visualization, positive self-talk, and grounding techniques — all proven to help manage anxiety.',
    icon: '🧘',
  },
  {
    title: 'Build Your Routine',
    description:
      'Create a personalized pre-competition routine you can use every time. The more you practice, the more confident you will feel.',
    icon: '⭐',
  },
];

export const ANXIETY_LEVELS = [
  { value: 1, label: 'Very Calm', color: 'bg-green-500' },
  { value: 2, label: 'Calm', color: 'bg-green-400' },
  { value: 3, label: 'A Little Nervous', color: 'bg-yellow-400' },
  { value: 4, label: 'Nervous', color: 'bg-orange-400' },
  { value: 5, label: 'Very Nervous', color: 'bg-orange-500' },
  { value: 6, label: 'Anxious', color: 'bg-red-400' },
  { value: 7, label: 'Very Anxious', color: 'bg-red-500' },
];

export const TECHNIQUE_OPTIONS = [
  {
    id: 'breathing',
    label: 'Breathing Exercise',
    description: 'Slow, deep breaths to calm your body',
    defaultDuration: 180,
  },
  {
    id: 'visualization',
    label: 'Visualization',
    description: 'Picture yourself performing well',
    defaultDuration: 300,
  },
  {
    id: 'self-talk',
    label: 'Positive Self-Talk',
    description: 'Replace worried thoughts with confident ones',
    defaultDuration: 120,
  },
  {
    id: 'body-scan',
    label: 'Body Scan',
    description: 'Notice and release tension in your body',
    defaultDuration: 240,
  },
  {
    id: 'grounding',
    label: '5-4-3-2-1 Grounding',
    description: 'Use your senses to feel present and focused',
    defaultDuration: 180,
  },
];

export const SESSION_DURATIONS = [
  { value: 3, label: '3 min', description: 'Quick calm-down' },
  { value: 5, label: '5 min', description: 'Short session' },
  { value: 10, label: '10 min', description: 'Full session' },
  { value: 15, label: '15 min', description: 'Deep session' },
];
