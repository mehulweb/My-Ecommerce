import React, { useState, useRef } from "react";
import api from "../services/api.js";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const categories = [
  "Electronics", "Fashion", "Home & Living", "Beauty & Personal Care",
  "Sports & Outdoors", "Books & Stationery", "Toys & Games",
  "Automotive", "Food & Grocery", "Health & Wellness"
];

export default function ProductAddPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    originalPrice: "",
    discount: "",
    stock: "",
    description: ""
  });
  const param = useParams();
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFiles = (files) => {
    if (!files) return;
    const imagesFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    setImages((prevImages) => [...prevImages, ...imagesFiles].slice(0, 5));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.originalPrice || isNaN(form.originalPrice) || Number(form.originalPrice) <= 0) {
      e.originalPrice = "Enter a valid price";
    }
    if (!form.description.trim()) e.description = "Description is required";
    if (images.length === 0) e.images = "Upload at least one image";
    return e;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const discountVal = Number(form.discount) || 0;
    const finalPrice = (Number(form.originalPrice) * (1 - discountVal / 100)).toFixed(2);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("originalPrice", form.originalPrice);
    formData.append("discount", form.discount || "0");
    formData.append("stock", form.stock || "0");
    formData.append("description", form.description);
    formData.append("price", finalPrice);

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await api.post(`/add-product/${param.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Product added successfully");
        setSubmitted(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", category: "", originalPrice: "", discount: "", stock: "", description: "" });
    setImages([]);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white font-sans">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#a3ff6b] to-[#3de8c8] flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(163,255,107,0.4)]">
            <svg className="w-12 h-12 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3">Product Listed!</h2>
          <p className="text-[#888] text-lg mb-8">Your product is now live on the marketplace.</p>
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#a3ff6b] to-[#3de8c8] text-[#0a0a0f] font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl bg-[#0a0a0f]/85">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a3ff6b] to-[#3de8c8] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#0a0a0f]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">Seller Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-[#a3ff6b]/10 text-[#a3ff6b] border border-[#a3ff6b]/20">
            Pro Seller
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a3ff6b] to-[#3de8c8]" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#a3ff6b]/30 max-w-[60px]" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-[#a3ff6b]/10 text-[#a3ff6b] border border-[#a3ff6b]/15">
              New Listing
            </span>
          </div>
          <h1 className="font-extrabold text-5xl text-white leading-tight mb-3">
            Add Your<br /><span className="text-white/30">Product</span>
          </h1>
          <p className="text-[#888] text-base max-w-md">
            Fill in the details below to list your product on the marketplace. Fields marked with * are required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Product Name */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                Product Name <span className="text-[#a3ff6b]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full p-3.5 rounded-xl bg-white/[0.04] border text-white text-[15px] outline-none transition-all ${
                  errors.name ? "border-[#ff6b6b]" : "border-white/[0.08] focus:border-[#a3ff6b]"
                }`}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
              />
              {errors.name && <p className="text-[#ff6b6b] text-xs mt-2">{errors.name}</p>}
            </div>

            {/* Category + Stock + Price + Discount */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                    Category <span className="text-[#a3ff6b]">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full p-3.5 rounded-xl bg-neutral-900 border text-white text-[15px] outline-none transition-all ${
                      errors.category ? "border-[#ff6b6b]" : "border-white/[0.08] focus:border-[#a3ff6b]"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-[#ff6b6b] text-xs mt-2">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                    Stock Quantity
                  </label>
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] outline-none focus:border-[#a3ff6b]"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                    Price (₹) <span className="text-[#a3ff6b]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] text-sm">₹</span>
                    <input
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      className={`w-full p-3.5 pl-8 rounded-xl bg-white/[0.04] border text-white text-[15px] outline-none transition-all ${
                        errors.originalPrice ? "border-[#ff6b6b]" : "border-white/[0.08] focus:border-[#a3ff6b]"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.originalPrice && <p className="text-[#ff6b6b] text-xs mt-2">{errors.originalPrice}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-3.5 pr-8 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] outline-none focus:border-[#a3ff6b]"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] text-sm">%</span>
                  </div>
                </div>
              </div>

              {form.originalPrice && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#888] text-xs">Final price:</span>
                  <span className="text-[#a3ff6b] font-semibold text-sm">
                    ₹{(Number(form.originalPrice) * (1 - Number(form.discount || 0) / 100)).toFixed(2)}
                  </span>
                  {Number(form.discount) > 0 && (
                    <span className="text-[#555] text-xs line-through">₹{Number(form.originalPrice).toFixed(2)}</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                Description <span className="text-[#a3ff6b]">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                className={`w-full p-3.5 rounded-xl bg-white/[0.04] border text-white text-[15px] outline-none resize-none transition-all ${
                  errors.description ? "border-[#ff6b6b]" : "border-white/[0.08] focus:border-[#a3ff6b]"
                }`}
                placeholder="Describe your product — features, materials, dimensions, what makes it special..."
              />
              <div className="flex items-center justify-between mt-2">
                {errors.description ? (
                  <p className="text-[#ff6b6b] text-xs">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className="text-[#666] text-xs">{form.description.length} chars</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Image Upload */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-3">
                Product Images <span className="text-[#a3ff6b]">*</span>
              </label>

              <div
                className={`p-6 text-center cursor-pointer mb-4 border-2 border-dashed rounded-2xl transition-all ${
                  dragOver ? "border-[#a3ff6b] bg-[#a3ff6b]/5" : "border-white/10 hover:border-white/20"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current && fileRef.current.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-[#888] text-sm mb-1">
                  Drop images here or <span className="text-[#a3ff6b]">browse</span>
                </p>
                <p className="text-[#555] text-xs">PNG, JPG, WEBP · Up to 5 images</p>
              </div>

              {errors.images && <p className="text-[#ff6b6b] text-xs mb-3">{errors.images}</p>}

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden aspect-square bg-white/[0.04]"
                    >
                      <img src={URL.createObjectURL(img)} alt={img.name} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute bottom-1 left-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#a3ff6b]/90 text-[#0a0a0f]">
                            Cover
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff6b6b]"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div
                      onClick={() => fileRef.current && fileRef.current.click()}
                      className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#a3ff6b]/40 transition-colors"
                    >
                      <svg className="w-5 h-5 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[#555] text-xs mt-1">Add</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview Card */}
            {(form.name || form.originalPrice || images.length > 0) && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-xs font-semibold text-[#888] uppercase tracking-widest mb-4">Live Preview</p>
                <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.05]">
                  <div className="aspect-video relative bg-black/50">
                    {images.length > 0 ? (
                      <img src={URL.createObjectURL(images[0])} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {form.discount && Number(form.discount) > 0 && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6b6b] text-white">
                        -{form.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold truncate mb-1">{form.name || "Product Name"}</p>
                    {form.category && <p className="text-[#888] text-xs mb-2">{form.category}</p>}
                    <div className="flex items-center gap-2">
                      {form.originalPrice && form.discount && Number(form.discount) > 0 ? (
                        <>
                          <span className="text-[#a3ff6b] font-semibold text-sm">
                            ₹{(Number(form.originalPrice) * (1 - Number(form.discount) / 100)).toFixed(2)}
                          </span>
                          <span className="text-[#555] text-xs line-through">₹{Number(form.originalPrice).toFixed(2)}</span>
                        </>
                      ) : form.originalPrice ? (
                        <span className="text-[#a3ff6b] font-semibold text-sm">₹{Number(form.originalPrice).toFixed(2)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-sm text-[#0a0a0f] tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-[#a3ff6b] to-[#3de8c8] shadow-[0_0_40px_rgba(163,255,107,0.25)]"
              >
                {loading ? "Publishing Product..." : "Publish Product →"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 rounded-2xl font-medium text-sm text-[#888] border border-white/[0.06] hover:border-white/[0.12] hover:text-white transition-all"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}