
// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import DashboardLayout from "./assets/components/layout/DashboardLayout";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import ContactList from "./pages/Contacts/ContactList"; // Keep this if ContactList is the main file
import ContactCard from "./pages/Contacts/components/ContactCard";
// OR if you want to be more specific:
// import ContactList from "./pages/Contacts/ContactList/ContactList";

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

        {/* Nested routes */}
        <Route path="contactlist" element={<ContactList />} />

        {/* <Route path="groups" element={<Groups/>}/> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;