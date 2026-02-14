
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./assets/components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "./assets/components/layout/DashboardLayout/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import ContactList from "./pages/Contacts/ContactList"; 
import ContactCard from "./pages/Contacts/components/ContactCard";
import Groups from "./pages/Groups/Groups";
import ForgotPassword from "./pages/password/ForgotPassword";
import ResetPassword from "./pages/password/ResetPassword";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import Settings from "./pages/setting/Settings";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin dashboard route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

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

        {/* Nested routes */}
        <Route path="contactlist" element={<ContactList />} />
        <Route path="groups" element={<Groups />} />
        <Route path="settings" element={<Settings />} /> {/* Use actual Settings component */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;