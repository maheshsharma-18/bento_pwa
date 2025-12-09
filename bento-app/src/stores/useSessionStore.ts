import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RoutineSettings {
  bedtime?: string;
  wake_up?: string;
  updated_at?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  age: number | null;
  routine_settings: RoutineSettings;
}

interface SessionState {
  selectedChild: ChildProfile | null;
  setSelectedChild: (child: ChildProfile | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      selectedChild: null,
      setSelectedChild: (child) => set({ selectedChild: child }),
      clearSession: () => set({ selectedChild: null }),
    }),
    {
      name: 'bento-session-storage', // key in localStorage
    }
  )
);
