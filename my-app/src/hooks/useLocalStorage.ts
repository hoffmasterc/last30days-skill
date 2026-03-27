import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY } from '../utils/constants';
import { type AppData, DEFAULT_APP_DATA } from '../types';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_APP_DATA, ...parsed, appState: { ...DEFAULT_APP_DATA.appState, ...parsed.appState } };
    }
  } catch {
    // corrupted data — reset
  }
  return DEFAULT_APP_DATA;
}

function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function useLocalStorage() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateAppState = useCallback(
    (partial: Partial<AppData['appState']>) => {
      setData((prev) => ({
        ...prev,
        appState: { ...prev.appState, ...partial },
      }));
    },
    []
  );

  const addSession = useCallback((session: AppData['sessions'][number]) => {
    setData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, session],
    }));
  }, []);

  const addRoutine = useCallback((routine: AppData['routines'][number]) => {
    setData((prev) => ({
      ...prev,
      routines: [...prev.routines, routine],
    }));
  }, []);

  return { data, setData, updateAppState, addSession, addRoutine };
}
