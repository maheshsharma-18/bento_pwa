import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- NEW TYPES FOR PHASE 6 ---
export interface RoutineRule {
  id: string;
  name: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  action: 'lock' | 'unlock';
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  age: number | null;
  // It can be the old object OR the new array. We allow both to prevent crashes during migration.
  routine_settings: any;
}
// -----------------------------

interface SessionState {
  selectedChild: ChildProfile | null;
  parentModeExpiry: number | null;

  setSelectedChild: (child: ChildProfile | null) => void;
  unlockParentMode: () => void;
  lockParentMode: () => void;
  isParentVerified: () => boolean;
  
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      selectedChild: null,
      parentModeExpiry: null,

      setSelectedChild: (child) => set({ selectedChild: child }),

      unlockParentMode: () => set({ parentModeExpiry: Date.now() + 15 * 60 * 1000 }),

      lockParentMode: () => set({ parentModeExpiry: null }),

      isParentVerified: () => {
        const { parentModeExpiry } = get();
        return !!parentModeExpiry && Date.now() < parentModeExpiry;
      },

      clearSession: () => set({ selectedChild: null, parentModeExpiry: null }),
    }),
    {
      name: 'bento-session-storage',
    }
  )
);
