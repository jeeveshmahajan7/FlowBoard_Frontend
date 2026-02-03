import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

// helper: Check if token expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const AppLayout = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Auto logout if token expired
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 bg-base-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
