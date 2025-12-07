import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

function App() {
  // Temporary: We will assume user is NOT logged in for now
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Route Logic */}
        <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/welcome" replace />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
