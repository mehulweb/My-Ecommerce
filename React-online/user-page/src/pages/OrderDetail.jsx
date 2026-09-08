import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET ORDER
  // =====================================================

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        /*
          TODO:
          अपने backend का GET order API यहाँ लगाना है।

          Example:
          /orders/${id}
        */

        const { data } = await api.get(`/orders/${id}`);

        if (!data?.success && !data?.order) {
          throw new Error(data?.message || "Unable to fetch order");
        }

        setOrder(data.order || data.data);
      } catch (err) {
        console.error("Get order error:", err);

        setError(
          err.response?.data?.message || err.message || "Unable to load order",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {
    if (!order?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      setCancelLoading(true);

      /*
        TODO:
        अपने backend का cancel order route यहाँ लगाना है।

        Example:
        DELETE /orders/${order._id}

        या

        PATCH /orders/${order._id}/cancel
      */

      const { data } = await api.put(`/orders/cancel/${order._id}`);

      if (!data?.success) {
        throw new Error(data?.message || "Unable to cancel order");
      }

      toast.success("Order cancelled successfully");

      setOrder((prev) => ({
        ...prev,
        status: "cancelled",
        orderStatus: "cancelled",
      }));
    } catch (err) {
      console.error("Cancel order error:", err);

      toast.error(
        err.response?.data?.message || err.message || "Unable to cancel order",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // =====================================================
  // COD PAY NOW
  // =====================================================

  const handlePayNow = async () => {
    if (!order?._id) return;

    try {
      setPayLoading(true);

      /*
        TODO:
        यहाँ अपना existing Razorpay payment flow connect करना है।

        Example:

        1. Backend से Razorpay order create करो

        POST:
        /payments/create

        body:
        {
          orderId: order._id
        }

        2. Razorpay checkout open करो

        3. Payment successful होने के बाद
           /payments/verify call करो.
      */

      const { data } = await api.post("/payments/create", {
        orderId: order._id,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Unable to create payment");
      }

      const payment = data.payment;

      // =================================================
      // LOAD RAZORPAY
      // =================================================

      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }

          const script = document.createElement("script");

          script.src = "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);

          document.body.appendChild(script);
        });
      };

      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay failed to load");
      }

      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: payment.amount,

        currency: payment.currency || "INR",

        name: "Your Store",

        description: "COD Order Payment",

        order_id: payment.razorpayOrderId,

        prefill: {
          name: order.shippingAddress?.name || "",

          contact: order.shippingAddress?.phone || "",

          email: "",
        },

        theme: {
          color: "#111827",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              orderId: order._id,
            });

            if (!verifyResponse.data?.success) {
              throw new Error(
                verifyResponse.data?.message || "Payment verification failed",
              );
            }

            toast.success("Payment successful");

            // Update UI immediately

            setOrder((prev) => ({
              ...prev,

              paymentStatus: "paid",

              paymentMethod: prev.paymentMethod || "online",
            }));
          } catch (err) {
            console.error("Payment verification error:", err);

            toast.error(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed",
            );
          }
        },

        // =================================================
        // RAZORPAY CLOSED
        // =================================================

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response);

        toast.error(response.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (err) {
      console.error("Pay now error:", err);

      toast.error(
        err.response?.data?.message || err.message || "Unable to start payment",
      );
    } finally {
      setPayLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load order
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error || "Order not found"}
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDER DATA
  // =====================================================

  const items = order.items || order.products || [];

  const paymentMethod = String(order.paymentMethod || "").toLowerCase();

  const orderStatus = String(
    order.orderStatus || order.status || "pending",
  ).toLowerCase();

  const paymentStatus = String(order.paymentStatus || "pending").toLowerCase();

  // const sellerConfirmed =
  //   order.sellerConfirmed === true ||
  //   order.sellerStatus === "confirmed" ||
  //   order.sellerConfirmation ===
  //     "confirmed";
  console.log("order:", order);

  const canCancel = [
    "cancelled",
    "canceled",
    "shipped",
    "delivered",
    "completed",
  ].includes(orderStatus);

  const isCOD = paymentMethod === "cod";

  const canPayNow =
    isCOD &&
    paymentStatus !== "paid" &&
    !["cancelled", "canceled", "delivered"].includes(orderStatus);

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price || item.product?.price || 0);

    const quantity = Number(item.quantity || item.qty || 1);

    return total + price * quantity;
  }, 0);

  const delivery = Number(order.deliveryCharge || order.shippingCharge || 0);
