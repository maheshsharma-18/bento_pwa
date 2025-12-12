import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/stores/useSessionStore";

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
import { useNetwork } from "@/hooks/useNetwork"; // Import Hook
import OfflineScreen from "@/components/layout/OfflineScreen"; // Import Screen

// 1. Protected Route Component: Checks if Child is Selected
const ProtectedRoute = () => {
  const { selectedChild } = useSessionStore();
  // If no child selected, force them to pick one
  return selectedChild ? <Outlet /> : <Navigate to="/who-is-watching" replace />;
};

function App() {
  const isOnline = useNetwork(); // 1. Check Network status
  // Temporary: In a real app, this comes from Supabase Auth state
  // For this step, assume the parent IS logged in, but maybe hasn't picked a child
  const isParentLoggedIn = true; 

  // 2. If Offline, STOP everything and show the screen
  if (!isOnline) {
    return <OfflineScreen />;
  } 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        {/* Profile Selection (Authenticated but no child selected yet) */}
        <Route 
          path="/who-is-watching" 
          element={isParentLoggedIn ? <WhoIsWatching /> : <Navigate to="/auth" replace />} 
        />

        {/* Parent Area */}
        <Route path="/parents" element={<ParentDashboard />} />
        <Route path="/parents/profiles" element={<ManageProfiles />} />
        <Route path="/parents/profiles/new" element={<UpsertProfile />} />
        <Route path="/parents/profiles/:id" element={<UpsertProfile />} />
        <Route path="/parents/routine" element={<RoutineSelect />} />
        <Route path="/parents/routine/:id" element={<RoutineSettings />} />
        <Route path="/parents/affiliates" element={<AffiliateDashboard />} />
        <Route path="/parents/support" element={<Support />} />
        <Route path="/parents/settings" element={<Settings />} />
        <Route path="/parents/subscription" element={<Subscription />} />

        {/* Player Route */}
        <Route path="/player/:videoId" element={<Player />} />

        {/* Child Protected Routes (Needs Selected Profile) */}
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

export default App


