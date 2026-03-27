export interface Session {
  id: string;
  date: string;
  preAnxietyLevel: number;
  postAnxietyLevel: number;
  sport: string;
  competitionType: string;
  techniques: string[];
  duration: number; // in minutes
  notes: string;
}

export interface Routine {
  id: string;
  name: string;
  steps: RoutineStep[];
  createdAt: string;
  lastUsed: string;
}

export interface RoutineStep {
  id: string;
  type: 'breathing' | 'visualization' | 'self-talk' | 'body-scan' | 'grounding';
  label: string;
  duration: number; // in seconds
  instructions: string;
}

export interface AppState {
  firstLaunchComplete: boolean;
  darkMode: boolean;
  ageVerified: boolean;
  onboardingComplete: boolean;
  currentView: AppView;
}

export type AppView =
  | 'age-gate'
  | 'onboarding'
  | 'home'
  | 'session'
  | 'dashboard'
  | 'info';

export interface AppData {
  sessions: Session[];
  routines: Routine[];
  appState: AppState;
}

export const DEFAULT_APP_DATA: AppData = {
  sessions: [],
  routines: [],
  appState: {
    firstLaunchComplete: false,
    darkMode: true,
    ageVerified: false,
    onboardingComplete: false,
    currentView: 'age-gate',
  },
};
