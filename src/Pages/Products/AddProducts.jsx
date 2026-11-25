import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, UploadCloud } from "lucide-react";
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
    gender: "Unisex",
    isFeatured: false,
    isPublished: true,
    isBestSeller: false,
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState("");

  // MULTIPLE MAIN PRODUCT IMAGES
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [variants, setVariants] = useState([emptyVariant()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

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

  // CREATE MAIN IMAGE PREVIEWS
  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // FORM INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STATUS CHECKBOXES
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // MAIN PRODUCT MULTIPLE IMAGE UPLOAD
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setError("Please select valid images under 5 MB each.");
      e.target.value = "";
      return;
    }

    setError("");

    setImages((prev) => {
      const combined = [...prev, ...selectedFiles];

      if (combined.length > 10) {
        setError("You can upload a maximum of 10 product images.");
        return prev;
      }

      return combined;
    });

    e.target.value = "";
  };

  // REMOVE MAIN PRODUCT IMAGE
  const removeMainImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
    const selectedFiles = Array.from(files || []);

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
          ? {
              ...variant,
              images: [...variant.images, ...selectedFiles],
            }
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
      images.length === 0
    ) {
      setError(
        "Please fill all required fields and upload at least one product image.",
      );
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
      data.append("gender", formData.gender);

      data.append("isFeatured", String(formData.isFeatured));
      data.append("isPublished", String(formData.isPublished));
      data.append("isBestSeller", String(formData.isBestSeller));

      data.append("salesCount", "0");

      const sizes = formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("size", JSON.stringify(sizes));

      // MAIN PRODUCT IMAGE
      // First image is also sent as the main/cover image.
      data.append("image", images[0]);

      // Send every main image in the images field.
      images.forEach((file) => {
        data.append("images", file);
      });

      // VARIANT INFORMATION
      const variantData = variants.map(({ sku, stock, options }) => ({
        sku: sku.trim(),
        stock: Number(stock),
        options: options.map((option) => ({
          name: option.name.trim(),
          value: option.value.trim(),
        })),
      }));

      data.append("variants", JSON.stringify(variantData));

      // VARIANT IMAGES
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
          {/* PRODUCT INFORMATION */}
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

            {/* GENDER */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Gender *
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#421713]"
                required
              >
                <option value="His">His</option>
                <option value="Her">Her</option>
                <option value="Unisex">Unisex</option>
              </select>
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
            <div className="md:col-span-2">
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

            {/* MULTIPLE MAIN PRODUCT IMAGES */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Product Images *
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-7 transition hover:border-[#421713] hover:bg-[#fcfaf9]">
                <UploadCloud size={30} className="mb-2 text-[#421713]" />

                <span className="font-medium text-[#421713]">
                  Click to upload product images
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  Select multiple images at once
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG, WEBP. Maximum 5 MB each. Maximum 10 images. The first
                image will be the main product image.
              </p>

              {/* MAIN IMAGE PREVIEWS */}
              {imagePreviews.length > 0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                      Selected Images ({images.length})
                    </p>

                    <p className="text-xs text-gray-400">
                      First image is the main image
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {imagePreviews.map((src, index) => (
                      <div
                        key={`${images[index].name}-${index}`}
                        className="relative"
                      >
                        <img
                          src={src}
                          alt={`Product image ${index + 1}`}
                          className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 rounded bg-[#421713] px-2 py-1 text-xs text-white">
                            Main Image
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeMainImage(index)}
                          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                          title="Remove image"
                        >
                          <X size={15} />
                        </button>

                        <p className="mt-2 truncate text-xs text-gray-500">
                          {images[index].name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT VARIANTS */}
          <div className="mt-10 border-t border-gray-200 pt-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#421713]">
                Product Variants
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg border border-[#421713] px-4 py-2 text-sm font-medium text-[#421713] transition hover:bg-[#421713] hover:text-white"
              >
                + Add Variant
              </button>
            </div>

            <div className="space-y-5">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-[#fcfaf9] p-5 md:p-6"
                >
                  {/* VARIANT HEADER */}
                  <div className="mb-7 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-800">
                      Variant #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                      title="Remove variant"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  {/* SKU AND STOCK */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(index, "sku", e.target.value)
                      }
                      placeholder="SKU"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#421713]"
                      required
                    />

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(index, "stock", e.target.value)
                      }
                      placeholder="Stock"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#421713]"
                      required
                    />
                  </div>

                  {/* OPTIONS */}
                  <div className="mt-6">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      Options (e.g. Size: M, Color: Red)
                    </label>

                    <div className="space-y-3">
                      {variant.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                              placeholder="Option Name"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#421713]"
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
                              placeholder="Option Value"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#421713]"
                              required
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeOption(index, optionIndex)}
                            className="mt-2 flex h-8 w-8 items-center justify-center text-red-600 transition hover:rounded-full hover:bg-red-50"
                            title="Remove option"
                          >
                            <X size={19} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="mt-4 text-sm font-medium text-blue-600 transition hover:text-blue-800"
                    >
                      + Add Option
                    </button>
                  </div>

                  {/* VARIANT IMAGES */}
                  <div className="mt-7">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      Variant Images
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-blue-300 bg-white px-5 py-4 text-sm font-medium text-blue-600 transition hover:border-blue-500 hover:bg-blue-50">
                      <UploadCloud size={21} />
                      Upload
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

                    <p className="mt-2 text-xs text-gray-400">
                      JPG, PNG or WEBP. Maximum 5 MB each.
                    </p>

                    {/* VARIANT IMAGE PREVIEWS */}
                    {variant.images.length > 0 && (
                      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {variant.images.map((file, imageIndex) => (
                          <div
                            key={`${file.name}-${imageIndex}`}
                            className="relative"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Variant ${index + 1} image ${imageIndex + 1}`}
                              className="h-28 w-full rounded-lg border border-gray-200 object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeVariantImage(index, imageIndex)
                              }
                              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow transition hover:bg-red-700"
                            >
                              <X size={15} />
                            </button>

                            <p className="mt-2 truncate text-xs text-gray-500">
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

          {/* PRODUCT STATUS */}
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-gray-200 pt-8">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleStatusChange}
                className="h-5 w-5 cursor-pointer accent-[#421713]"
              />
              <span className="font-semibold text-gray-800">Published</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleStatusChange}
                className="h-5 w-5 cursor-pointer accent-[#421713]"
              />
              <span className="font-semibold text-gray-800">Featured</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleStatusChange}
                className="h-5 w-5 cursor-pointer accent-[#421713]"
              />
              <span className="font-semibold text-gray-800">Best Seller</span>
            </label>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
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
              className="rounded-lg bg-[#421713] px-8 py-3 font-medium text-white transition hover:bg-[#5a241d] disabled:cursor-not-allowed disabled:opacity-50"
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
