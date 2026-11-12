import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./Pages/AdminLogin";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products/Products";
import AddProducts from "./Pages/Products/AddProducts";

import AdminLayout from "./Layout/AdminLayout";
import ProtectedRoute from "./Pages/ProtectedRoute";

import Products from "./Pages/Products/Products";
import AddProducts from "./Pages/Products/AddProducts";
import EditProducts from "./Pages/Products/EditProducts";

import Categories from "./Pages/Categories";
import AddCategory from "./Pages/Categories/AddCategory";
import EditCategory from "./Pages/Categories/EditCategory";
import Orders from "./Pages/Order/Orders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

<<<<<<< HEAD
      {/* DASHBOARD */}
=======
      {/* Dashboard */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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

<<<<<<< HEAD
      {/* PRODUCTS */}
=======
      {/* Products */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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

<<<<<<< HEAD
=======
      {/* Add Products */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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
<<<<<<< HEAD

      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EditProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* CATEGORIES */}
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Categories />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ADD CATEGORY */}
      <Route
        path="/admin/categories/add"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AddCategory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EditCategory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
=======
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
    </Routes>
  );
}

export default App;
