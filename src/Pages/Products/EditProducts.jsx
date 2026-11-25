import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    size: "",
    description: "",
    gender: "Unisex",
    isFeatured: false,
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  const [variants, setVariants] = useState([]);
  const [variantImageFiles, setVariantImageFiles] = useState({});

  // =====================================
  // FETCH REAL CATEGORIES
  // =====================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await api.get("/categories");

        const categoryList =
          response.data.categories || response.data.data || [];

        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        console.error("Category fetching error:", err);
        setError(err.response?.data?.message || "Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================
  // FETCH PRODUCT
  // =====================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);
        const product = response.data.product || response.data;

        const existingCategory =
          typeof product.category === "object"
            ? product.category?.name || ""
            : product.category || "";

        setFormData({
          name: product.name || "",
          price: product.price ?? "",
          category: existingCategory,
          brand: product.brand || "",
          stock: product.stock ?? "",
          size: Array.isArray(product.size) ? product.size.join(", ") : "",
          description: product.description || "",
          gender: product.gender || "Unisex",
          isFeatured: product.isFeatured === true,
        });

        setMainImagePreview(product.image || "");

        const existingVariants = (product.variants || []).map(
          (variant, index) => ({
            localId: `existing-${index}-${Date.now()}`,
            sku: variant.sku || "",
            stock: variant.stock ?? 0,
            options: (variant.options || []).map((option) => ({
              name: option.name || "",
              value: option.value || "",
            })),
            images: variant.images || [],
          }),
        );

        setVariants(existingVariants);
      } catch (err) {
        console.error("Error fetching product:", err);

        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =====================================
  // PRODUCT INPUT CHANGES
  // =====================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================
  // MAIN IMAGE
  // =====================================
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Main image must be smaller than 5MB.");
      return;
    }

    setError("");
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  // =====================================
  // ADD VARIANT
  // =====================================
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        localId: `new-${Date.now()}-${Math.random()}`,
        sku: "",
        stock: 0,
        options: [{ name: "", value: "" }],
        images: [],
      },
    ]);
  };

  // =====================================
  // REMOVE VARIANT
  // =====================================
  const removeVariant = (variantId) => {
    setVariants((prev) =>
      prev.filter((variant) => variant.localId !== variantId),
    );

    setVariantImageFiles((prev) => {
      const updated = { ...prev };
      delete updated[variantId];
      return updated;
    });
  };

  // =====================================
  // UPDATE VARIANT
  // =====================================
  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.localId === variantId
          ? { ...variant, [field]: value }
          : variant,
      ),
    );
  };

  // =====================================
  // ADD OPTION
  // =====================================
  const addOption = (variantId) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.localId === variantId
          ? {
              ...variant,
              options: [...variant.options, { name: "", value: "" }],
            }
          : variant,
      ),
    );
  };

  // =====================================
  // UPDATE OPTION
  // =====================================
  const handleOptionChange = (variantId, optionIndex, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.localId === variantId
          ? {
              ...variant,
              options: variant.options.map((option, index) =>
                index === optionIndex ? { ...option, [field]: value } : option,
              ),
            }
          : variant,
      ),
    );
  };

  // =====================================
  // REMOVE OPTION
  // =====================================
  const removeOption = (variantId, optionIndex) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.localId === variantId
          ? {
              ...variant,
              options: variant.options.filter(
                (_, index) => index !== optionIndex,
              ),
            }
          : variant,
      ),
    );
  };

  // =====================================
  // SELECT VARIANT IMAGES
  // =====================================
  const handleVariantImageChange = (variantId, files) => {
    const selectedFiles = Array.from(files || []);

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setError("Each variant image must be an image smaller than 5MB.");
      return;
    }

    setError("");

    setVariantImageFiles((prev) => ({
      ...prev,
      [variantId]: selectedFiles,
    }));
  };

  // =====================================
  // SUBMIT UPDATED PRODUCT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.brand.trim()) {
      setError("Please enter a brand.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Please enter valid product stock.");
      return;
    }

    // Validate unique SKUs
    const skus = variants.map((variant) => variant.sku.trim().toLowerCase());

    if (skus.some((sku) => !sku)) {
      setError("Please enter an SKU for every variant.");
      return;
    }

    if (new Set(skus).size !== skus.length) {
      setError("Each variant must have a unique SKU.");
      return;
    }

    // Validate variant stock and options
    for (const variant of variants) {
      if (
        variant.stock === "" ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0
      ) {
        setError(`Enter valid stock for ${variant.sku}.`);
        return;
      }

      for (const option of variant.options) {
        if (!option.name.trim() || !option.value.trim()) {
          setError(
            `Complete or remove empty options in variant ${variant.sku}.`,
          );
          return;
        }
      }
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();

      // Product information
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand.trim());
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);

      // Gender and featured status
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("isFeatured", String(formData.isFeatured));

      // Sizes
      const sizes = formData.size
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      formDataToSend.append("size", JSON.stringify(sizes));

      // Variants
      const variantsToSend = variants.map((variant) => ({
        sku: variant.sku.trim(),
        stock: Number(variant.stock),
        options: variant.options.map((option) => ({
          name: option.name.trim(),
          value: option.value.trim(),
        })),
      }));

      formDataToSend.append("variants", JSON.stringify(variantsToSend));

      // Main image only if replaced
      if (mainImage) {
        formDataToSend.append("image", mainImage);
      }

      // Variant images
      variants.forEach((variant, index) => {
        const files = variantImageFiles[variant.localId] || [];

        files.forEach((file) => {
          formDataToSend.append(`variantImages_${index}`, file);
        });
      });

      await api.put(`/products/${id}`, formDataToSend);

      alert("Product updated successfully!");

      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  // Keep the currently saved category visible even if it
  // has since been removed from the category collection.
  const categoryExists = categories.some(
    (category) => category.name === formData.category,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

            <p className="mt-1 text-sm text-gray-500">
              Update product details, categories, variants and images.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Products
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================================= */}
          {/* PRODUCT INFORMATION */}
          {/* ================================= */}

          <section className="rounded-xl bg-white p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Product Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* REAL CATEGORIES */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

                  {!categoryExists && formData.category && (
                    <option value={formData.category}>
                      {formData.category} (Current category)
                    </option>
                  )}

                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {!categoriesLoading && categories.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    No categories found. Please check your categories API.
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Total Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Total Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sizes (comma separated)
                </label>

                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                >
                  <option value="His">His</option>
                  <option value="Her">Her</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center pt-7">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-5 w-5 cursor-pointer accent-black"
                />

                <label
                  htmlFor="isFeatured"
                  className="ml-3 cursor-pointer text-sm font-medium text-gray-700"
                >
                  Display as Featured Product
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Main Image */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Main Product Image
              </label>

              {mainImagePreview && (
                <img
                  src={mainImagePreview}
                  alt="Product preview"
                  className="mb-3 h-36 w-36 rounded-lg border object-cover"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="block w-full text-sm text-gray-600"
              />

              <p className="mt-2 text-xs text-gray-500">
                Leave empty to keep the existing product image.
              </p>
            </div>
          </section>

          {/* ================================= */}
          {/* PRODUCT VARIANTS */}
          {/* ================================= */}

          <section className="rounded-xl bg-white p-5 shadow-sm md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add different versions, options, stock and images.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                + Add Variant
              </button>
            </div>

            {variants.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-500">No variants added yet.</p>

                <button
                  type="button"
                  onClick={addVariant}
                  className="mt-3 text-sm font-semibold text-black underline"
                >
                  Add your first variant
                </button>
              </div>
            )}

            <div className="space-y-5">
              {variants.map((variant, index) => (
                <div
                  key={variant.localId}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Variant {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeVariant(variant.localId)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  {/* SKU AND STOCK */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        SKU
                      </label>

                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.localId,
                            "sku",
                            e.target.value,
                          )
                        }
                        placeholder="Example: CHR-WATCH-001"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Variant Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.localId,
                            "stock",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* VARIANT OPTIONS */}
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Variant Options
                      </h4>

                      <button
                        type="button"
                        onClick={() => addOption(variant.localId)}
                        className="text-sm font-semibold text-blue-700 hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>

                    {variant.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) =>
                            handleOptionChange(
                              variant.localId,
                              optionIndex,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Option name (e.g. Color)"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-black"
                        />

                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) =>
                            handleOptionChange(
                              variant.localId,
                              optionIndex,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="Option value (e.g. Black)"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-black"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeOption(variant.localId, optionIndex)
                          }
                          className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* EXISTING VARIANT IMAGES */}
                  {variant.images?.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-3 text-sm font-semibold text-gray-800">
                        Existing Variant Images
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {variant.images.map((image, imageIndex) => (
                          <img
                            key={imageIndex}
                            src={image.url}
                            alt={`Variant ${index + 1}`}
                            className="h-24 w-24 rounded-lg border border-gray-200 bg-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UPLOAD VARIANT IMAGES */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Add / Replace Variant Images
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleVariantImageChange(
                          variant.localId,
                          e.target.files,
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Selecting new images replaces existing images for this
                      variant when you save.
                    </p>

                    {/* NEW IMAGE PREVIEWS */}
                    {variantImageFiles[variant.localId]?.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Selected Images
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {variantImageFiles[variant.localId].map(
                            (file, fileIndex) => (
                              <div
                                key={`${variant.localId}-${fileIndex}`}
                                className="relative"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Selected variant ${index + 1}`}
                                  className="h-24 w-24 rounded-lg border object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || categoriesLoading}
              className="rounded-lg bg-black px-7 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProducts;
