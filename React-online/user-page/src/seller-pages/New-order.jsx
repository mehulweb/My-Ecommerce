import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function SellerOrders() {
  const navigate = useNavigate();
  const params = useParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  

  // --------------------------------------------------
  // FETCH SELLER ORDERS
  // --------------------------------------------------
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // 🔗 BACKEND API
      // Apni seller orders wali route yaha lagana
      const res = await api.get(`/seller/new-orders/${params.id}`);

      setOrders(res.data.data || res.data.orders || []);
    } catch (error) {
      console.error("Seller orders error:", error);
      toast.error("Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------
  const updateStatus = async (orderId, status) => {
    try {
      // 🔗 BACKEND API
      // Apni update-status route yaha lagana

      await api.put(`/seller/order/${orderId}/status`, {
        status,
      });

    

      // Frontend state update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      toast.success(`Order ${status}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Unable to update order");
    }
  };

  // --------------------------------------------------
  // CANCEL ORDER
  // --------------------------------------------------
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      // 🔗 BACKEND API
      await api.put(`/seller/order/${orderId}/cancel`);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "cancelled",
              }
            : order
        )
      );

      toast.success("Order cancelled");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Unable to cancel order");
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.status?.toLowerCase() === activeFilter
        );

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-100";

      case "cancelled":
      case "canceled":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ============================================
            HEADER
        ============================================ */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm text-gray-400 mb-1">
              Seller Dashboard
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Orders
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Manage your customer orders
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-400 transition"
          >
            ← Back
          </button>
        </div>

        {/* ============================================
            ORDER STATS
        ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">

          <StatCard
            title="All Orders"
            value={orders.length}
          />

          <StatCard
            title="New"
            value={
              orders.filter(
                (o) => o.sellerConfirmation?.toLowerCase() === "pending"
              ).length
            }
          />

          <StatCard
            title="Confirmed"
            value={
              orders.filter(
                (o) => o.sellerConfirmation?.toLowerCase() === "confirmed"
              ).length
            }
          />

          <StatCard
            title="Shipped"
            value={
              orders.filter(
                (o) => o.sellerConfirmation?.toLowerCase() === "shipped"
              ).length
            }
          />

          <StatCard
            title="Delivered"
            value={
              orders.filter(
                (o) => o.sellerConfirmation?.toLowerCase() === "delivered"
              ).length
            }
          />

        </div>

        {/* ============================================
            FILTERS
        ============================================ */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-6 overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {[
              ["all", "All"],
              ["pending", "New Orders"],
              ["confirmed", "Confirmed"],
              ["shipped", "Shipped"],
              ["delivered", "Delivered"],
              ["cancelled", "Cancelled"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeFilter === value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}

          </div>
        </div>

        {/* ============================================
            EMPTY
        ============================================ */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No orders found
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              There are no orders in this category.
            </p>

          </div>
        )}

        {/* ============================================
            ORDERS
        ============================================ */}
        <div className="space-y-5">

          {filteredOrders.map((order) => {

            const items =
              order.items ||
              order.products ||
              [];
              

            const orderTotal = Number(
              order.totalAmount ||
              order.total ||
              order.amount ||
              0
            );

            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Date unavailable";

            const status =
              order.sellerConfirmation?.toLowerCase() || "pending";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >

                {/* ====================================
                    ORDER HEADER
                ==================================== */}
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order ID
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1 break-all">
                        
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Ordered on {orderDate}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        ₹{orderTotal.toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>
                </div>

                {/* ====================================
                    CUSTOMER + PRODUCTS
                ==================================== */}
                <div className="p-5 sm:p-6">

                  <div className="grid lg:grid-cols-3 gap-6">

                    {/* PRODUCTS */}
                    <div className="lg:col-span-2">

                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Products
                      </h3>

                      <div className="space-y-4">

                        {items.map((item, index) => {

                          const product =
                            item.product || item;

                          const image =
                            product.image ||
                            product.images?.[0] ||
                            item.image;

                          const name =
                            product.name ||
                            item.name ||
                            "Product";

                          const quantity =
                            Number(
                              item.quantity ||
                              item.qty ||
                              1
                            );

                          const price =
                            Number(
                              item.price ||
                              product.price ||
                              0
                            );

                          return (
                            <div
                              key={
                                item._id ||
                                product._id ||
                                index
                              }
                              className="flex gap-4 items-center"
                            >

                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">

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

                              <div className="flex-1 min-w-0">

                                <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                                  {name}
                                </h4>

                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  Quantity: {quantity}
                                </p>

                              </div>

                              <p className="font-semibold text-sm text-gray-900">
                                ₹
                                {(
                                  price * quantity
                                ).toLocaleString("en-IN")}
                              </p>

                            </div>
                          );
                        })}

                      </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="bg-gray-50 rounded-xl p-4 h-fit">

                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Customer Details
                      </h3>

                      <div className="space-y-3 text-sm">

                        <div>
                          <p className="text-xs text-gray-400">
                            Name
                          </p>

                          <p className="font-medium text-gray-800 mt-1">
                            {order.name ||
                              order.shippingAddress?.name ||
                              order.user?.name ||
                              "Customer"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Phone
                          </p>

                          <p className="font-medium text-gray-800 mt-1">
                            {order.phone ||
                              order.shippingAddress?.phone ||
                              "Not available"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Address
                          </p>

                          <p className="text-gray-700 mt-1 leading-relaxed">
                            {order.address ||
                              order.shippingAddress?.address ||
                              "Address not available"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Payment
                          </p>

                          <p className="font-medium text-gray-800 mt-1 uppercase">
                            {order.paymentMethod ||
                              order.paymentType ||
                              "COD"}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>

                {/* ====================================
                    ACTIONS
                ==================================== */}
                <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <p className="text-xs text-gray-400">
                      Update the order status after processing.
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {/* PENDING */}
                      {status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(
                                order._id,
                                "confirmed"
                              )
                            }
                            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-700 transition"
                          >
                            ✓ Confirm Order
                          </button>

                          <button
                            onClick={() =>
                              cancelOrder(order._id)
                            }
                            className="px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-50 transition"
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}

                      {/* CONFIRMED */}
                      {status === "confirmed" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(
                                order._id,
                                "shipped"
                              )
                            }
                            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-700 transition"
                          >
                            📦 Mark as Shipped
                          </button>

                          <button
                            onClick={() =>
                              cancelOrder(order._id)
                            }
                            className="px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-50 transition"
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}

                      {/* SHIPPED */}
                      {status === "shipped" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "delivered"
                            )
                          }
                          className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-green-700 transition"
                        >
                          ✓ Mark as Delivered
                        </button>
                      )}

                      {/* DELIVERED */}
                      {status === "delivered" && (
                        <span className="px-4 py-2.5 bg-green-50 text-green-600 rounded-xl text-xs sm:text-sm font-medium">
                          ✓ Order Delivered
                        </span>
                      )}

                      {/* CANCELLED */}
                      {status === "cancelled" && (
                        <span className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs sm:text-sm font-medium">
                          ✕ Order Cancelled
                        </span>
                      )}

                      {/* DETAILS */}
                      <button
                        onClick={() =>
                          navigate(
                            `/seller/order/${order._id}`
                          )
                        }
                        className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:border-gray-400 transition"
                      >
                        View Details
                      </button>

                    </div>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}


// ================================================
// STAT CARD
// ================================================
function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-gray-400">
        {title}
      </p>

      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}