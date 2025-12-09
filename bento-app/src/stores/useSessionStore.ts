import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  age: number | null;
  routine_settings: any;
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
