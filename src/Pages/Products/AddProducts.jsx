import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, Upload, X, Package } from "lucide-react";
import api from "../../Services/api";

const emptyVariant = () => ({
  sku: "",
  stock: "",
  options: [{ name: "", value: "" }],
  images: [],
});

const AddProducts = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    description: "",
    size: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [variants, setVariants] = useState([emptyVariant()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const res = await api.get("/categories");
        const data = res.data;
        const categoryList = Array.isArray(data) ? data : data.categories || [];

        setCategories(
          categoryList.filter((category) => category.isActive !== false),
        );
      } catch (err) {
        console.error("Fetch categories error:", err);
        setCategoriesError(
          err.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // FETCH BRANDS
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        setBrandsError("");

        const res = await api.get("/brands");
        const data = res.data;
        const brandList = Array.isArray(data) ? data : data.brands || [];

        setBrands(brandList.filter((brand) => brand.isActive !== false));
      } catch (err) {
        console.error("Fetch brands error:", err);
        setBrandsError(err.response?.data?.message || "Failed to load brands");
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // FORM INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // MAIN PRODUCT IMAGE
  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImage(selectedImage);
  };

  // MAIN IMAGE PREVIEW
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // ADD VARIANT
  const addVariant = () => {
    setVariants((prev) => [...prev, emptyVariant()]);
  };

  // REMOVE VARIANT
  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // UPDATE VARIANT
  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  // ADD OPTION
  const addOption = (variantIndex) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              options: [...variant.options, { name: "", value: "" }],
            }
          : variant,
      ),
    );
  };

  // REMOVE OPTION
  const removeOption = (variantIndex, optionIndex) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              options: variant.options.filter(
                (_, optionI) => optionI !== optionIndex,
              ),
            }
          : variant,
      ),
    );
  };

  // UPDATE OPTION
  const handleOptionChange = (variantIndex, optionIndex, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              options: variant.options.map((option, optionI) =>
                optionI === optionIndex
                  ? { ...option, [field]: value }
                  : option,
              ),
            }
          : variant,
      ),
    );
  };

  // VARIANT IMAGE UPLOAD
  const handleVariantImages = (index, files) => {
    const selectedFiles = Array.from(files);

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setError("Variant images must be valid images under 5 MB each.");
      return;
    }

    setError("");

    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? { ...variant, images: [...variant.images, ...selectedFiles] }
          : variant,
      ),
    );
  };

  // REMOVE VARIANT IMAGE
  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              images: variant.images.filter(
                (_, imageI) => imageI !== imageIndex,
              ),
            }
          : variant,
      ),
    );
  };

  // SUBMIT PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.productName.trim() ||
      !formData.price ||
      !formData.category ||
      !formData.brand ||
      !formData.description.trim() ||
      formData.stock === "" ||
      !image
    ) {
      setError("Please fill all required fields and select an image.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (variants.length === 0) {
      setError("Please add at least one variant.");
      return;
    }

    const usedSkus = variants.map((variant) =>
      variant.sku.trim().toLowerCase(),
    );

    if (usedSkus.some((sku) => !sku)) {
      setError("Please enter a SKU for every variant.");
      return;
    }

    if (new Set(usedSkus).size !== usedSkus.length) {
      setError("Every variant must have a unique SKU.");
      return;
    }

    for (const variant of variants) {
      if (
        variant.stock === "" ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0
      ) {
        setError("Please enter valid stock for every variant.");
        return;
      }

      if (
        variant.options.some(
          (option) => !option.name.trim() || !option.value.trim(),
        )
      ) {
        setError(
          "Please complete all variant options or remove empty options.",
        );
        return;
      }
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("productName", formData.productName.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("stock", formData.stock);
      data.append("description", formData.description.trim());

      const sizes = formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("size", JSON.stringify(sizes));
      data.append("image", image);

      // SEND VARIANT INFORMATION
      const variantData = variants.map(({ sku, stock, options }) => ({
        sku: sku.trim(),
        stock: Number(stock),
        options: options.map((option) => ({
          name: option.name.trim(),
          value: option.value.trim(),
        })),
      }));

      data.append("variants", JSON.stringify(variantData));

      // SEND EACH VARIANT'S IMAGES
      variants.forEach((variant, index) => {
        variant.images.forEach((file) => {
          data.append(`variantImages_${index}`, file);
        });
      });

      const response = await api.post("/products", data);

      if (response.data.success) {
        alert("Product added successfully!");
        navigate("/admin/products");
      } else {
        setError(response.data.message || "Product could not be added.");
      }
    } catch (err) {
      console.error("Product upload error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Failed to add product. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#421713]">Add New Product</h1>
          <p className="mt-2 text-gray-500">
            Add products to your CHRONOS collection.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-5 shadow-sm md:p-8"
        >
          <h2 className="mb-6 text-xl font-semibold text-[#421713]">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* PRODUCT NAME */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={categoriesLoading || categories.length === 0}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713] disabled:bg-gray-100"
                required
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No categories available"
                      : "Select Category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {categoriesError && (
                <p className="mt-2 text-sm text-red-600">{categoriesError}</p>
              )}

              {!categoriesLoading && categories.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Create a category before adding a product.{" "}
                  <Link
                    to="/admin/categories/add"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Add Category
                  </Link>
                </p>
              )}
            </div>

            {/* BRAND */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Brand *
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={brandsLoading || brands.length === 0}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713] disabled:bg-gray-100"
                required
              >
                <option value="">
                  {brandsLoading
                    ? "Loading brands..."
                    : brands.length === 0
                      ? "No brands available"
                      : "Select Brand"}
                </option>

                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>

              {brandsError && (
                <p className="mt-2 text-sm text-red-600">{brandsError}</p>
              )}

              {!brandsLoading && brands.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Create a brand before adding a product.{" "}
                  <Link
                    to="/admin/brands/add"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Add Brand
                  </Link>
                </p>
              )}
            </div>

            {/* STOCK */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Product Stock *
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Overall product stock. Variant stock is managed separately.
              </p>
            </div>

            {/* SIZES */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Available Sizes
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Example: S, M, L, XL"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate sizes using commas.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              />
            </div>

            {/* MAIN IMAGE */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Main Product Image *
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                required
              />

              <p className="mt-2 text-xs text-gray-400">
                Supported formats: JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {preview && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Image Preview
                  </p>
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-40 w-40 rounded-lg border object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-500">{image?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* VARIANTS SECTION */}
          <div className="mt-10 border-t border-gray-200 pt-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#421713]">
                  Product Variants
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add different product variations with separate stock and
                  images.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 rounded-lg bg-[#421713] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#5a241d]"
              >
                <Plus size={18} />
                Add Variant
              </button>
            </div>

            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-[#fcfaf8] p-5"
                >
                  {/* VARIANT HEADER */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="text-[#421713]" size={20} />
                      <h3 className="font-semibold text-[#421713]">
                        Variant {index + 1}
                      </h3>
                    </div>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* SKU AND STOCK */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        SKU *
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        placeholder="Example: CH-BLK-001"
                        className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-[#421713]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Variant Stock *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        placeholder="Enter variant stock"
                        className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-[#421713]"
                        required
                      />
                    </div>
                  </div>

                  {/* OPTIONS */}
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="font-semibold text-gray-700">
                        Variant Options
                      </label>

                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="flex items-center gap-1 text-sm font-medium text-[#421713] hover:underline"
                      >
                        <Plus size={16} />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {variant.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_1fr_auto]"
                        >
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Option name (Color)"
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-[#421713]"
                            required
                          />

                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder="Option value (Black)"
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-[#421713]"
                            required
                          />

                          {variant.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="flex h-11 w-11 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                              title="Remove option"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VARIANT IMAGES */}
                  <div className="mt-6">
                    <label className="mb-3 block font-semibold text-gray-700">
                      Variant Images
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 transition hover:border-[#421713]">
                      <Upload size={26} className="mb-2 text-[#421713]" />

                      <span className="font-medium text-gray-700">
                        Upload Variant Images
                      </span>

                      <span className="mt-1 text-xs text-gray-400">
                        You can select multiple images (maximum 5 MB each).
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleVariantImages(index, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {variant.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {variant.images.map((file, imageIndex) => (
                          <div
                            key={`${file.name}-${imageIndex}`}
                            className="relative"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Variant ${index + 1} image ${imageIndex + 1}`}
                              className="h-28 w-full rounded-lg border object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeVariantImage(index, imageIndex)
                              }
                              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                            >
                              <X size={15} />
                            </button>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={
                loading ||
                categoriesLoading ||
                categories.length === 0 ||
                brandsLoading ||
                brands.length === 0
              }
              className="rounded-lg bg-[#421713] px-8 py-3 text-white transition hover:bg-[#5a241d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save Product"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-400 px-8 py-3 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
