import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import API from "../Services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/categories");
      const data = response.data;

      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error("Category fetch error:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await API.delete(`/categories/${id}`);

      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="category-page">
      <style>{`
        .category-page {
          width: 100%;
          color: #351711;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .category-subtitle {
          color: #A17A55;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .category-title {
          font-size: 25px;
          font-weight: 700;
          color: #351711;
          margin: 0;
        }

        .category-description {
          color: #8B8179;
          font-size: 13px;
          margin-top: 5px;
        }

        .add-category-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: #421713;
          color: white;
          padding: 11px 19px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: 0.2s;
        }

        .add-category-btn:hover {
          background: #693027;
          color: white;
        }

        .category-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          background: white;
          border: 1px solid #EAE2D8;
          border-radius: 9px;
          padding: 13px 16px;
          margin-bottom: 18px;
        }

        .category-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 340px;
          max-width: 100%;
          padding: 9px 12px;
          border: 1px solid #E8E1D9;
          border-radius: 6px;
          color: #93877D;
        }

        .category-search input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 13px;
          color: #351711;
          background: transparent;
        }

        .category-count {
          font-size: 12px;
          color: #81766E;
          white-space: nowrap;
        }

        .category-count strong {
          color: #421713;
          margin-left: 4px;
        }

        .category-table-card {
          background: white;
          border: 1px solid #EAE2D8;
          border-radius: 9px;
          overflow: hidden;
        }

        .category-table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }

        .category-table th {
          background: #FAF7F2;
          color: #8A7667;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #EAE2D8;
        }

        .category-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #F0ECE7;
          vertical-align: middle;
          font-size: 13px;
          overflow: hidden;
        }

        .category-table tbody tr:last-child td {
          border-bottom: none;
        }

        .category-table tbody tr:hover {
          background: #FDFBF8;
        }

        .category-image-box {
          width: 64px;
          height: 64px;
          min-width: 64px;
          overflow: hidden;
          border-radius: 7px;
          background: #F5F0E9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-image-box img {
          display: block;
          width: 64px !important;
          height: 64px !important;
          min-width: 64px;
          max-width: 64px !important;
          object-fit: cover !important;
          object-position: center;
        }

        .category-name {
          font-weight: 600;
          color: #351711;
          font-size: 13px;
        }

        .category-desc {
          color: #8B8179;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .category-status.active {
          background: #EAF5ED;
          color: #31834C;
        }

        .category-status.inactive {
          background: #F1EFED;
          color: #81766E;
        }

        .category-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .category-action-btn {
          width: 33px;
          height: 33px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }

        .category-edit {
          background: #F4EDE5;
          color: #70432F;
        }

        .category-edit:hover {
          background: #E9D9C9;
        }

        .category-delete {
          background: #FFF0EE;
          color: #C34B42;
        }

        .category-delete:hover {
          background: #FBDCD8;
        }

        .category-empty {
          padding: 55px 20px;
          text-align: center;
          color: #93877D;
          font-size: 13px;
        }

        .category-footer {
          text-align: right;
          font-size: 11px;
          color: #A69B91;
          margin-top: 12px;
        }

        @media (max-width: 700px) {
          .category-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .category-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .category-search {
            width: 100%;
          }

          .category-table {
            min-width: 720px;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="category-header">
        <div>
          <p className="category-subtitle">Inventory Management</p>
          <h1 className="category-title">Categories</h1>
          <p className="category-description">
            Manage and organize your product categories
          </p>
        </div>

        <Link to="/admin/categories/add" className="add-category-btn">
          <Plus size={17} />
          Add Category
        </Link>
      </div>

      {/* SEARCH */}
      <div className="category-toolbar">
        <div className="category-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-count">
          <Layers size={15} style={{ display: "inline", marginRight: 6 }} />
          Total Categories:
          <strong>{categories.length}</strong>
        </div>
      </div>

      {/* TABLE */}
      <div className="category-table-card">
        {loading ? (
          <div className="category-empty">Loading categories...</div>
        ) : error ? (
          <div className="category-empty">
            <p style={{ color: "#C34B42" }}>{error}</p>
            <button
              onClick={fetchCategories}
              style={{
                marginTop: 12,
                color: "#421713",
                textDecoration: "underline",
              }}
            >
              Try again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="category-empty">
            <Layers size={30} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p>No categories found</p>
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table className="category-table">
              <colgroup>
                <col style={{ width: "110px" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "32%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "130px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="category-image-box">
                        {category.image ? (
                          <img src={category.image} alt={category.name} />
                        ) : (
                          <ImageIcon size={23} color="#A69B91" />
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="category-name">{category.name}</span>
                    </td>

                    <td>
                      <p className="category-desc" title={category.description}>
                        {category.description || "No description"}
                      </p>
                    </td>

                    <td>
                      <span
                        className={`category-status ${
                          category.isActive ? "active" : "inactive"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="category-actions">
                        <Link
                          to={`/admin/categories/edit/${category._id}`}
                          title="Edit category"
                          className="category-action-btn category-edit"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          onClick={() => handleDelete(category._id)}
                          title="Delete category"
                          className="category-action-btn category-delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && filteredCategories.length > 0 && (
        <p className="category-footer">
          Showing {filteredCategories.length} of {categories.length} categories
        </p>
      )}
    </div>
  );
};

export default Categories;
