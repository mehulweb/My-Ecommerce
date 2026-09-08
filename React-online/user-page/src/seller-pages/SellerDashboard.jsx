import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const statusStyle = {
  active: "bg-emerald-100 text-emerald-700",
  low: "bg-amber-100 text-amber-700",
  out: "bg-red-100 text-red-600",
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const param = useParams();

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState([]);
  const [profile, setProfile] = useState({});

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    products: [],
  });

  useEffect(() => {
  const socket = io("http://localhost:5500");

  socket.on("connect", () => {
    console.log("FRONTEND CONNECTED:", socket.id);

    socket.emit("seller-join", param.id);
  });

  socket.on("seller-notification", (data) => {
    console.log("🔥 NOTIFICATION RECEIVED:", data);
  });

  socket.on("connect_error", (error) => {
    console.log("❌ SOCKET ERROR:", error.message);
  });

  return () => {
    socket.disconnect();
  };
}, [param.id]);

  useEffect(() => {
    fetchProfile();
    fetchDashboard();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/seller/seller-profile/${param.id}`);

      console.log("Profile:", res.data);

      setProfile(res.data);
    } catch (error) {
      console.error("Profile API Error:", error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/seller/products/${param.id}`);

      console.log("Dashboard:", res.data);

      setDashboard(res.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  console.log("Dashboard State:", dashboard);

  const stats = [
    {
      label: "Total Products",
      value: dashboard.products.length,
      icon: "📦",
      change: `${dashboard.totalStock} units in stock`,
    },
    {
      label: "Orders Today",
      value: dashboard.newOrders,
      icon: "🛒",
      change: "Today's orders",
    },
    {
      label: "Revenue",
      value: `₹${dashboard.monthlyRevenue?.toLocaleString("en-IN")}`,
      icon: "💰",
      change: "This month",
    },
    {
      label: "Total Orders",
      value: dashboard.totalOrders,
      icon: "⭐",
      change: "Overall orders",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>

          <span className="text-stone-800 font-semibold text-lg tracking-tight">
            SellerHub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {notifications.length > 0 && (
                <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg p-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="py-2 border-b last:border-0">
                      <p className="text-sm text-stone-700">
                        {notification.message}
                      </p>

                      <p className="text-xs text-stone-400">
                        {notification.productName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>

            <span className="text-sm text-stone-600 font-medium hidden sm:block">
              {profile.name}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-stone-400 text-sm mb-1">Hello Seller 👋</p>

          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
            {profile.name}
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Seller Products */}
          <button
            onClick={() => navigate(`/my-products/${param.id}`)}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
              activeTab === "products"
                ? "border-orange-500 bg-orange-500 shadow-lg shadow-orange-200"
                : "border-stone-200 bg-white hover:border-orange-400 hover:shadow-md"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                activeTab === "products"
                  ? "bg-white/20"
                  : "bg-orange-50 group-hover:bg-orange-100"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  activeTab === "products" ? "text-white" : "text-orange-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            <h2
              className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                activeTab === "products" ? "text-white" : "text-stone-800"
              }`}
            >
              My Products
            </h2>

            <p
              className={`text-sm transition-colors duration-300 ${
                activeTab === "products" ? "text-orange-100" : "text-stone-400"
              }`}
            >
              View, edit and manage your listings
            </p>

            <div
              className={`absolute bottom-4 right-5 text-2xl font-black opacity-10 transition-opacity group-hover:opacity-20 ${
                activeTab === "products" ? "text-white" : "text-orange-400"
              }`}
            >
              {dashboard.products.length}
            </div>
          </button>

          {/* Add Product */}
          <button
            onClick={() => navigate(`/add-product/${param.id}`)}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
              activeTab === "add"
                ? "border-violet-500 bg-violet-600 shadow-lg shadow-violet-200"
                : "border-stone-200 bg-white hover:border-violet-400 hover:shadow-md"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                activeTab === "add"
                  ? "bg-white/20"
                  : "bg-violet-50 group-hover:bg-violet-100"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  activeTab === "add" ? "text-white" : "text-violet-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <h2
              className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                activeTab === "add" ? "text-white" : "text-stone-800"
              }`}
            >
              Add Product
            </h2>

            <p
              className={`text-sm transition-colors duration-300 ${
                activeTab === "add" ? "text-violet-200" : "text-stone-400"
              }`}
            >
              List a new item in your store
            </p>

            <div
              className={`absolute bottom-3 right-4 text-5xl font-black opacity-10 transition-opacity group-hover:opacity-20 ${
                activeTab === "add" ? "text-white" : "text-violet-400"
              }`}
            >
              +
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-stone-100 p-4 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-2">{s.icon}</div>

              <p className="text-xl font-bold text-stone-800">{s.value}</p>

              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>

              <p className="text-xs text-emerald-500 mt-1 font-medium">
                {s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-semibold text-stone-700 text-sm">Products</h3>

            <button
              onClick={() => navigate(`/my-products/${param.id}`)}
              className="text-xs text-orange-500 font-medium hover:text-orange-600 transition"
            >
              View all →
            </button>
          </div>

          <div className="divide-y divide-stone-50">
            {dashboard.products === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-stone-400">
                No products found
              </p>
            ) : (
              dashboard.products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {p.name}
                    </p>

                    <p className="text-xs text-stone-400 mt-0.5">
                      Stock: {p.stock} units
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-stone-700">
                      ₹{p.price?.toLocaleString("en-IN")}
                    </span>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        statusStyle[p.status]
                      }`}
                    >
                      {p.status === "active"
                        ? "Active"
                        : p.status === "low"
                          ? "Low stock"
                          : "Out of stock"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
