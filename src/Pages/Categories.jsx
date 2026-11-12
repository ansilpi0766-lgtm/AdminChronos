import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../Services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);

      setError(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/categories/${id}`);

      setCategories((prev) => prev.filter((category) => category._id !== id));

      alert("Category deleted successfully");
    } catch (error) {
      console.error("Delete category error:", error);

      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading categories...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store categories
          </p>
        </div>

        <Link
          to="/admin/categories/add"
          className="rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add Category
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CATEGORY COUNT */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Categories</p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {categories.length}
        </h2>
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        {categories.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your first category to get started.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {category.name}
                  </td>

                  <td className="max-w-xs px-6 py-4 text-sm text-gray-500">
                    {category.description}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/categories/edit/${category._id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(category._id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Categories;
