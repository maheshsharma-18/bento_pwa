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
  parentModeExpiry: number | null; // <--- NEW: Timestamp for PIN expiry

  setSelectedChild: (child: ChildProfile | null) => void;
  unlockParentMode: () => void; // <--- NEW: Action to unlock
  lockParentMode: () => void;   // <--- NEW: Action to lock
  isParentVerified: () => boolean; // <--- NEW: Helper check
  
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      selectedChild: null,
      parentModeExpiry: null,

      setSelectedChild: (child) => set({ selectedChild: child }),

      // Unlock for 15 minutes (15 * 60 * 1000 ms)
      unlockParentMode: () => set({ parentModeExpiry: Date.now() + 15 * 60 * 1000 }),

      // Explicitly lock (e.g. on profile switch)
      lockParentMode: () => set({ parentModeExpiry: null }),

      // Check if current time is BEFORE expiry time
      isParentVerified: () => {
        const { parentModeExpiry } = get();
        return !!parentModeExpiry && Date.now() < parentModeExpiry;
      },

      // Clear everything on logout
      clearSession: () => set({ selectedChild: null, parentModeExpiry: null }),
    }),
    {
      name: 'bento-session-storage',
    }
  )
);
