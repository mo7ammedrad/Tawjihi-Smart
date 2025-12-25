import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../../routes";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  return user ? <Outlet /> : <Navigate to={`/${PATH.NotAuth}`} replace />;
};

export default ProtectedRoute;
