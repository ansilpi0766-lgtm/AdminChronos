import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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

<<<<<<< HEAD
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

=======
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

<<<<<<< HEAD
  // FETCH CATEGORIES FROM DATABASE
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const res = await api.get("/categories");

        const activeCategories = (res.data.categories || []).filter(
          (category) => category.isActive !== false,
        );

        setCategories(activeCategories);
      } catch (err) {
        console.error("Fetch categories error:", err);

        setCategoriesError(
          err.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // HANDLE INPUT CHANGES
=======
  // Handle input changes
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

<<<<<<< HEAD
  // HANDLE IMAGE SELECTION
=======
  // Handle image selection
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
<<<<<<< HEAD
      setImage(null);
      e.target.value = "";
=======
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
<<<<<<< HEAD
      setImage(null);
      e.target.value = "";
=======
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      return;
    }

    setError("");
    setImage(selectedImage);
  };

<<<<<<< HEAD
  // IMAGE PREVIEW
=======
  // Create image preview
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

<<<<<<< HEAD
  // SUBMIT PRODUCT
=======
  // Submit product
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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

<<<<<<< HEAD
    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
=======
    if (Number(formData.price) <= 0) {
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      setError("Please enter a valid product price.");
      return;
    }

<<<<<<< HEAD
    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Please enter a valid stock quantity.");
=======
    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

<<<<<<< HEAD
=======
      // Product details
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      data.append("productName", formData.productName.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("stock", formData.stock);
      data.append("description", formData.description.trim());

<<<<<<< HEAD
=======
      // Convert sizes into an array
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      const sizes = formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("size", JSON.stringify(sizes));
<<<<<<< HEAD
      data.append("image", image);

=======

      // Product image
      data.append("image", image);

      // Send to backend
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      const response = await api.post("/products", data);

      if (response.data.success) {
        alert("Product added successfully!");
<<<<<<< HEAD
=======

>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
        navigate("/admin/products");
      } else {
        setError(response.data.message || "Product could not be added.");
      }
    } catch (err) {
      console.error("Product upload error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
<<<<<<< HEAD
          "Failed to add product. Please check your connection.",
=======
          "Failed to add product. Please check your backend connection.",
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-4 md:p-6">
<<<<<<< HEAD
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Add New Product</h1>

          <p className="mt-2 text-gray-500">
=======
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Add New Product</h1>

          <p className="text-gray-500 mt-2">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
            Add products to your CHRONOS collection.
          </p>
        </div>

<<<<<<< HEAD
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-5 shadow-sm md:p-8"
        >
          <h2 className="mb-6 text-xl font-semibold text-[#421713]">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* PRODUCT NAME */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
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
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Product Name *
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
<<<<<<< HEAD
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
=======
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                required
              />
            </div>

<<<<<<< HEAD
            {/* PRICE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Price */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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
<<<<<<< HEAD
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
=======
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                required
              />
            </div>

<<<<<<< HEAD
            {/* DYNAMIC CATEGORY */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
<<<<<<< HEAD
                disabled={categoriesLoading || categories.length === 0}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713] disabled:bg-gray-100"
                required
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No categories available"
                      : "Select Category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {categoriesError && (
                <p className="mt-2 text-sm text-red-600">{categoriesError}</p>
              )}

              {!categoriesLoading && categories.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Create a category before adding a product.{" "}
                  <Link
                    to="/admin/categories/add"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Add Category
                  </Link>
                </p>
              )}
            </div>

            {/* BRAND */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
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
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Brand *
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand"
<<<<<<< HEAD
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
=======
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                required
              />
            </div>

<<<<<<< HEAD
            {/* STOCK */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Stock */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
<<<<<<< HEAD
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
=======
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                required
              />
            </div>

<<<<<<< HEAD
            {/* SIZES */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Sizes */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Available Sizes
              </label>

              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Example: S, M, L, XL"
<<<<<<< HEAD
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
              />

              <p className="mt-1 text-xs text-gray-400">
=======
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
              />

              <p className="text-xs text-gray-400 mt-1">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Separate sizes using commas.
              </p>
            </div>

<<<<<<< HEAD
            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Description *
              </label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
<<<<<<< HEAD
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
=======
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#421713]"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                required
              />
            </div>

<<<<<<< HEAD
            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
=======
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                Product Image *
              </label>

              <input
                type="file"
<<<<<<< HEAD
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                required
              />

              <p className="mt-2 text-xs text-gray-400">
                Supported formats: JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {preview && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-gray-600">
=======
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
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                    Image Preview
                  </p>

                  <img
                    src={preview}
                    alt="Product preview"
<<<<<<< HEAD
                    className="h-40 w-40 rounded-lg border object-cover"
                  />

                  <p className="mt-2 text-sm text-gray-500">{image?.name}</p>
=======
                    className="w-40 h-40 object-cover rounded-lg border"
                  />

                  <p className="text-sm text-gray-500 mt-2">{image?.name}</p>
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
                </div>
              )}
            </div>
          </div>

<<<<<<< HEAD
          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
=======
          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
              {error}
            </div>
          )}

<<<<<<< HEAD
          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={loading || categoriesLoading || categories.length === 0}
              className="rounded-lg bg-[#421713] px-8 py-3 text-white hover:bg-[#5a241d] disabled:cursor-not-allowed disabled:opacity-50"
=======
          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#421713] text-white px-8 py-3 rounded-lg hover:bg-[#5a241d] disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
            >
              {loading ? "Uploading..." : "Save Product"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/products")}
<<<<<<< HEAD
              className="rounded-lg border border-gray-400 px-8 py-3 hover:bg-gray-100 disabled:opacity-50"
=======
              className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50"
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5
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
