import { Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/layout/Navbar/Navbar";
import Footer from "./assets/components/layout/Foooter/Footer";
import Sidebar from "./assets/components/layout/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/*=================== Navbar */}
      {/* <Navbar /> */}

      <div className="flex flex-1">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Routes>
            {/* Default page is Login */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
