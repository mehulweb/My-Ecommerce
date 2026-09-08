import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

const initialProduct = {
  id: 1,
  name: "Wireless Noise-Cancelling Headphones",
  category: "Electronics",
  price: 129.99,
  stock: 45,
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  status: "active",
  sku: "ELC-WNC-001",
  rating: 4.7,
  reviews: 128,
};

const categoryColors = {
  Electronics: "bg-sky-100 text-sky-700",
  Accessories: "bg-violet-100 text-violet-700",
  Kitchen: "bg-amber-100 text-amber-700",
  Clothing: "bg-rose-100 text-rose-700",
  Office: "bg-teal-100 text-teal-700",
};

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function EditModal({ products, onSave, onClose }) {
  const [form, setForm] = useState({ ...products });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-3.5">
          {[
            { label: "Product Name", name: "name", type: "text" },
            { label: "Price ($)", name: "price", type: "number" },
            { label: "Stock", name: "stock", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              {Object.keys(categoryColors).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm active:scale-[0.98]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ products, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-7 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">Remove this products?</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          This will permanently delete <span className="font-semibold text-gray-600">"{products.name}"</span> from your store.
        </p>
        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition shadow-sm active:scale-[0.98]">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerCard() {
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [toast, setToast] = useState(null);
  const param = useParams();

  console.log("products", products);

  useEffect(() => {
     api.get(`seller/products/${param.id}`)
     .then((res) => {
      console.log("Fetched products data:", res.data.products);
      setProducts(res.data.products);
    });
  }, [param.id]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleSave = (updated) => {
    setProducts({ ...updated, status: updated.stock === 0 ? "out_of_stock" : "active" });
    setShowEdit(false);
    showToast("Product updated!");
  };

  const handleDelete = () => {
    setDeleted(true);
    setShowDelete(false);
    showToast("Product deleted.", "danger");
  };

  const statusMap = {
    active: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-600" },
    out_of_stock: { label: "Out of stock", dot: "bg-red-400", text: "text-red-500" },
    draft: { label: "Draft", dot: "bg-gray-300", text: "text-gray-400" },
  };
  const s = statusMap[products.status] || statusMap.active;

  if (deleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <p className="text-gray-500 font-medium">Product has been deleted.</p>
          <button
            onClick={() => { setProducts(initialProduct); setDeleted(false); }}
            className="mt-4 text-sm text-indigo-500 hover:underline"
          >
            Restore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-screen bg-slate-100 flex items-center justify-evenly p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}

      {/* THE CARD */}
      {products.map((product) => (
        
      <div key={product.id} className="w-80 h-max bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">

        {/* Image area */}
        <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/80 ${categoryColors[product.category]}`}>
              {product.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-md">
              SKU: {product.sku}
            </span>
          </div>

          {/* Status pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className={`text-[11px] font-semibold ${s.text}`}>{s.label}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Name + rating */}
          <div className="mb-3">
            <h2 className="text-[17px] font-bold text-gray-900 leading-snug mb-1.5">{product.name}</h2>
            <div className="flex items-center gap-2">
              <Stars rating={product.rating} />
              <span className="text-xs text-gray-400">{product.rating} · {product.reviews} reviews</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-100 my-4" />

          {/* Price + Stock row */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">Stock</p>
              <p className={`text-lg font-bold ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : "text-gray-800"}`}>
                {product.stock} <span className="text-sm font-medium text-gray-400">units</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowEdit(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] transition text-white text-sm font-semibold shadow-md shadow-indigo-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-[0.97] transition text-red-500 text-sm font-semibold border border-red-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>))}

      {/* Modals */}
      {showEdit && <EditModal products={products} onSave={handleSave} onClose={() => setShowEdit(false)} />}
      {showDelete && <DeleteModal products={products} onConfirm={handleDelete} onClose={() => setShowDelete(false)} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white z-50 transition-all ${toast.type === "danger" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "danger" ? "🗑️" : "✓"} {toast.msg}
        </div>
      )}
    </div>
  );
}