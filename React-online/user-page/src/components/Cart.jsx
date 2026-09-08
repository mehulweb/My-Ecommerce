import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = ({ cartItems = [], setCartItems }) => {
  const navigate = useNavigate();

  const items = Array.isArray(cartItems) ? cartItems : [];

  const updateQuantity = (id, type) => {
    if (!setCartItems) return;

    setCartItems((currentItems = []) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        const stock = Number(item.stock) || 0;
        const quantity = Number(item.quantity) || 0;

        const newQuantity =
          type === "increase"
            ? Math.min(quantity + 1, stock)
            : Math.max(quantity - 1, 1);

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  const removeItem = (id) => {
    if (!setCartItems) return;

    setCartItems((currentItems = []) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);

  const delivery = subtotal === 0 || subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Back Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-500 hover:border-red-200 transition shadow-sm"
            >
              ← Back
            </button>
          </div>

          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>

              <h2 className="text-2xl font-semibold text-gray-900">
                Your cart is empty
              </h2>

              <p className="text-gray-500 mt-2">
                Looks like you haven't added anything yet.
              </p>

              <Link
                to="/products"
                className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // CART WITH ITEMS
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-red-500 hover:border-red-200 transition shadow-sm"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          <p className="text-gray-500 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const stock = Number(item.stock) || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl bg-gray-100"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹{price}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-5">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                        <button
                          onClick={() =>
                            updateQuantity(item.id, "decrease")
                          }
                          className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
                        >
                          −
                        </button>

                        <span className="px-4 py-2 font-semibold text-gray-900">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, "increase")
                          }
                          disabled={quantity >= stock}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          +
                        </button>

                      </div>

                      <p className="font-bold text-gray-900">
                        ₹{price * quantity}
                      </p>
                    </div>

                    {quantity >= stock && stock > 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        Maximum available stock reached
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit shadow-sm">

            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>

            </div>

            <div className="border-t border-gray-200 my-5" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-semibold transition shadow-sm"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center mt-4 text-sm text-gray-500 hover:text-red-500 transition"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;