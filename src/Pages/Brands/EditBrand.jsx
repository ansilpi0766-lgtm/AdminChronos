import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../Services/api";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing brand
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await API.get(`/brands/${id}`);

        const brand = response.data.brand;

        setName(brand.name || "");
        setDescription(brand.description || "");
        setPreview(brand.image || "");
        setIsActive(brand.isActive ?? true);
      } catch (error) {
        console.error("Error fetching brand:", error);
        alert(error.response?.data?.message || "Failed to load brand");
      } finally {
        setFetching(false);
      }
    };

    fetchBrand();
  }, [id]);

  // Image preview
  useEffect(() => {
    if (!image) return;

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // Update brand
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
      formData.append("isActive", String(isActive));

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/brands/${id}`, formData);

      alert("Brand updated successfully!");
      navigate("/admin/brands");
    } catch (error) {
      console.error("Update brand error:", error);

      alert(error.response?.data?.message || "Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8">Loading brand...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
        {/* HEADER */}
        <button
          type="button"
          onClick={() => navigate("/admin/brands")}
          className="mb-4 text-sm text-gray-500 hover:text-black"
        >
          ← Back to Brands
        </button>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">Edit Brand</h1>

        <p className="mb-6 text-sm text-gray-500">
          Update your CHRONOS brand information.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* BRAND NAME */}
          <div>
            <label className="mb-2 block font-medium">Brand Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter brand name"
              className="w-full rounded-lg border p-3 outline-none focus:border-black"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block font-medium">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Enter brand description"
              className="w-full resize-none rounded-lg border p-3 outline-none focus:border-black"
            />
          </div>

          {/* BRAND LOGO */}
          <div>
            <label className="mb-2 block font-medium">Brand Logo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full rounded-lg border p-3"
            />

            {preview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-500">Logo Preview</p>

                <img
                  src={preview}
                  alt="Brand preview"
                  className="h-40 w-40 rounded-lg border bg-white p-2 object-contain"
                />
              </div>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block font-medium">Brand Status</label>

            <select
              value={String(isActive)}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full rounded-lg border p-3 outline-none focus:border-black"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Brand"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/brands")}
              className="rounded-lg border px-6 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
