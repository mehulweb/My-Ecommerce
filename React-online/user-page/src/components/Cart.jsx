import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const items = Array.isArray(cartItems) ? cartItems : [];

  const updateQuantity = (id, type) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item._id !== id) return item;

        const quantity = Number(item.quantity) || 1;
        const hasStock =
          item.stock !== undefined && item.stock !== null;
        const stock = Number(item.stock);

        const newQuantity =
          type === "increase"
            ? hasStock
              ? Math.min(quantity + 1, stock)
              : quantity + 1
            : Math.max(quantity - 1, 1);

        return { ...item, quantity: newQuantity };
      })
    );
  };

  const removeItem = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item._id !== id)
    );
  };

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  const delivery = subtotal === 0 || subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;
  const remaining = Math.max(500 - subtotal, 0);

  const isLogin = () => {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="));
      
      if (token) {
          navigate(`/address/${token.split("=")[1]}`);
      } else {
          toast.error("Please log in to proceed to checkout.", {duration: 800});
      }
}
  return (
    <div className="min-h-screen bg-[#f7f7f8]">

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-orange-500 p-2 text-white">
              <ShoppingBag size={23} />
            </div>

            <span className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              Shop<span className="text-orange-500">Ease</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ShieldCheck size={19} className="text-green-600" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Continue browsing
        </button>

        {/* Page Heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
              Your shopping bag
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your items before checking out.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 sm:flex">
            <ShoppingCart size={28} />
          </div>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm">

            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <ShoppingBag size={43} strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Looks like you haven't added anything yet.
              Explore our collection and find something you love.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/"
              className="mt-4 text-sm font-medium text-gray-500 transition hover:text-orange-500"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Free Delivery Banner */}
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 sm:items-center">
              <div className="rounded-xl bg-white p-2.5 text-orange-500 shadow-sm">
                <Truck size={22} />
              </div>

              <div className="flex-1">
                {subtotal > 500 ? (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      You've unlocked free delivery!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Your order qualifies for free shipping.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      You're close to free delivery
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Add ₹{remaining} more to unlock free delivery on
                      orders above ₹500.
                    </p>
                  </>
                )}

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-orange-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-300"
                    style={{
                      width: `${Math.min((subtotal / 501) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

              {/* Cart Items */}
              <section className="space-y-4 lg:col-span-2">

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Items
                  </h2>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 ring-1 ring-gray-200">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 1;

                  const hasStock =
                    item.stock !== undefined && item.stock !== null;
                  const stock = Number(item.stock);

                  const image =
                    item.images?.[0] || item.image || "";

                  return (
                    <article
                      key={item._id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                    >
                      <div className="flex gap-4 sm:gap-5">

                        {/* Product Image */}
                        <Link
                          to={`/products/${item._id}`}
                          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={item.name || "Product"}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              <ShoppingBag size={32} />
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="flex min-w-0 flex-1 flex-col">

                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 font-bold leading-6 text-gray-900">
                                {item.name || "Product"}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                Price per item
                              </p>

                              <p className="mt-0.5 font-semibold text-orange-600">
                                ₹{price.toLocaleString("en-IN")}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item._id)}
                              aria-label={`Remove ${item.name || "product"}`}
                              className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">

                            {/* Quantity Control */}
                            <div>
                              <p className="mb-2 text-xs font-medium text-gray-500">
                                Quantity
                              </p>

                              <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white">

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item._id, "decrease")
                                  }
                                  disabled={quantity <= 1}
                                  aria-label="Decrease quantity"
                                  className="rounded-l-xl p-2.5 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Minus size={15} />
                                </button>

                                <span className="min-w-9 text-center text-sm font-bold text-gray-900">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item._id, "increase")
                                  }
                                  disabled={
                                    hasStock && quantity >= stock
                                  }
                                  aria-label="Increase quantity"
                                  className="rounded-r-xl p-2.5 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>

                              {hasStock && stock > 0 && quantity >= stock && (
                                <p className="mt-1.5 text-xs text-orange-600">
                                  Maximum stock reached
                                </p>
                              )}
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Item total
                              </p>
                              <p className="mt-1 text-lg font-extrabold text-gray-900">
                                ₹{(price * quantity).toLocaleString("en-IN")}
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                >
                  <ArrowLeft size={17} />
                  Add more products
                </Link>
              </section>

              {/* Order Summary */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                  <h2 className="text-xl font-extrabold text-gray-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review your order total.
                  </p>

                  <div className="my-6 space-y-4">

                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-gray-500">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-gray-500">
                        Delivery charges
                      </span>

                      <span
                        className={
                          delivery === 0
                            ? "font-semibold text-green-600"
                            : "font-semibold text-gray-900"
                        }
                      >
                        {delivery === 0 ? "FREE" : `₹${delivery}`}
                      </span>
                    </div>

                    {delivery > 0 && (
                      <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs leading-5 text-orange-700">
                        Shop for more than ₹500 to get free delivery.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-dashed border-gray-200" />

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900">
                      Total Amount
                    </span>

                    <span className="text-2xl font-extrabold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Delivery and other charges are calculated as shown.
                  </p>

                  <button
                    type="button"
                    onClick={isLogin}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30"
                  >
                    Proceed to Checkout
                    <ArrowRight size={19} />
                  </button>

                  <Link
                    to="/products"
                    className="mt-4 flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Continue Shopping
                  </Link>

                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <PackageCheck
                      size={21}
                      className="shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Shopping with confidence
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Review your items before confirming your order.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          </>
        )}
      </main>

      {/* Footer
      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-extrabold text-gray-800">
            Shop<span className="text-orange-500">Ease</span>
          </Link>

          <p>Happy shopping, every day.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Cart;