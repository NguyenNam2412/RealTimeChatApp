import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@pages/Login/LoginPage";
import HomePage from "@pages/Home/HomePage";
import NotFound from "@pages/Home/NotFound";
import AdminSide from "@pages/Admin/AdminSide";

//admin side
import AdminApproveSide from "@pages/Admin/adminApproveSide";

const AppRouter = () => (
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* home side */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      >
        {/*redirect default Route */}
        <Route index element={<Navigate to="" replace />} />

        {/* real route navlink admin*/}
        <Route path="admin" element={<AdminApproveSide />} />
        {/* <Route
          path=""
          element={}
        />
        <Route path="" element={} /> */}
      </Route>
      <Route path="admin-side" element={<AdminSide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRouter;
