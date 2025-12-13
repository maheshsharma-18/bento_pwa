import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/stores/useSessionStore";
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
import InitialRedirect from "./pages/InitialRedirect"; // <--- NEW IMPORT

// 1. Protected Route
const ProtectedRoute = () => {
  const { selectedChild } = useSessionStore();
  return selectedChild ? <Outlet /> : <Navigate to="/who-is-watching" replace />;
};

function App() {
  const isOnline = useNetwork();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isOnline) return <OfflineScreen />;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
        <div className="animate-spin text-6xl">🦁</div>
      </div>
    );
  }

  const isAuthenticated = !!session;

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ROOT URL - TRAFFIC POLICE */}
        <Route path="/" element={<InitialRedirect />} />

        {/* 2. PUBLIC ROUTES */}
        <Route path="/welcome" element={!isAuthenticated ? <Welcome /> : <Navigate to="/who-is-watching" replace />} />
        <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/who-is-watching" replace />} />

        {/* 3. PROFILE SELECTION */}
        <Route 
          path="/who-is-watching" 
          element={isAuthenticated ? <WhoIsWatching /> : <Navigate to="/welcome" replace />} 
        />

        {/* 4. PARENT AREA */}
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

        {/* 5. PLAYER */}
        <Route path="/player/:videoId" element={isAuthenticated ? <Player /> : <Navigate to="/welcome" />} />

        {/* 6. CHILD AREA (Renamed Home to /home) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} /> {/* <--- CHANGED FROM / TO /home */}
              <Route path="/search" element={<Search />} />
              <Route path="/schedule" element={<Schedule />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;