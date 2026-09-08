import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../services/api";

const Payment = ({
  accessToken,
  shippingAddress: incomingShippingAddress,
}) => {
  const navigate = useNavigate();
  const routeLocation = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SHIPPING ADDRESS
  // =====================================================

  const shippingAddress =
    routeLocation.state?.shippingAddress ||
    incomingShippingAddress;

  const addressId =
    routeLocation.state?.addressId;

  const item =
    routeLocation.state?.item;

    console.log("item:", item);
    

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // CREATE ORDER + ONLINE PAYMENT
  // =====================================================

  const handleOnlinePayment = async (method) => {
    try {
      setLoading(true);
      setError("");

      // =================================================
      // CHECK SHIPPING ADDRESS
      // =================================================

      if (!shippingAddress) {
        throw new Error(
          "Shipping address is required"
        );
      }

      // =================================================
      // CREATE MONGODB ORDER
      // =================================================

      const orderResponse = await api.post(
        "/orders",
        {
          shippingAddress,
          paymentMethod: method,
          addressId,
          item,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(
          orderResponse.data.message ||
            "Unable to create order"
        );
      }

      const orderId =
        orderResponse.data.orderId ||
        orderResponse.data.order?._id;

      if (!orderId) {
        throw new Error(
          "Order ID was not received from server"
        );
      }

      // =================================================
      // CREATE RAZORPAY ORDER
      // =================================================

      const paymentResponse = await api.post(
        "/payments/create",
        {
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!paymentResponse.data.success) {
        throw new Error(
          paymentResponse.data.message ||
            "Unable to create payment"
        );
      }

      const {
        razorpayOrderId,
        amount,
        currency,
      } = paymentResponse.data.payment;

      // =================================================
      // LOAD RAZORPAY
      // =================================================

      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Razorpay failed to load"
        );
      }

      // =================================================
      // RAZORPAY CHECKOUT
      // =================================================

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID; 
      console.log("key:", key);
      
      const options = { 
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: razorpayOrderId,
        
        // prefill: {
        //   contact:"8826669096",
        // } ,

        theme: {
          color: "#16a34a",
        },
       

        // ===============================================
        // PAYMENT SUCCESS
        // ===============================================

        handler: async (response) => {
          try {
            setLoading(true);
            setError("");

            const verifyResponse =
              await api.post(
                "/payments/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

            if (!verifyResponse.data.success) {
              throw new Error(
                verifyResponse.data.message ||
                  "Payment verification failed"
              );
            }

            alert(
              "Payment successful! Order confirmed."
            );

            navigate(
              `/order-detail/${orderId}`
            );
          } catch (err) {
            console.error(
              "Payment verification error:",
              err
            );

            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        // ===============================================
        // USER CANCELS RAZORPAY
        // ===============================================

        modal: {
          ondismiss: () => {
            setLoading(false);

            setError(
              "Payment cancelled. You can try again."
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed"
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Online payment error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );

      setLoading(false);
    }
  };

  // =====================================================
  // CASH ON DELIVERY
  // =====================================================

  const handleCOD = async () => {
    try {
      setLoading(true);
      setError("");

      if (!shippingAddress) {
        throw new Error(
          "Shipping address is required"
        );
      }

      const { data } = await api.post(
        "/orders",
        {
          shippingAddress,
          paymentMethod: "cod",
          addressId,
          item,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to place order"
        );
      }

      const orderId =
        data.orderId || data.order?._id;

      alert("Order placed successfully!");

      if (orderId) {
        navigate(
          `/order-Detail/${orderId}`
        );
      }
    } catch (err) {
      console.error(
        "COD error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <span className="text-xl transition group-hover:-translate-x-1">
              ←
            </span>

            Back
          </button>

          <div className="ml-5 border-l border-gray-200 pl-5">
            <h1 className="text-lg font-semibold text-gray-900">
              Payment
            </h1>

            <p className="text-xs text-gray-500">
              Choose your preferred payment method
            </p>
          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ================= PAYMENT ================= */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Select a payment method
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you want to pay.
                  </p>
                </div>

                <div className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 sm:block">
                  🔒 Secure Payment
                </div>

              </div>

            </div>

            <div className="p-4 sm:p-6">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Online Payment
              </p>

              {/* ================================= */}
              {/* PAYMENT OPTIONS */}
              {/* ================================= */}

              <div className="overflow-hidden rounded-xl border border-gray-200">

                {/* NET BANKING */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleOnlinePayment(
                      "netbanking"
                    )
                  }
                  className="group flex w-full items-center gap-4 border-b border-gray-200 bg-white px-4 py-4 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl transition group-hover:bg-green-100">
                    🏦
                  </div>

                  <div className="flex-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                      Net Banking
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Pay directly from your bank account
                    </p>

                  </div>

                  <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600">
                    →
                  </span>

                </button>

                {/* UPI */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleOnlinePayment("upi")
                  }
                  className="group flex w-full items-center gap-4 border-b border-gray-200 bg-white px-4 py-4 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl transition group-hover:bg-green-100">
                    📱
                  </div>

                  <div className="flex-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                      UPI
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      PhonePe, Google Pay, Paytm & more
                    </p>

                  </div>

                  <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600">
                    →
                  </span>

                </button>

                {/* DEBIT CARD */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleOnlinePayment(
                      "debitcard"
                    )
                  }
                  className="group flex w-full items-center gap-4 border-b border-gray-200 bg-white px-4 py-4 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl transition group-hover:bg-green-100">
                    💳
                  </div>

                  <div className="flex-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                      Debit Card
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Visa, Mastercard, RuPay & more
                    </p>

                  </div>

                  <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600">
                    →
                  </span>

                </button>

                {/* CREDIT CARD */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleOnlinePayment(
                      "creditcard"
                    )
                  }
                  className="group flex w-full items-center gap-4 bg-white px-4 py-4 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl transition group-hover:bg-green-100">
                    💳
                  </div>

                  <div className="flex-1">

                    <h3 className="text-sm font-semibold text-gray-900">
                      Credit Card
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Visa, Mastercard, Amex & more
                    </p>

                  </div>

                  <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600">
                    →
                  </span>

                </button>

              </div>

              {/* ============================= */}
              {/* COD */}
              {/* ============================= */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs font-medium text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200" />

              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pay Later
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleCOD}
                className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-4 text-left transition hover:border-green-500 hover:bg-green-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl transition group-hover:bg-green-100">
                  💵
                </div>

                <div className="flex-1">

                  <h3 className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Pay when your order arrives
                  </p>

                </div>

                <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600">
                  →
                </span>

              </button>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

            </div>

          </section>

          {/* ============================= */}
          {/* PAYMENT SUMMARY */}
          {/* ============================= */}

          <aside className="h-fit rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-5 py-4">

              <h2 className="font-bold text-gray-900">
                Payment Summary
              </h2>

            </div>

            <div className="space-y-4 p-5">

              <div className="rounded-lg bg-gray-50 p-3">

                <p className="text-xs leading-5 text-gray-500">
                  🔒 Your payment is processed securely.
                  Sensitive card information is handled
                  by Razorpay.
                </p>

              </div>

              <div className="rounded-lg border border-green-100 bg-green-50 p-3">

                <p className="text-xs font-medium text-green-700">
                  Select any payment option to continue.
                </p>

              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔐</span>
                Secure & encrypted checkout
              </div>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
};

export default Payment;