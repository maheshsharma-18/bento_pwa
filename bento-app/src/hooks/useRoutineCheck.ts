import { useState, useEffect } from "react";
import { useSessionStore } from "@/stores/useSessionStore";

export const useRoutineCheck = () => {
  const { selectedChild } = useSessionStore();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // If no child selected or no settings, don't lock
    if (!selectedChild?.routine_settings) {
        setIsLocked(false);
        return;
    }

    const checkTime = () => {
      const { bedtime, wake_up } = selectedChild.routine_settings;
      if (!bedtime || !wake_up) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Convert "20:30" string to minutes (e.g., 1230)
      const [bedHour, bedMin] = bedtime.split(':').map(Number);
      const bedMinutes = bedHour * 60 + bedMin;

      const [wakeHour, wakeMin] = wake_up.split(':').map(Number);
      const wakeMinutes = wakeHour * 60 + wakeMin;

      // Logic: 
      // If Bedtime is 20:00 (1200) and WakeUp is 07:00 (420)
      // Lock if Current > 1200 OR Current < 420
      if (currentMinutes >= bedMinutes || currentMinutes < wakeMinutes) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    // Check immediately
    checkTime();

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [selectedChild]);

  return isLocked;
};
