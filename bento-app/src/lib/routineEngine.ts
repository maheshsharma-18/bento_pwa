// src/lib/routineEngine.ts

export type RoutineRule = {
  id: string;
  name: string;
  start: string; // "HH:MM" 24h format
  end: string;   // "HH:MM" 24h format
  action: 'lock' | 'unlock'; // For now, let's keep it simple: Lock App or Allow App
  days?: number[]; // [0,1,2...] 0=Sunday. Optional for future.
};

// Helper: Convert "HH:MM" to minutes from midnight (0 - 1439)
const getMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const evaluateRoutine = (
  rules: RoutineRule[] | null | undefined
): { isLocked: boolean; reason?: string } => {
  
  // 1. Default Safe State: If no rules exist, App is OPEN (or Locked? Client decision).
  // Usually, for a "Screen Time" app, default is OPEN unless a restriction hits.
  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    return { isLocked: false };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 2. Iterate through rules to see if any "LOCK" rule is active
  for (const rule of rules) {
    if (rule.action === 'lock') {
      const startMins = getMinutes(rule.start);
      const endMins = getMinutes(rule.end);

      let isInside = false;

      if (startMins < endMins) {
        // Standard Range: 09:00 (540) to 10:00 (600)
        isInside = currentMinutes >= startMins && currentMinutes < endMins;
      } else {
        // Midnight Crossing: 22:00 (1320) to 07:00 (420)
        // It is inside if: Current >= 22:00 OR Current < 07:00
        isInside = currentMinutes >= startMins || currentMinutes < endMins;
      }

      if (isInside) {
        return { isLocked: true, reason: rule.name };
      }
    }
  }

  // 3. If no lock rule matched, we are free.
  return { isLocked: false };
};