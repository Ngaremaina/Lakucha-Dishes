import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RequireAdmin = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken) return <Navigate to="/signin" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default RequireAdmin;
