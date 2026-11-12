import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    size: "",
    description: "",
  });

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // GET SINGLE PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === "undefined") {
        setError(
          "Product ID is missing. Please open Edit from the Products page.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);
        const product = res.data.product;

        if (!product) {
          setError("Product not found.");
          return;
        }

        setFormData({
          productName: product.name || "",
          price: product.price ?? "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock ?? 0,
          size: Array.isArray(product.size) ? product.size.join(", ") : "",
          description: product.description || "",
        });

        setImage(product.image || "");
      } catch (err) {
        console.error("Fetch product error:", err);

        setError(
          err.response?.data?.message || "Unable to load product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.productName.trim() ||
      !formData.description.trim() ||
      !formData.brand.trim() ||
      !formData.category ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Enter a valid product price.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const updatedProduct = {
        name: formData.productName.trim(),
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        stock: Number(formData.stock),
        size: formData.size
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        description: formData.description.trim(),
      };

      const res = await api.put(`/products/${id}`, updatedProduct);

      if (res.data.success) {
        alert("Product updated successfully!");
        navigate("/admin/products");
      } else {
        setError(res.data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);

      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex justify-center items-center">
        <p className="text-[#421713] text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Edit Product</h1>

          <p className="text-gray-500 mt-2">
            Update your CHRONOS product information.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-5 md:p-8"
        >
          <h2 className="text-xl font-semibold text-[#421713] mb-6">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRODUCT NAME */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price ($) *
              </label>

              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Accessories">Accessories</option>
                <option value="Fine Art">Fine Art</option>
              </select>
            </div>

            {/* BRAND */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand *</label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* SIZE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Sizes
              </label>

              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
              />

              <p className="text-xs text-gray-400 mt-1">
                Separate sizes using commas.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* PRODUCT IMAGE */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-3">
                Current Product Image
              </label>

              {image ? (
                <img
                  src={image}
                  alt={formData.productName}
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              ) : (
                <p className="text-gray-400">No image available.</p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Existing image will remain unchanged.
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#421713] text-white px-8 py-3 rounded-lg hover:bg-[#5c2923] transition disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => navigate("/admin/products")}
              className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProducts;
