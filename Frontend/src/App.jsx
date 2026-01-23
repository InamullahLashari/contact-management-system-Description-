
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import DashboardLayout from "./assets/components/layout/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected dashboard layout */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard page */}
        <Route index element={<DashboardContent />} />

  

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
