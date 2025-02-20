import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import { lazy } from "react";

const MainPage = lazy(() => import("./pages/MainPage.tsx"));
const VacationPage = lazy(() => import("./pages/VacationPage.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.tsx"));
const MeetingPage = lazy(() => import("./pages/MeetingPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const VacationDetailPage = lazy(() => import("./pages/VacationDetailPage.tsx"));
const MeetingDetailPage = lazy(() => import("./pages/MeetingDetailPage.tsx"));
const FindPasswordPage = lazy(() => import("./pages/FindPasswordPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/vacation",
        element: <VacationPage />,
      },
      {
        path: "/meeting",
        element: <MeetingPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/vacation-detail/:vacationId",
        element: <VacationDetailPage />,
      },
      {
        path: "/meeting-detail/:meetingId",
        element: <MeetingDetailPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/find-password",
    element: <FindPasswordPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
