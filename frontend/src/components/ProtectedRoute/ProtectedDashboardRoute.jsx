import { useEffect } from "react";
import { PATH } from "../../routes";
import { Navigate, Outlet } from "react-router-dom";
import DashboardApp from "../../dashboard/App";
import { setLayout, useMaterialUIController } from "../../dashboard/context";

const ProtectedDashboardRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const [controller, dispatch] = useMaterialUIController();

    useEffect(() => {
        setLayout(dispatch, "dashboard"); // 👈 هذا مهم جداً
    }, []);

    if (!user || (role !== "admin" && role !== "teacher")) {
        return <Navigate to={`/${PATH.NotAuth}`} replace />;
    }

    return (
        <DashboardApp role={role}>
            <Outlet />
        </DashboardApp>
    );
};

export default ProtectedDashboardRoute;
