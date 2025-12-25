// routes.js (or wherever you define routes)

import { Navigate } from "react-router-dom";
import { lazy } from "react";

// Components
import { LoginForm } from "../features/components/LoginForm";
import { RegisterForm } from "../features/components/Register";
import { ForgetPassword } from "../features/components/ForgetPassword";
import { VerificationCode } from "../features/components/VerificationCode";
import { ResetPassword } from "../features/components/ResetPassword";
import TeacherProfile from "../pages/TeacherProfile";
import OneCourse from "../pages/CourseOne";
import MyCourses from "../pages/MyCourses";
import UserProfile from "../pages/MyProfile";
import EditProfile from "../pages/MyProfile/EditProfile";
import ChangePassword from "../pages/MyProfile/changePassword.jsx";

import ProtectedRoute from "../components/ProtectedRoute";
import App from "../App";
import DashboardHome from "../dashboard/layouts/dashboard/DashboardHome.js";
import Tables from "../dashboard/layouts/tables/index.js";
import ProtectedDashboardRoute from "../components/ProtectedRoute/ProtectedDashboardRoute.jsx";
import RoleProtectedRoute from "../components/ProtectedRoute/RoleProtectedRoute.jsx";
import UsersTable from "../dashboard/layouts/tables/UsersTable.jsx";
import CoursesDashboard from "../dashboard/layouts/courses";
import TeacherRequests from "../dashboard/layouts/teacherRequests";
import BranchesDashboard from "../dashboard/layouts/branches";
import SubjectsDashboard from "../dashboard/layouts/subjects";
import PaymentsDashboard from "../dashboard/layouts/payments";
import LessonsDashboard from "../dashboard/layouts/lessons";
import Broadcast from "../dashboard/layouts/broadcast";
import InboxDashboard from "../dashboard/layouts/inbox/InboxDashboard";

// Lazy loaded pages
const Main = lazy(() => import("../pages/Main"));
const About = lazy(() => import("../pages/About"));
const News = lazy(() => import("../pages/News"));
const Contact = lazy(() => import("../pages/Contact"));
const Auth = lazy(() => import("../pages/Auth"));
const OAuthSuccess = lazy(() => import("../features/components/OAuthSuccess"));
const NotFound = lazy(() => import("../pages/NotFound"));
const NotAuth = lazy(() => import("../pages/NotAuth"));
const Courses = lazy(() => import("../pages/Courses"));
const Teachers = lazy(() => import("../pages/Teachers"));
const WishList = lazy(() => import("../pages/Wishlist"));
const CartList = lazy(() => import("../pages/CartList"));
const VideoPage = lazy(() => import("../pages/CourseOne/VideoPage"));
const TeacherAiQuizBuilder = lazy(() => import("../pages/TeacherAiQuizBuilder"));
const InboxStudent = lazy(() => import("../pages/InboxStudent"));

export const PATH = {
  Main: "/",
  About: "about",
  News: "news",
  Contact: "contact",
  Courses: "courses",
  CoursesOne: "courses/:name/:id",
  VideoLesson: "courses/:name/:id/video/:videoIndex",
  Auth: "auth",
  Login: "auth/login",
  Register: "auth/register",
  ForgetPassword: "forget-password",
  VerificationCode: "verification-code",
  ResetPassword: "reset-password",
  Teachers: "teachers",
  TeacherProfile: "teachers/:id",
  User: "user",
  WishList: "wishlist",
  CartList: "cartlist",
  MyCourses: "my-courses",
  OAuthSuccess: "oauth-success",
  UserProfile: "user-profile",
  EditProfile: "edit-profile",
  NotAuth: "not-auth",
  ChangePassword: "change-password",
  AdminDashboard: "dashboard",
};

