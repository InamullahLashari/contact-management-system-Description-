import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../../../api/axios"; 

const Logout = ({ redirectTo = "/login" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear sessionStorage regardless of backend response
      sessionStorage.clear();
      // Optional: Clear localStorage if you're using it
      // localStorage.clear();
      
      // Redirect to login page
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
      title="Logout"
    >
      <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-red-500/20 transition-colors">
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </div>
      <span className="font-medium">Logout</span>
    </button>
  );
};

export default Logout;