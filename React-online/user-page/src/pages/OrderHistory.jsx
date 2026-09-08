import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function OrderHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔗 BACKEND API — अपनी route यहाँ डालना
        const res = await api.get("/orders/me");

        setOrders(res.data.data || res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Unable to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log("Fetched Orders:", orders); // Debugging log

  // Status color
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-600";

      case "cancelled":
      case "canceled":
        return "bg-red-50 text-red-600";

      case "shipped":
        return "bg-blue-50 text-blue-600";

      case "confirmed":
        return "bg-indigo-50 text-indigo-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] ">
        <Navbar />
      <div className="max-w-6xl mt-8 mx-auto">

        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              View your past and current orders
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition"
          >
            ← Back
          </button>
        </div> */}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {!error && orders.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 max-w-md w-full">

              <div className="text-6xl mb-5">
                📦
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                You haven't placed any orders yet.
              </p>

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="space-y-5">

            {orders.map((order) => {

              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date unavailable";

              const items = order.items || order.products || [];

              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >

                  {/* Order Top */}
                  <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order ID
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "Pending"}
                      </span>

                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-5 sm:p-6">

                    <div className="space-y-4">

                      {items.slice(0, 3).map((item, index) => {

                        const product = item.product || item;

                        const image =
                          product.image ||
                          product.images?.[0] ||
                          item.image;

                        const name =
                          product.name ||
                          item.name ||
                          "Product";

                        const price =
                          Number(item.price || product.price || 0);

                        const quantity =
                          Number(item.quantity || item.qty || 1);

                        return (
                          <div
                            key={item._id || product._id || index}
                            className="flex gap-4 items-center"
                          >

                            {/* Image */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">

                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  📦
                                </div>
                              )}

                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">

                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {name}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Qty: {quantity}
                              </p>

                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                ₹{price.toLocaleString("en-IN")}
                              </p>

                            </div>

                          </div>
                        );
                      })}

                    </div>

                    {/* More Products */}
                    {items.length > 3 && (
                      <p className="text-xs text-gray-400 mt-4">
                        + {items.length - 3} more item
                        {items.length - 3 > 1 ? "s" : ""}
                      </p>
                    )}

                  </div>

                  {/* Bottom */}
                  <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex flex-col gap-1">

                      <p className="text-xs text-gray-400">
                        Ordered on
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {orderDate}
                      </p>

                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">

                      <div>
                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                        <p className="text-lg font-bold text-gray-900">
                          ₹
                          {Number(
                            order.totalAmount ||
                              order.total ||
                              order.amount ||
                              0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/order-Detail/${order._id}`)
                        }
                        className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}