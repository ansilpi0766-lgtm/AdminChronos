import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE IMAGE SELECTION
  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
      setImage(null);
      e.target.value = "";
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      setImage(null);
      e.target.value = "";
      return;
    }

    setError("");
    setImage(selectedImage);
  };

  // IMAGE PREVIEW
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // SUBMIT PRODUCT
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

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("productName", formData.productName.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("stock", formData.stock);
      data.append("description", formData.description.trim());

      const sizes = formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("size", JSON.stringify(sizes));
      data.append("image", image);

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
          "Failed to add product. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Add New Product</h1>

          <p className="mt-2 text-gray-500">
            Add products to your CHRONOS collection.
          </p>
        </div>

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
                Product Name *
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
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
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* DYNAMIC CATEGORY */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
                Brand *
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* SIZES */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Available Sizes
              </label>

              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Example: S, M, L, XL"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Separate sizes using commas.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Product Image *
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                required
              />

              <p className="mt-2 text-xs text-gray-400">
                Supported formats: JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {/* IMAGE PREVIEW */}
              {preview && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Image Preview
                  </p>

                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-40 w-40 rounded-lg border object-cover"
                  />

                  <p className="mt-2 text-sm text-gray-500">{image?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={loading || categoriesLoading || categories.length === 0}
              className="rounded-lg bg-[#421713] px-8 py-3 text-white hover:bg-[#5a241d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save Product"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-400 px-8 py-3 hover:bg-gray-100 disabled:opacity-50"
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
