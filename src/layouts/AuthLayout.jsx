import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  // If already logged in, block access to auth pages
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <div>
        {/* Auth pages (Login / Signup) render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
