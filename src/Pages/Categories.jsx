import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  ImagePlus,
  Loader2,
} from "lucide-react";

const API = "http://localhost:5000/api/v1/categories";

const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // GET ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      image: null,
    });

    setEditId(null);
    setShowForm(false);
  };

  // CLOUDINARY IMAGE UPLOAD
  const uploadImage = async (file) => {
    if (!CLOUDINARY_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary environment variables are missing");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return {
      image: data.secure_url,
      imagePublicId: data.public_id,
    };
  };

  // ADD / UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let imageData = {};

      if (form.image) {
        imageData = await uploadImage(form.image);
      }

      const existingCategory = categories.find(
        (category) => category._id === editId,
      );

      const body = {
        name: form.name,
        description: form.description,
        ...(editId ? {} : {}),
        ...imageData,
      };

      if (!editId && !form.image) {
        throw new Error("Please select a category image");
      }

      if (editId && !form.image && existingCategory) {
        body.image = existingCategory.image;
        body.imagePublicId = existingCategory.imagePublicId;
      }

      const response = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editId
          ? "Category updated successfully!"
          : "Category added successfully!",
      );

      resetForm();
      fetchCategories();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // EDIT CATEGORY
  const handleEdit = (category) => {
    setEditId(category._id);

    setForm({
      name: category.name,
      description: category.description,
      image: null,
    });

    setShowForm(true);
  };

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  // ACTIVATE / DEACTIVATE
  const toggleStatus = async (category) => {
    try {
      const response = await fetch(`${API}/${category._id}`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !category.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#FFEDD0] p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#421713]">Categories</h1>

          <p className="text-[#80665B] mt-2">
            Manage your CHRONOS product categories
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#421713] text-white px-5 py-3 rounded-lg hover:bg-[#603029]"
        >
          <Plus size={19} />
          Add Category
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#80665B] text-sm">Total Categories</p>

              <h2 className="text-3xl font-semibold text-[#421713] mt-2">
                {categories.length}
              </h2>
            </div>

            <FolderOpen size={35} className="text-[#421713]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#80665B] text-sm">Active Categories</p>

              <h2 className="text-3xl font-semibold text-[#421713] mt-2">
                {categories.filter((c) => c.isActive).length}
              </h2>
            </div>

            <FolderOpen size={35} className="text-green-700" />
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={19} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#421713]"
          />
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[#421713] mb-6">
          All Categories
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#421713]" size={35} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FolderOpen size={45} className="mx-auto mb-3" />
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="border border-[#eadbc9] rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-[#421713]">
                      {category.name}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 min-h-10">
                    {category.description}
                  </p>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t">
                    <button
                      onClick={() => toggleStatus(category)}
                      className="text-xs text-[#80665B] hover:text-[#421713]"
                    >
                      {category.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-[#421713]">
                {editId ? "Edit Category" : "Add Category"}
              </h2>

              <button onClick={resetForm}>
                <X size={23} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#421713]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Enter category description"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#421713]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Image
                </label>

                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-[#421713]">
                  <ImagePlus size={35} className="text-[#80665B]" />

                  <span className="text-sm text-gray-500 mt-2">
                    Click to upload image
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.files[0],
                      })
                    }
                  />
                </label>

                {form.image && (
                  <p className="text-sm text-green-700 mt-2">
                    Selected: {form.image.name}
                  </p>
                )}

                {editId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to keep the existing image.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#421713] text-white py-3 rounded-lg hover:bg-[#603029] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editId
                      ? "Update Category"
                      : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
