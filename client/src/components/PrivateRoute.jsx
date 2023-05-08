import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "../context";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuthState();
  return allowedRoles?.includes(user?.role) ? (
    <Outlet />
  ) : user != null ? (
    <Navigate to={"/unauthorized"} replace />
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default PrivateRoute;
