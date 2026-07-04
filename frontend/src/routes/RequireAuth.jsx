import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RequireAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default RequireAuth;
