/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React layouts
import Dashboard from "./layouts/dashboard";
import CoursesDashboard from "./layouts/courses";
import TeacherRequests from "./layouts/teacherRequests";
import BranchesDashboard from "./layouts/branches";
import SubjectsDashboard from "./layouts/subjects";
import PaymentsDashboard from "./layouts/payments";
import LessonsDashboard from "./layouts/lessons";
import Broadcast from "./layouts/broadcast";
import TeacherAiQuizBuilder from "../pages/TeacherAiQuizBuilder";
import InboxDashboard from "./layouts/inbox/InboxDashboard";

// @mui icons
import Icon from "@mui/material/Icon";

// Routes shown inside the dashboard side nav
export const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Students",
    key: "dashboard/students",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/students",
  },
  {
    type: "collapse",
    name: "Teachers",
    key: "dashboard/teachers",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/teachers",
  },
  {
    type: "collapse",
    name: "Teacher Requests",
    key: "dashboard/teachers-requests",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/teachers-requests",
    component: <TeacherRequests />,
  },
  {
    type: "collapse",
    name: "Branches",
    key: "dashboard/branches",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/branches",
    component: <BranchesDashboard />,
  },
  {
    type: "collapse",
    name: "Subjects",
    key: "dashboard/subjects",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/subjects",
    component: <SubjectsDashboard />,
  },
  {
    type: "collapse",
    name: "Courses",
    key: "dashboard/courses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/courses",
    component: <CoursesDashboard />,
  },
  {
    type: "collapse",
    name: "Payments",
    key: "dashboard/payments",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/dashboard/payments",
    component: <PaymentsDashboard />,
  },
  {
    type: "collapse",
    name: "Broadcast",
    key: "dashboard/broadcast",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/dashboard/broadcast",
    component: <Broadcast />,
  },
  {
    type: "collapse",
    name: "Inbox",
    key: "dashboard/inbox",
    icon: <Icon fontSize="small">mail</Icon>,
    route: "/dashboard/inbox",
    component: <InboxDashboard />,
  },
];

export const teacherRoutes = [
  {
    type: "collapse",
    name: "My Courses",
    key: "my_courses",
    icon: <Icon fontSize="small">menu_book</Icon>,
    route: "/dashboard/courses",
    component: <CoursesDashboard />,
  },
  {
    type: "collapse",
    name: "Lessons",
    key: "my_lessons",
    icon: <Icon fontSize="small">movie</Icon>,
    route: "/dashboard/lessons",
    component: <LessonsDashboard />,
  },
  {
    type: "collapse",
    name: "Broadcast",
    key: "dashboard/broadcast",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/dashboard/broadcast",
    component: <Broadcast />,
  },
  {
    type: "collapse",
    name: "AI Quiz Builder",
    key: "dashboard/ai-quiz",
    icon: <Icon fontSize="small">quiz</Icon>,
    route: "/dashboard/ai-quiz",
    component: <TeacherAiQuizBuilder />,
  },
  {
    type: "collapse",
    name: "Inbox",
    key: "dashboard/inbox",
    icon: <Icon fontSize="small">mail</Icon>,
    route: "/dashboard/inbox",
    component: <InboxDashboard />,
  },
];
