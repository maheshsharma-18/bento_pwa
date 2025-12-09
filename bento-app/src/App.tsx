import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Schedule from "./pages/Schedule";
import AppLayout from "./components/layout/AppLayout";

function App() {
  // Temporary: Set to true to test the internal layout
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Bottom Bar) */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes (Has Bottom Bar) */}
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

