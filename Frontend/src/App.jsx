
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import DashboardLayout from "./assets/components/layout/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import ContactList from "./pages/Contacts/ContactList"; // Keep this if ContactList is the main file
import ContactCard from "./pages/Contacts/components/ContactCard";
import Groups from "./pages/Groups/Groups";
import ForgotPassword from "./pages/password/ForgotPassword";
import ResetPassword from "./pages/password/ResetPassword";


function App() {
  return (
    <Routes>

    
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />


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

        <Route path="groups" element={<Groups/>}/>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;