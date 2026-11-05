import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./Pages/AdminLogin";
import Dashboard from "./Pages/Dashboard";
import AdminLayout from "./Layout/AdminLayout";
import ProtectedRoute from "./Pages/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
