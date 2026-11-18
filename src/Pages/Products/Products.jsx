import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, PackageX, Package } from "lucide-react";
import api from "../../Services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products");
      const productData = res.data.products || res.data;

      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((product) => product._id !== id));

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  // STOCK COUNTS
  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockCount = products.filter(
    (product) => (Number(product.stock) || 0) <= 0,
  ).length;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#421713]">Products</h1>
          <p className="text-gray-500 mt-2">Manage your CHRONOS products</p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-[#421713] text-white px-6 py-3 rounded-lg hover:bg-[#5c2923] transition"
        >
          + Add Product
        </Link>
      </div>

      {/* PRODUCT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* TOTAL PRODUCTS */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <h2 className="text-2xl font-bold text-[#421713] mt-1">
              {products.length}
            </h2>
          </div>

          <div className="bg-[#f5eee5] p-3 rounded-lg">
            <Package size={24} className="text-[#421713]" />
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Low Stock Products</p>
            <h2 className="text-2xl font-bold text-amber-600 mt-1">
              {lowStockCount}
            </h2>
            <p className="text-xs text-gray-400 mt-1">1–5 items remaining</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <AlertTriangle size={24} className="text-amber-600" />
          </div>
        </div>

        {/* OUT OF STOCK */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">
              {outOfStockCount}
            </h2>
            <p className="text-xs text-gray-400 mt-1">No stock available</p>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <PackageX size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>

          <button onClick={fetchProducts} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#f5eee5] text-[#421713]">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-[#faf8f5] transition"
              >
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>

                <td className="p-4 font-medium text-gray-800">
                  {product.name}
                </td>

                <td className="p-4 text-gray-600">{product.category}</td>

                <td className="p-4 font-medium">
                  ${Number(product.price).toLocaleString("en-US")}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock ?? 0}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && !error && (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No products found. Click Add Product to create your first
                  product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
