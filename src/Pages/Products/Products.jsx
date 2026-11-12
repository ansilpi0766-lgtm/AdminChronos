import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

<<<<<<< HEAD
  // Fetch products
=======
  // Fetch all products
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products");

<<<<<<< HEAD
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError(error.response?.data?.message || "Failed to load products");
=======
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products. Please try again.",
      );
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
  // Load products when page opens
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
<<<<<<< HEAD
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
=======
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((product) => product._id !== id));

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
<<<<<<< HEAD
=======

>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

<<<<<<< HEAD
  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
=======
  // Loading screen
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading products...</div>
    );
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6">
<<<<<<< HEAD
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#421713]">Products</h1>
=======
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#421713]">Products</h1>

>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
          <p className="text-gray-500 mt-2">Manage your CHRONOS products</p>
        </div>

        <Link
          to="/admin/products/add"
<<<<<<< HEAD
          className="bg-[#421713] text-white px-6 py-3 rounded-lg hover:bg-[#5c2923]"
=======
          className="bg-[#421713] text-white px-6 py-3 rounded-lg hover:bg-[#5c2923] transition"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
        >
          + Add Product
        </Link>
      </div>

      {/* Product Count */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <p className="text-gray-500 text-sm">Total Products</p>
<<<<<<< HEAD
=======

>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
        <h2 className="text-2xl font-bold text-[#421713] mt-1">
          {products.length}
        </h2>
      </div>

<<<<<<< HEAD
      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
          {error}
          <button onClick={fetchProducts} className="ml-3 underline">
=======
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
          {error}

          <button
            onClick={fetchProducts}
            className="ml-3 underline font-medium"
          >
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
            Retry
          </button>
        </div>
      )}

      {/* Products Table */}
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
<<<<<<< HEAD
              <tr key={product._id} className="border-b hover:bg-[#faf8f5]">
=======
              <tr
                key={product._id}
                className="border-b hover:bg-[#faf8f5] transition"
              >
                {/* Cloudinary Image */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>

<<<<<<< HEAD
=======
                {/* Product Name */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                <td className="p-4 font-medium text-gray-800">
                  {product.name}
                </td>

<<<<<<< HEAD
                <td className="p-4 text-gray-600">{product.category}</td>

=======
                {/* Category */}
                <td className="p-4 text-gray-600">{product.category}</td>

                {/* Price */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                <td className="p-4 font-medium">
                  ${Number(product.price).toLocaleString("en-US")}
                </td>

<<<<<<< HEAD
=======
                {/* Stock */}
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Actions */}
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

<<<<<<< HEAD
            {products.length === 0 && !error && (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No products found.
=======
            {/* Empty Products */}
            {products.length === 0 && !error && (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No products found. Click Add Product to create your first
                  product.
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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
