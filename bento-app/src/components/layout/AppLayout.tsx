import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import LockScreen from "@/components/kids/LockScreen"; // Import Lock Screen
import { useRoutineCheck } from "@/hooks/useRoutineCheck"; // Import Hook

export default function AppLayout() {
  const isLocked = useRoutineCheck(); // Run the check

  // If locked, hide EVERYTHING and show Lock Screen
  if (isLocked) {
    return <LockScreen />;
  }

  return (
    <div className="min-h-screen bg-background font-sans relative">
      {/* pb-24 adds padding to the bottom so the last video 
        isn't covered by the fixed navigation bar 
      */}
      <main className="pb-24 w-full max-w-md mx-auto min-h-screen bg-background">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
