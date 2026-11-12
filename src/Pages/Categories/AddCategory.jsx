import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Services/api";

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Image preview
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  // Submit category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !image) {
      alert("Please fill all fields and select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("image", image);

      const response = await API.post("/categories", formData);

      alert(response.data.message || "Category added successfully!");

      navigate("/admin/categories");
    } catch (error) {
      console.error("Add category error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add category. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/categories")}
            className="mb-4 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Categories
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new category for your CHRONOS store.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          {/* CATEGORY NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              rows="4"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
              required
            />
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Image Preview
              </p>

              <img
                src={preview}
                alt="Category preview"
                className="h-48 w-48 rounded-xl border object-cover"
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Category"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
