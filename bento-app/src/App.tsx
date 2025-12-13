import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/stores/useSessionStore";
// FIX: Added 'type' keyword here to satisfy verbatimModuleSyntax
import type { Session } from "@supabase/supabase-js"; 
import { supabase } from "@/lib/supabase"; 

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import WhoIsWatching from "./pages/WhoIsWatching";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Schedule from "./pages/Schedule";
import Player from "./pages/Player";
import AppLayout from "./components/layout/AppLayout";
import ParentDashboard from "./pages/parents/Dashboard";
import ManageProfiles from "./pages/parents/ManageProfiles";
import UpsertProfile from "./pages/parents/UpsertProfile";
import RoutineSelect from "./pages/parents/RoutineSelect";
import RoutineSettings from "./pages/parents/RoutineSettings";
import AffiliateDashboard from "./pages/parents/AffiliateDashboard";
import Support from "./pages/parents/Support";
import Settings from "./pages/parents/Settings";
import Subscription from "./pages/parents/Subscription";
import { useNetwork } from "@/hooks/useNetwork"; 
import OfflineScreen from "@/components/layout/OfflineScreen"; 

// 1. Protected Route: Ensures Child Profile is Selected
const ProtectedRoute = () => {
  const { selectedChild } = useSessionStore();
  // If no child selected, go to Profile Selector
  return selectedChild ? <Outlet /> : <Navigate to="/who-is-watching" replace />;
};

function App() {
  const isOnline = useNetwork();
  
  // REAL AUTH STATE
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // 2. Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 1. Network Check
  if (!isOnline) {
    return <OfflineScreen />;
  } 

  // 2. Loading Screen (while checking Supabase)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
        <div className="animate-spin text-6xl">🦁</div>
      </div>
    );
  }

  // Helper to check login status
  const isAuthenticated = !!session;

  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        {/* If logged in, don't show Welcome/Auth, go straight to Profiles */}
        <Route 
          path="/welcome" 
          element={!isAuthenticated ? <Welcome /> : <Navigate to="/who-is-watching" replace />} 
        />
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <Auth /> : <Navigate to="/who-is-watching" replace />} 
        />

        {/* --- AUTHENTICATED ROUTES --- */}
        
        {/* Profile Selection (Entry Point for Logged In Users) */}
        {/* If NOT logged in, kick back to /welcome */}
        <Route 
          path="/who-is-watching" 
          element={isAuthenticated ? <WhoIsWatching /> : <Navigate to="/welcome" replace />} 
        />

        {/* Parent Area (Protected) */}
        <Route path="/parents" element={isAuthenticated ? <ParentDashboard /> : <Navigate to="/welcome" />} />
        <Route path="/parents/profiles" element={isAuthenticated ? <ManageProfiles /> : <Navigate to="/welcome" />} />
        <Route path="/parents/profiles/new" element={isAuthenticated ? <UpsertProfile /> : <Navigate to="/welcome" />} />
        <Route path="/parents/profiles/:id" element={isAuthenticated ? <UpsertProfile /> : <Navigate to="/welcome" />} />
        <Route path="/parents/routine" element={isAuthenticated ? <RoutineSelect /> : <Navigate to="/welcome" />} />
        <Route path="/parents/routine/:id" element={isAuthenticated ? <RoutineSettings /> : <Navigate to="/welcome" />} />
        <Route path="/parents/affiliates" element={isAuthenticated ? <AffiliateDashboard /> : <Navigate to="/welcome" />} />
        <Route path="/parents/support" element={isAuthenticated ? <Support /> : <Navigate to="/welcome" />} />
        <Route path="/parents/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/welcome" />} />
        <Route path="/parents/subscription" element={isAuthenticated ? <Subscription /> : <Navigate to="/welcome" />} />

        {/* Player Route */}
        <Route path="/player/:videoId" element={isAuthenticated ? <Player /> : <Navigate to="/welcome" />} />

        {/* --- CHILD AREA (Requires Child Selection) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/schedule" element={<Schedule />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;