export const routers = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: "about", element: <About /> },
      { path: "news", element: <News /> },
      { path: "contact", element: <Contact /> },
      { path: "courses", element: <Courses /> },
      { path: "courses/:name/:id", element: <OneCourse /> },
      { path: "courses/:name/:id/video/:videoIndex", element: <VideoPage /> },

      {
        path: "auth",
        element: <Auth />,
        children: [
          { index: true, element: <Navigate to="login" /> },
          { path: "login", element: <LoginForm /> },
          { path: "register", element: <RegisterForm /> },
        ],
      },

      { path: "forget-password", element: <ForgetPassword /> },
      { path: "verification-code", element: <VerificationCode /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "teachers", element: <Teachers /> },
      { path: "teachers/:id", element: <TeacherProfile /> },
      { path: "not-auth", element: <NotAuth /> },
      { path: "oauth-success", element: <OAuthSuccess /> },

      {
        path: "user",
        element: <ProtectedRoute />,
        children: [
          { path: "wishlist", element: <WishList /> },
          { path: "cartlist", element: <CartList /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "user-profile", element: <UserProfile /> },
          { path: "edit-profile", element: <EditProfile /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "inbox", element: <InboxStudent /> },
        ],
      },


      {
        path: "dashboard",
        element: <ProtectedDashboardRoute />,
        children: [

        // ------------------------- Admin routes -------------------------

          {
            index: true,
            element:
              <RoleProtectedRoute allowedRoles={["admin", "teacher"]}>
                <DashboardHome />
              </RoleProtectedRoute>
          },
          {
            path: "students",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <UsersTable usersType={"user"} tableTitle={"جدول الطلاب"}/>
              </RoleProtectedRoute>
          },
          {
            path: "teachers",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <UsersTable usersType={"teacher"} tableTitle={"جدول المعلمين"}/>
              </RoleProtectedRoute>
          },
          {
            path: "teachers-requests",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <TeacherRequests />
              </RoleProtectedRoute>
          },
          {
            path: "branches",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <BranchesDashboard />
              </RoleProtectedRoute>
          },
          {
            path: "subjects",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <SubjectsDashboard />
              </RoleProtectedRoute>
          },
          {
            path: "courses",
            element:
              <RoleProtectedRoute allowedRoles={["admin", "teacher"]}>
                <CoursesDashboard />
              </RoleProtectedRoute>
          },
          {
            path: "payments",
            element:
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <PaymentsDashboard />
              </RoleProtectedRoute>
          },
          

        // ------------------------- Teacher routes -------------------------

          {
            path: "lessons",
            element:
              <RoleProtectedRoute allowedRoles={["teacher"]}>
                <LessonsDashboard />
              </RoleProtectedRoute>
          },
          {
            path: "ai-quiz",
            element:
              <RoleProtectedRoute allowedRoles={["teacher"]}>
                <TeacherAiQuizBuilder />
              </RoleProtectedRoute>
          },
          {
            path: "broadcast",
            element:
              <RoleProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Broadcast />
              </RoleProtectedRoute>
          },
          {
            path: "inbox",
            element:
              <RoleProtectedRoute allowedRoles={["admin", "teacher"]}>
                <InboxDashboard />
              </RoleProtectedRoute>
          },

        ]
      },

      // {
      //   path: "dashboard",
      //   element: <ProtectedDashboardRoute />,
      //   children: [
      //     {
      //       path: "admin",
      //       element: <RoleProtectedRoute allowedRoles={["admin"]} />,
      //       children: [

      //         { index: true, element: <Dashboard /> },
      //         { path: "tables", element: <Tables tableTitle={"جدول الطلاب"} /> },
      //         { path: "billing", element: <Billing /> },
      //         { path: "courses", element: <Billing /> },

      //       ],
      //     },

      //     {
      //       path: "teacher",
      //       element: <RoleProtectedRoute allowedRoles={["teacher"]} />,
      //       children: [
      //         { path: "courses", element: <Billing /> },
      //       ],
      //     },

      //   ]
      // },

      { path: "*", element: <NotFound /> },
    ],
  },
];
