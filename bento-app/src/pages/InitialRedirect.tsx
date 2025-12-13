import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function InitialRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Session check karo
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Agar Logged In hai -> Profile Selection par bhejo
        navigate("/who-is-watching", { replace: true });
      } else {
        // Agar Logged In nahi hai -> Welcome Slides par bhejo
        navigate("/welcome", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
      <div className="animate-spin text-6xl">🦁</div>
    </div>
  );
}