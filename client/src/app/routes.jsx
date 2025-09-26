import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "../common/hooks/useAuth.js";
import LandingPage from "../features/marketing/LandingPage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import DashboardLayout from "../features/practitioner/dashboard/DashboardLayout.jsx";
import DashboardHome from "../features/practitioner/dashboard/DashboardHome.jsx";
import DashboardSchedule from "../features/practitioner/dashboard/DashboardSchedule.jsx";
import DashboardTreatments from "../features/practitioner/dashboard/DashboardTreatments.jsx";
import DashboardPatients from "../features/practitioner/dashboard/DashboardPatients.jsx";
import PatientDashboardHome from "../features/patient/dashboard/PatientDashboardHome.jsx";
import PatientSchedulePage from "../features/patient/schedule/PatientSchedulePage.jsx";
import FeedbackForm from "../features/patient/feedback/FeedbackForm.jsx";
import PatientProfilePage from "../features/patient/profile/PatientProfilePage.jsx";

const DashboardHomeRoute = () => {
  const { user } = useAuth();
  if (user?.role === "patient") {
    return <PatientDashboardHome />;
  }

  return <DashboardHome />;
};

const PractitionerOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === "practitioner" || user?.role === "admin") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

const PatientOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === "patient") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="animate-pulse text-sm uppercase tracking-[0.3em] text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomeRoute />} />
          <Route
            path="schedule"
            element={
              <PractitionerOnlyRoute>
                <DashboardSchedule />
              </PractitionerOnlyRoute>
            }
          />
          <Route
            path="treatments"
            element={
              <PractitionerOnlyRoute>
                <DashboardTreatments />
              </PractitionerOnlyRoute>
            }
          />
          <Route
            path="patients"
            element={
              <PractitionerOnlyRoute>
                <DashboardPatients />
              </PractitionerOnlyRoute>
            }
          />
          <Route
            path="journey"
            element={
              <PatientOnlyRoute>
                <PatientSchedulePage />
              </PatientOnlyRoute>
            }
          />
          <Route
            path="feedback"
            element={
              <PatientOnlyRoute>
                <FeedbackForm />
              </PatientOnlyRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PatientOnlyRoute>
                <PatientProfilePage />
              </PatientOnlyRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