console.log("status", order.sellerConfirmation);

  const total = Number(order.totalAmount || order.total || subtotal + delivery);

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getStatusStyle = () => {
    switch (orderStatus) {
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "processing":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "cancelled":
      case "canceled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="bg-white border-b border-gray-200">
        <Navbar />
      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Order placed successfully!
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Thank you for your order. You can track the current status
                below.
              </p>
            </div>

            <div
              className={`self-start sm:self-center px-4 py-2 rounded-full border text-sm font-semibold ${getStatusStyle()}`}
            >
              {formatStatus(orderStatus)}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* STATUS CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* ORDER STATUS */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Order Status
            </p>

            <p className="text-lg font-bold text-gray-900 mt-2">
              {formatStatus(orderStatus)}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Your order's current status
            </p>
          </div>

          {/* SELLER STATUS */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Seller Confirmation
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  order.sellerConfirmation === "confirmed"
                    ? "bg-green-500"
                    : order.sellerConfirmation === "cancelled"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />

              <p className="text-lg font-bold 1 capitalize text-gray-900">
                {/* {order.sellerConfirmation ? "Confirmed" : "Waiting"} */}
                {order.sellerConfirmation}
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {order.sellerConfirmation === "confirmed"
                ? "Seller has confirmed your order."
                : order.sellerConfirmation === "cancelled"
                ? "Seller has cancelled your order."
                : "Waiting for seller confirmation."}
            </p>
          </div>

          {/* PAYMENT */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Payment
            </p>

            <p className="text-lg font-bold text-gray-900 mt-2">
              {paymentStatus === "paid" ? "Paid" : "Payment Pending"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {isCOD ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* COD PAYMENT NOTICE */}
        {/* ================================================= */}

        {canPayNow && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">
                  Want to pay online instead?
                </h3>

                <p className="text-sm text-amber-700 mt-1">
                  This order was placed with Cash on Delivery. You can pay
                  securely online now.
                </p>
              </div>

              <button
                onClick={handlePayNow}
                disabled={payLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {payLoading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* CONTENT GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ================================================= */}
          {/* ORDER ITEMS */}
          {/* ================================================= */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Ordered Items</h2>

              <p className="text-sm text-gray-500 mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} in this
                order
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No product information available.
                </div>
              ) : (
                items.map((item, index) => {
                  const product = item.product || {};

                  const name = item.name || product.name || "Product";

                  const image =
                    item.image || product.images?.[0] || item.images?.[0];

                  const price = Number(item.price || product.price || 0);

                  const quantity = Number(item.quantity || item.qty || 1);

                  return (
                    <div
                      key={item._id || item.productId || index}
                      className="p-4 sm:p-5 flex gap-4"
                    >
                      {/* IMAGE */}

                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-gray-100 overflow-hidden">
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

                      {/* DETAILS */}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹{price.toLocaleString()} × {quantity}
                        </p>

                        <p className="text-sm font-bold text-gray-900 mt-2">
                          ₹{(price * quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* ================================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================================= */}

            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>

                  <span className="font-medium text-gray-900">
                    {delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-5" />

              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </section>

            {/* ================================================= */}
            {/* SHIPPING ADDRESS */}
            {/* ================================================= */}

            <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Shipping Address
              </h2>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress?.name || "Customer"}
                </p>

                {order.shippingAddress?.phone && (
                  <p>{order.shippingAddress.phone}</p>
                )}

                {order.shippingAddress?.address && (
                  <p>{order.shippingAddress.address}</p>
                )}

                {order.shippingAddress?.state && (
                  <p>{order.shippingAddress.state}</p>
                )}

                {order.shippingAddress?.country && (
                  <p>{order.shippingAddress.country}</p>
                )}

                {order.shippingAddress?.pincode && (
                  <p>PIN: {order.shippingAddress.pincode}</p>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* CANCEL ORDER */}
            {/* ================================================= */}

            {canCancel && (
              <section className="bg-white border border-red-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h2 className="font-bold text-gray-900">Need to cancel?</h2>

                <p className="text-sm text-gray-500 mt-1">
                  You can cancel the order while the seller has not confirmed
                  it.
                </p>

                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className="w-full mt-4 border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </button>
              </section>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* BOTTOM ACTIONS */}
        {/* ================================================= */}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/dashboard/`)}
            className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>

          {canPayNow && (
            <button
              onClick={handlePayNow}
              disabled={payLoading}
              className="flex-1 bg-amber-400 text-gray-900 py-3.5 rounded-xl text-sm font-semibold hover:bg-amber-300 disabled:opacity-60 transition"
            >
              {payLoading ? "Processing..." : "Pay COD Order Online"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
