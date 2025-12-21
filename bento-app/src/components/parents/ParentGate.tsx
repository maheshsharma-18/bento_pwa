import { Outlet, useNavigate } from "react-router-dom";
import { useSessionStore } from "@/stores/useSessionStore";
import PinGate from "@/components/parents/PinGate";

export default function ParentGate() {
  const navigate = useNavigate();
  const { isParentVerified, unlockParentMode } = useSessionStore();

  // 1. If verified, let them pass immediately
  if (isParentVerified()) {
    return <Outlet />;
  }

  // 2. If NOT verified, block them with the PinGate
  return (
    <PinGate
      onSuccess={() => {
        unlockParentMode(); // Set the 15-min timer
        // No need to navigate; React will re-render this component, 
        // find isParentVerified() is true, and show the Outlet.
      }}
      onCancel={() => {
        // If they cancel, send them back to profile selection
        navigate("/who-is-watching");
      }}
    />
  );
}