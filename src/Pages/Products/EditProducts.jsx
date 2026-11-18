import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    size: "",
    description: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  // Each variant gets a stable local ID so its selected files
  // remain associated with it even when variants are removed.
  const [variants, setVariants] = useState([]);
  const [variantImageFiles, setVariantImageFiles] = useState({});

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);
        const product = response.data.product || response.data;

        setFormData({
          name: product.name || "",
          price: product.price ?? "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock ?? "",
          size: Array.isArray(product.size) ? product.size.join(", ") : "",
          description: product.description || "",
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

    fetchProduct();
  }, [id]);

  // Product input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Main product image
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  // Add new variant
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

  // Remove variant
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

  // Update variant fields
  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.localId === variantId
          ? { ...variant, [field]: value }
          : variant,
      ),
    );
  };

  // Add option to variant
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

  // Update option
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

  // Remove option
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

  // Select variant images
  const handleVariantImageChange = (variantId, files) => {
    const selectedFiles = Array.from(files || []);

    setVariantImageFiles((prev) => ({
      ...prev,
      [variantId]: selectedFiles,
    }));
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate variants
    const skus = variants.map((variant) => variant.sku.trim().toLowerCase());

    if (skus.some((sku) => !sku)) {
      setError("Please enter an SKU for every variant.");
      return;
    }

    if (new Set(skus).size !== skus.length) {
      setError("Each variant must have a unique SKU.");
      return;
    }

    for (const variant of variants) {
      if (
        variant.stock === "" ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0
      ) {
        setError(`Enter a valid stock quantity for ${variant.sku}.`);
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

      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);

      const sizes = formData.size
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      formDataToSend.append("size", JSON.stringify(sizes));

      // Send variant data without local IDs or image URLs.
      const variantsToSend = variants.map((variant) => ({
        sku: variant.sku.trim(),
        stock: Number(variant.stock),
        options: variant.options.map((option) => ({
          name: option.name.trim(),
          value: option.value.trim(),
        })),
      }));

      formDataToSend.append("variants", JSON.stringify(variantsToSend));

      // Main image, if changed
      if (mainImage) {
        formDataToSend.append("image", mainImage);
      }

      // Variant images must use their CURRENT array index.
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

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product details, variants and images.
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
          {/* Product Details */}
          <section className="rounded-xl bg-white p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Product Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                >
                  <option value="">Select Category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fine Art">Fine Art</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

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
            </div>

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
            </div>
          </section>

          {/* Variants */}
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

                  {/* SKU and Stock */}
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

                  {/* Options */}
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

                  {/* Existing Images */}
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

                  {/* Upload Variant Images */}
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
                      Select one or more images. Selecting new images replaces
                      the existing images for this variant when you save.
                    </p>

                    {/* New Image Previews */}
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

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Buttons */}
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
              disabled={saving}
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
