import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../Services/api";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await API.get(`/categories/${id}`);
        const category = response.data.category;

        setName(category.name);
        setDescription(category.description);
        setPreview(category.image);
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("Failed to load category");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Image preview
  useEffect(() => {
    if (!image) return;

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // Update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/categories/${id}`, formData);

      alert("Category updated successfully!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8">Loading category...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Category</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Category Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border p-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full rounded-lg border p-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full rounded-lg border p-3"
            />

            {preview && (
              <img
                src={preview}
                alt="Category preview"
                className="mt-4 h-40 w-40 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Category"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
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

export default EditCategory;
