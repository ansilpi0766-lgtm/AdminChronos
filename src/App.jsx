import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./Pages/AdminLogin";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products/Products";
import AddProducts from "./Pages/Products/AddProducts";

import AdminLayout from "./Layout/AdminLayout";
import ProtectedRoute from "./Pages/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Dashboard */}
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

      {/* Products */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Products />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Add Products */}
      <Route
        path="/admin/products/add"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AddProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
