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
      navigate(redirectTo);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
};

export default Logout;
