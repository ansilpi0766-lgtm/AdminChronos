import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";

const AddProducts = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    description: "",
    size: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setImage(selectedImage);
  };

  // Create image preview
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.productName.trim() ||
      !formData.price ||
      !formData.category ||
      !formData.brand.trim() ||
      !formData.description.trim() ||
      formData.stock === "" ||
      !image
    ) {
      setError("Please fill all required fields and select an image.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Product details
      data.append("productName", formData.productName.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("stock", formData.stock);
      data.append("description", formData.description.trim());

      // Convert sizes into an array
      const sizes = formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("size", JSON.stringify(sizes));

      // Product image
      data.append("image", image);

      // Send to backend
      const response = await api.post("/products", data);

      if (response.data.success) {
        alert("Product added successfully!");

        navigate("/admin/products");
      } else {
        setError(response.data.message || "Product could not be added.");
      }
    } catch (err) {
      console.error("Product upload error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Failed to add product. Please check your backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Add New Product</h1>

          <p className="text-gray-500 mt-2">
            Add products to your CHRONOS collection.
          </p>
        </div>

        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 md:p-8 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#421713] mb-6">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Product Name *
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Price ($) *
              </label>

              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
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

            {/* Brand */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Brand *
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Available Sizes
              </label>

              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Example: S, M, L, XL"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
              />

              <p className="text-xs text-gray-400 mt-1">
                Separate sizes using commas.
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Product Image *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />

              <p className="text-xs text-gray-400 mt-2">
                Supported formats: JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {/* Image Preview */}
              {preview && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Image Preview
                  </p>

                  <img
                    src={preview}
                    alt="Product preview"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />

                  <p className="text-sm text-gray-500 mt-2">{image?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#421713] text-white px-8 py-3 rounded-lg hover:bg-[#5a241d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Save Product"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/products")}
              className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
