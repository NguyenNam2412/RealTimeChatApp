import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@pages/Login/LoginPage";
import NotFound from "@pages/Home/NotFound";
import AdminSide from "@pages/Admin/AdminSide";
import ChatApp from "@pages/chat/ChatApp";

//admin side
import ListUserManage from "@pages/Admin/ListUserManage";

const AppRouter = () => (
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* user side */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        }
      />
      {/* adminSide */}
      <Route path="admin" element={<AdminSide />}>
        {/*redirect default Route */}
        <Route index element={<Navigate to="admin/list-user" replace />} />

        {/* real route navlink admin*/}
        <Route path="admin/list-user" element={<ListUserManage />} />
        {/* <Route
            path=""
            element={}
          />
          <Route path="" element={} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRouter;
