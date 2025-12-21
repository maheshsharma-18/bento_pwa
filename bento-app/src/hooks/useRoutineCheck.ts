import { useState, useEffect } from "react";
import { useSessionStore } from "@/stores/useSessionStore";
import { evaluateRoutine, type RoutineRule } from "@/lib/routineEngine";

export const useRoutineCheck = () => {
  const { selectedChild } = useSessionStore();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // 1. If no child selected, do nothing (or lock? depends on flow)
    if (!selectedChild) {
      setIsLocked(false);
      return;
    }

    const checkTime = () => {
      // 2. Get rules from the profile. 
      // Safe casting: Ensure it treats the JSONB as our Rule Array
      const rules = selectedChild.routine_settings as unknown as RoutineRule[];
      
      // 3. Ask the Brain
      const result = evaluateRoutine(rules);
      
      // 4. Update State
      setIsLocked(result.isLocked);
    };

    // Check immediately
    checkTime();

    // Check every minute (60000ms)
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [selectedChild]);

  return isLocked;
};
