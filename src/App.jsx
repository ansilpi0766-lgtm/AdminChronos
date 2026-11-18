import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Authentication
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Pages/ProtectedRoute";

// Layout
import AdminLayout from "./Layout/AdminLayout";

// Dashboard
import Dashboard from "./Pages/Dashboard";

// Products
import Products from "./Pages/Products/Products";
import AddProducts from "./Pages/Products/AddProducts";
import EditProducts from "./Pages/Products/EditProducts";

// Categories
import Categories from "./Pages/Categories";
import AddCategory from "./Pages/Categories/AddCategory";
import EditCategory from "./Pages/Categories/EditCategory";

import AddBrand from "./Pages/Brands/AddBrand";
import Brands from "./Pages/Brands/Brands";
import EditBrand from "./Pages/Brands/EditBrand";

// Orders
import Orders from "./Pages/Order/Orders";

// Customers
import Customers from "./Pages/Customers/Customers";
import CustomerDetails from "./Pages/Customers/CustomerDetails";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProducts />} />
          <Route path="products/edit/:id" element={<EditProducts />} />
          {/* Categories */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          {/* // brand */}
          <Route path="brands" element={<Brands />} />
          <Route path="brands/add" element={<AddBrand />} />
          <Route path="brands/edit/:id" element={<EditBrand />} />
          {/* Orders */}
          <Route path="orders" element={<Orders />} />
          {/* Customers */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
        </Route>

        {/* Invalid URL */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
