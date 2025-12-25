import Dashboard from "./index";
import TeacherDashboard from "./TeacherDashboard";

const DashboardHome = () => {
  let role = "";
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    role = u?.role || "";
  } catch (e) {
    role = "";
  }

  if (role === "teacher") return <TeacherDashboard />;
  return <Dashboard />;
};

export default DashboardHome;
