
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const FILTERS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "New Orders" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

const normalizeStatus = (value) => {
  const status = String(value || "pending").toLowerCase().trim();

  if (status === "new") return "pending";
  if (status === "canceled") return "cancelled";

  return status;
};

// Prefer seller-specific status when available.
const getOrderStatus = (order) =>
  normalizeStatus(order.sellerConfirmation || order.status);

const getStatusStyle = (status) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
    shipped: "bg-violet-50 text-violet-700 ring-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-orange-50 text-orange-700 ring-orange-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  return styles[status] || "bg-gray-100 text-gray-600 ring-gray-200";
};

const formatPrice = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function SellerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/seller/new-orders");
      const result = res.data?.data ?? res.data?.orders ?? [];

      if (!Array.isArray(result)) {
        throw new Error("Invalid orders response");
      }

      setOrders(result);
    } catch (error) {
      console.error("Seller orders error:", error.response?.data || error);
      toast.error("Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, nextStatus) => {
    if (!orderId || updatingId) return;

    try {
      setUpdatingId(orderId);

      await api.put(`/seller/order/${orderId}/status`, {
        status: nextStatus,
      });

      // Keep both frontend fields synchronized.
      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: nextStatus,
                sellerConfirmation: nextStatus,
              }
            : order
        )
      );

      toast.success(`Order ${nextStatus} successfully`);
    } catch (error) {
      console.error("Status update error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Unable to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!orderId || updatingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);

      await api.put(`/seller/order/${orderId}/cancel`);

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "cancelled",
                sellerConfirmation: "cancelled",
              }
            : order
        )
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => getOrderStatus(order) === activeFilter);

  const countStatus = (status) =>
    orders.filter((order) => getOrderStatus(order) === status).length;

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: "▤",
      color: "bg-gray-100 text-gray-700",
    },
    {
      title: "New Orders",
      value: countStatus("pending"),
      icon: "◷",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Confirmed",
      value: countStatus("confirmed"),
      icon: "✓",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Shipped",
      value: countStatus("shipped"),
      icon: "↗",
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Delivered",
      value: countStatus("delivered"),
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Rejected",
      value: countStatus("rejected") + countStatus("cancelled"),
      icon: "×",
      color: "bg-red-50 text-red-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-11 w-11 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Seller Dashboard
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">
              Order Management
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Track, process and manage your customer orders.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              ↻ Refresh
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
            >
              ← Back
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {stat.title}
                </p>
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${stat.color}`}
                >
                  {stat.icon}
                </span>
              </div>

              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3 px-1">
            <h2 className="text-sm font-bold text-slate-800">
              Filter Orders
            </h2>

            <span className="text-xs text-slate-400">
              {filteredOrders.length} result(s)
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeFilter === filter.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter.label}
                {filter.id !== "all" && (
                  <span className="ml-2 opacity-70">
                    {filter.id === "pending"
                      ? countStatus("pending")
                      : filter.id === "rejected"
                        ? countStatus("rejected")
                        : filter.id === "cancelled"
                          ? countStatus("cancelled")
                          : countStatus(filter.id)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <section className="bg-white border border-slate-200 rounded-3xl px-5 py-16 sm:py-24 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
              📦
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              No orders found
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Orders matching this filter will appear here.
            </p>

            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold"
              >
                View all orders
              </button>
            )}
          </section>
        )}

        {/* Orders */}
        <section className="space-y-5">
          {filteredOrders.map((order) => {            
            const status = getOrderStatus(order);
            const items = Array.isArray(order.items)
              ? order.items
              : Array.isArray(order.products)
                ? order.products
                : [];

            const total = Number(
              order.totalAmount ?? order.total ?? order.amount ?? 0
            );

            const customer =
              order.shippingAddress || order.addressDetails || {};

            const customerName =
              order.name ||
              customer.name ||
              order.user?.name ||
              "Customer";

            const phone =
              order.phone || customer.phone || "Not available";

            const address =
              typeof order.address === "string"
                ? order.address
                : customer.address ||
                  customer.fullAddress ||
                  "Address not available";

            const payment =
              order.paymentMethod || order.paymentType || "COD";

            const isUpdating = updatingId === order._id;

            return (
              <article
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order heading */}
                <div className="p-5 sm:px-7 sm:py-5 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        Order name
                      </p>

                      <p className="font-bold text-slate-900 mt-1 break-all">
                        {order._id || "Unavailable"}                   
                      </p>

                      <p className="text-xs text-slate-500 mt-2">
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ring-1 ring-inset ${getStatusStyle(status)}`}
                      >
                        {status}
                      </span>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Order total</p>
                        <p className="text-xl font-bold text-slate-900">
                          ₹{formatPrice(total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products and customer */}
                <div className="p-5 sm:p-7">
                  <div className="grid lg:grid-cols-[1.5fr_0.8fr] gap-7">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">
                          Ordered Products
                        </h3>

                        <span className="text-xs text-slate-500">
                          {items.length} item(s)
                        </span>
                      </div>

                      {items.length === 0 ? (
                        <p className="text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
                          Product details unavailable.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item, index) => {
                            const product =
                              typeof item.product === "object" &&
                              item.product !== null
                                ? item.product
                                : item;

                            const image =
                              product.image ||
                              product.images?.[0] ||
                              item.image;

                            const name =
                              product.name || item.name || "Product";

                            const quantity = Number(
                              item.quantity ?? item.qty ?? 1
                            );

                            const price = Number(
                              item.price ?? product.price ?? 0
                            );

                            return (
                              <div
                                key={item._id || product._id || index}
                                className="flex gap-4 items-center"
                              >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-2xl">
                                      📦
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-2">
                                    {name}
                                  </h4>

                                  <p className="text-xs text-slate-500 mt-2">
                                    Qty: {quantity} × ₹{formatPrice(price)}
                                  </p>
                                </div>

                                <p className="font-bold text-sm text-slate-900 whitespace-nowrap">
                                  ₹{formatPrice(price * quantity)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Customer card */}
                    <aside className="bg-slate-50 border border-slate-100 rounded-2xl p-5 h-fit">
                      <h3 className="font-bold text-slate-900 mb-5">
                        Customer Details
                      </h3>

                      <div className="space-y-4">
                        <Detail
                          label="Customer"
                          value={customerName}
                        />
                        <Detail label="Phone" value={phone} />
                        <Detail label="Delivery Address" value={address} />
                        <Detail
                          label="Payment Method"
                          value={payment}
                        />
                      </div>
                    </aside>
                  </div>
                </div>

                {/* Actions */}
                <footer className="bg-slate-50/80 border-t border-slate-100 px-5 py-4 sm:px-7">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      {isUpdating
                        ? "Updating order status..."
                        : "Update this order as it moves through fulfilment."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {status === "pending" && (
                        <>
                          <ActionButton
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(order._id, "confirmed")
                            }
                          >
                            ✓ Confirm Order
                          </ActionButton>

                          <ActionButton
                            variant="danger"
                            disabled={isUpdating}
                            onClick={() => cancelOrder(order._id)}
                          >
                            × Cancel
                          </ActionButton>
                        </>
                      )}

                      {status === "confirmed" && (
                        <>
                          <ActionButton
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatus(order._id, "shipped")
                            }
                          >
                            ↗ Mark as Shipped
                          </ActionButton>

                          <ActionButton
                            variant="danger"
                            disabled={isUpdating}
                            onClick={() => cancelOrder(order._id)}
                          >
                            × Cancel
                          </ActionButton>
                        </>
                      )}

                      {status === "shipped" && (
                        <ActionButton
                          variant="success"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(order._id, "delivered")
                          }
                        >
                          ✓ Mark as Delivered
                        </ActionButton>
                      )}

                      {status === "delivered" && (
                        <span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold">
                          ✓ Delivered
                        </span>
                      )}

                      {status === "rejected" && (
                        <span className="px-4 py-2.5 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold">
                          Order Rejected
                        </span>
                      )}

                      {status === "cancelled" && (
                        <span className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-semibold">
                          Order Cancelled
                        </span>
                      )}

                      <ActionButton
                        variant="outline"
                        onClick={() =>
                          navigate(`/seller/order/${order._id}`)
                        }
                      >
                        View Details →
                      </ActionButton>
                    </div>
                  </div>
                </footer>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-1 break-words">
        {value || "Not available"}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-700",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}