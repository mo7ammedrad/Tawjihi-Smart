import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../../routes";

// Props: allowedRoles (array), children (JSX)
const RoleProtectedRoute = ({ allowedRoles, children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    if (!user || !allowedRoles.includes(role)) {
        // Redirect unauthorized users to /unauthorized page
        return <Navigate to={`/${PATH.NotAuth}`} replace />;
    }

    return children; // allow access
};

export default RoleProtectedRoute;