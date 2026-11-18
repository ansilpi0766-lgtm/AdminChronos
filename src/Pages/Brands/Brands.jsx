import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tags,
  Image as ImageIcon,
} from "lucide-react";
import API from "../../Services/api";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/brands");
      const data = response.data;

      setBrands(Array.isArray(data) ? data : data.brands || []);
    } catch (err) {
      console.error("Brand fetch error:", err);
      setError(err.response?.data?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) {
      return;
    }

    try {
      await API.delete(`/brands/${id}`);
      setBrands((prev) => prev.filter((brand) => brand._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete brand");
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="brand-page">
      <style>{`
        .brand-page {
          width: 100%;
          color: #351711;
        }

        .brand-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .brand-subtitle {
          color: #A17A55;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .brand-title {
          font-size: 25px;
          font-weight: 700;
          color: #351711;
          margin: 0;
        }

        .brand-description {
          color: #8B8179;
          font-size: 13px;
          margin-top: 5px;
        }

        .add-brand-btn {
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

        .add-brand-btn:hover {
          background: #693027;
          color: white;
        }

        .brand-toolbar {
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

        .brand-search {
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

        .brand-search input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 13px;
          color: #351711;
          background: transparent;
        }

        .brand-count {
          font-size: 12px;
          color: #81766E;
          white-space: nowrap;
        }

        .brand-count strong {
          color: #421713;
          margin-left: 4px;
        }

        .brand-table-card {
          background: white;
          border: 1px solid #EAE2D8;
          border-radius: 9px;
          overflow: hidden;
        }

        .brand-table {
          width: 100%;
          min-width: 650px;
          table-layout: fixed;
          border-collapse: collapse;
        }

        .brand-table th {
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

        .brand-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #F0ECE7;
          vertical-align: middle;
          font-size: 13px;
          overflow: hidden;
        }

        .brand-table tbody tr:last-child td {
          border-bottom: none;
        }

        .brand-table tbody tr:hover {
          background: #FDFBF8;
        }

        .brand-image-box {
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

        .brand-image-box img {
          display: block;
          width: 64px !important;
          height: 64px !important;
          min-width: 64px;
          max-width: 64px !important;
          object-fit: contain !important;
          object-position: center;
        }

        .brand-name {
          font-weight: 600;
          color: #351711;
          font-size: 13px;
        }

        .brand-desc {
          color: #8B8179;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .brand-status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .brand-status.active {
          background: #EAF5ED;
          color: #31834C;
        }

        .brand-status.inactive {
          background: #F1EFED;
          color: #81766E;
        }

        .brand-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .brand-action-btn {
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

        .brand-edit {
          background: #F4EDE5;
          color: #70432F;
        }

        .brand-edit:hover {
          background: #E9D9C9;
        }

        .brand-delete {
          background: #FFF0EE;
          color: #C34B42;
        }

        .brand-delete:hover {
          background: #FBDCD8;
        }

        .brand-empty {
          padding: 55px 20px;
          text-align: center;
          color: #93877D;
          font-size: 13px;
        }

        .brand-footer {
          text-align: right;
          font-size: 11px;
          color: #A69B91;
          margin-top: 12px;
        }

        @media (max-width: 700px) {
          .brand-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .brand-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .brand-search {
            width: 100%;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="brand-header">
        <div>
          <p className="brand-subtitle">Inventory Management</p>
          <h1 className="brand-title">Brands</h1>
          <p className="brand-description">
            Manage and organize your product brands
          </p>
        </div>

        <Link to="/admin/brands/add" className="add-brand-btn">
          <Plus size={17} />
          Add Brand
        </Link>
      </div>

      {/* SEARCH */}
      <div className="brand-toolbar">
        <div className="brand-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="brand-count">
          <Tags size={15} style={{ display: "inline", marginRight: 6 }} />
          Total Brands:
          <strong>{brands.length}</strong>
        </div>
      </div>

      {/* TABLE */}
      <div className="brand-table-card">
        {loading ? (
          <div className="brand-empty">Loading brands...</div>
        ) : error ? (
          <div className="brand-empty">
            <p style={{ color: "#C34B42" }}>{error}</p>
            <button
              onClick={fetchBrands}
              style={{
                marginTop: 12,
                color: "#421713",
                textDecoration: "underline",
              }}
            >
              Try again
            </button>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="brand-empty">
            <Tags size={30} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p>No brands found</p>
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table className="brand-table">
              <colgroup>
                <col style={{ width: "110px" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "32%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "130px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Brand Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBrands.map((brand) => (
                  <tr key={brand._id}>
                    <td>
                      <div className="brand-image-box">
                        {brand.image ? (
                          <img src={brand.image} alt={brand.name} />
                        ) : (
                          <ImageIcon size={23} color="#A69B91" />
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="brand-name">{brand.name}</span>
                    </td>

                    <td>
                      <p className="brand-desc" title={brand.description}>
                        {brand.description || "No description"}
                      </p>
                    </td>

                    <td>
                      <span
                        className={`brand-status ${
                          brand.isActive ? "active" : "inactive"
                        }`}
                      >
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="brand-actions">
                        <Link
                          to={`/admin/brands/edit/${brand._id}`}
                          title="Edit brand"
                          className="brand-action-btn brand-edit"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          onClick={() => handleDelete(brand._id)}
                          title="Delete brand"
                          className="brand-action-btn brand-delete"
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

      {!loading && !error && filteredBrands.length > 0 && (
        <p className="brand-footer">
          Showing {filteredBrands.length} of {brands.length} brands
        </p>
      )}
    </div>
  );
};

export default Brands;
