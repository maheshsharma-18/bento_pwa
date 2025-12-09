import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Schedule from "./pages/Schedule";
import Player from "./pages/Player"; // Import the Player
import AppLayout from "./components/layout/AppLayout";

function App() {
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        {/* Player Route (No Bottom Bar) - Placed outside AppLayout */}
        <Route path="/player/:videoId" element={<Player />} />

        {/* Main App Routes (With Bottom Bar) */}
        <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/welcome" replace />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


