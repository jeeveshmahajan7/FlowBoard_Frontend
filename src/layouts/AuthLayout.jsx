import { Navigate, Outlet } from "react-router-dom";

// helper: Check if token expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  // Only block auth pages if token is valid
  if (token && !isTokenExpired(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ If token is expired, remove it
  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
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
