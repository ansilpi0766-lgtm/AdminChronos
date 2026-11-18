import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Services/api";

const AddBrand = () => {
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

  // Submit brand
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a brand name");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (image) {
        formData.append("image", image);
      }

      const response = await API.post("/brands", formData);

      alert(response.data.message || "Brand added successfully!");

      navigate("/admin/brands");
    } catch (error) {
      console.error("Add brand error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add brand. Please try again.",
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
            onClick={() => navigate("/admin/brands")}
            className="mb-4 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Brands
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Add New Brand</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new brand for your CHRONOS store.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          {/* BRAND NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Brand Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
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
              placeholder="Enter brand description (optional)"
              rows="4"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* LOGO UPLOAD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Brand Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-400">
              Upload a brand logo (optional).
            </p>
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Logo Preview
              </p>

              <img
                src={preview}
                alt="Brand logo preview"
                className="h-48 w-48 rounded-xl border bg-white p-3 object-contain"
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
              {loading ? "Saving..." : "Save Brand"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/brands")}
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

export default AddBrand;
