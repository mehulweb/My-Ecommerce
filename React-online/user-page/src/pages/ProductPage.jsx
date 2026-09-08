import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`w-4 h-4 ${
          s <= Math.round(rating)
            ? "text-amber-400"
            : "text-gray-200"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}

    <span className="text-sm text-gray-500 ml-1">
      {/* {rating} */}
    </span>
  </div>
);

export default function ProductPage() {
  const [product, setProduct] = useState({
    images: [],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState();
  const [outOfStock, setOutOfstock] = useState(false);

  // =========================================================
  // CART STATE
  // =========================================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Cart load error:", error);
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // =========================================================
  // PRODUCT API
  // =========================================================

  useEffect(() => {
    if (!id) return;

    api
      .get(`/product/${id}`)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch((err) => {
        console.error("❌ API ERROR:", err);
      });
  }, [id]);

  // =========================================================
  // SAVE CART LOCALLY
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart save error:", error);
    }
  }, [cart]);

  console.log("cart:", cart);

  // =========================================================
  // CART BACKEND FUNCTIONS
  // =========================================================
  // Backend route tum baad mein yahan connect kar sakte ho.
  // Product API ko touch nahi kiya gaya hai.
  // =========================================================

  const createCartOnBackend = async (cartItem) => {
    /*
      Example:

      await api.post("/cart", {
        productId: cartItem.id,
        quantity: cartItem.qty,
      });
    */

    console.log("Backend cart POST:", cartItem);
  };

  const updateCartOnBackend = async (cartItem) => {
    /*
      Example:

      await api.put(`/cart/${cartItem.id}`, {
        quantity: cartItem.qty,
      });
    */

    console.log("Backend cart UPDATE:", cartItem);
  };

  const removeCartFromBackend = async (productId) => {
    /*
      Example:

      await api.delete(`/cart/${productId}`);
    */

    console.log("Backend cart DELETE:", productId);
  };

  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // =========================================================
  // GET CURRENT PRODUCT QUANTITY
  // =========================================================

  const currentCartItem = cart.find(
    (item) => item.id === product._id
  );

  const currentQuantity = currentCartItem
    ? Number(currentCartItem.qty) || 0
    : 0;

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = async () => {
    if (!product?._id) {
      toast.error("Product information not available");
      return;
    }

    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      setOutOfstock(true);
      toast.error("Product out of stock");
      return;
    }

    let newCartItem;

    setCart((prev) => {
      const exists = prev.find(
        (item) => item.id === product._id
      );

      if (exists) {
        const currentQty = Number(exists.qty) || 0;

        if (currentQty >= stock) {
          return prev;
        }

        newCartItem = {
          ...exists,
          qty: currentQty + 1,
        };

        return prev.map((item) =>
          item.id === product._id
            ? newCartItem
            : item
        );
      }

      newCartItem = {
        id: product._id,
        name: product.name,
        price: Number(product.price) || 0,
        qty: 1,
        image: product.images?.[0] || "",
        stock: stock,
      };

      return [...prev, newCartItem];
    });

    setOutOfstock(false);

    showToast("1 item added to cart");

    // Backend connect later
    if (newCartItem) {
      await createCartOnBackend(newCartItem);
    }
  };

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = async () => {
    if (!product?._id) return;

    const stock = Number(product.stock) || 0;

    if (currentQuantity >= stock) {
      setOutOfstock(true);
      toast.error("Maximum available stock reached");
      return;
    }

    let updatedItem;

    setCart((prev) => {
      return prev.map((item) => {
        if (item.id !== product._id) {
          return item;
        }

        updatedItem = {
          ...item,
          qty: Number(item.qty) + 1,
        };

        return updatedItem;
      });
    });

    setOutOfstock(false);

    if (updatedItem) {
      await updateCartOnBackend(updatedItem);
    }
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = async () => {
    if (!product?._id) return;

    const item = cart.find(
      (cartItem) => cartItem.id === product._id
    );

    if (!item) return;

    const newQuantity = Number(item.qty) - 1;

    if (newQuantity <= 0) {
      setCart((prev) =>
        prev.filter(
          (cartItem) =>
            cartItem.id !== product._id
        )
      );

      setOutOfstock(false);

      await removeCartFromBackend(product._id);

      showToast("Item removed from cart");

      return;
    }

    const updatedItem = {
      ...item,
      qty: newQuantity,
    };

    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.id === product._id
          ? updatedItem
          : cartItem
      )
    );

    setOutOfstock(false);

    await updateCartOnBackend(updatedItem);
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeCartItem = async (productId) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.id !== productId
      )
    );

    await removeCartFromBackend(productId);
  };

  // =========================================================
  // BUY NOW
  // =========================================================

  const handleBuyNow = () => {
    const token = document.cookie
      .split("; ")
      .find((item) =>
        item.startsWith("token=")
      )
      ?.split("=");

    if (!token) {
      toast.error("please login");
      return;
    }

    navigate(`/address/${id}`);
  };

  // =========================================================
  // CART TOTAL
  // =========================================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.qty) || 0),
    0
  );

  const cartCount = cart.reduce(
    (total, item) =>
      total + (Number(item.qty) || 0),
    0
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="bg-[#fafaf8] font-sans min-h-screen">
      <Navbar />

      {/* =====================================================
          TOAST
      ===================================================== */}

      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>

          {toastMsg}
        </div>
      </div>

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setCartOpen(false)}
          />

          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-900">
                Your cart ({cartCount})
              </h2>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Items */}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-12">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          Qty {item.qty}
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ₹
                          {(
                            Number(item.price) *
                            Number(item.qty)
                          ).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeCartItem(item.id)
                        }
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}

            {cart.length > 0 && (
              <div className="px-6 py-5 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate("/cart")
                  }
                  className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  View Cart →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          FLOATING CART
          Bottom-right
      ===================================================== */}

      {cartCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-gray-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1"
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-xs text-gray-400">
              Cart
            </p>

            <p className="text-sm font-semibold">
              ₹{cartTotal.toLocaleString()}
            </p>
          </div>
        </button>
      )}

      {/* =====================================================
          PRODUCT SECTION
      ===================================================== */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* =================================================
              LEFT – IMAGES
          ================================================= */}

          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={product.images?.[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setActiveImage(i)
                  }
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-gray-900"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt="product"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              RIGHT – INFO
          ================================================= */}

          <div className="space-y-6">
            <div>
              <span className="inline-block text-xs font-medium tracking-widest text-amber-600 uppercase mb-3">
                New arrival
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-gray-400 text-base mt-1">
                {product.description}
              </p>
            </div>

            <StarRating rating={product.rating} />

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>

              <span className="text-lg line-through text-gray-300">
                ₹{product.originalPrice}
              </span>

              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Save ₹
                {product.originalPrice -
                  product.price}
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* =================================================
                COLOR
            ================================================= */}

            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Color —{" "}
                <span className="text-gray-900">
                  {selectedColor}
                </span>
              </p>

              <div className="flex gap-3">
                {/* Existing color logic intentionally untouched */}
              </div>
            </div>

            {/* =================================================
                CART QUANTITY
                Only appears AFTER product is added
            ================================================= */}

            {currentQuantity > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Quantity
                </p>

                <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors text-lg leading-none"
                  >
                    −
                  </button>

                  <span className="px-5 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200 min-w-[48px] text-center">
                    {currentQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      currentQuantity >=
                      Number(product.stock)
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>

                {outOfStock && (
                  <p className="mt-2 text-red-500 text-sm font-medium">
                    Maximum available stock reached
                  </p>
                )}
              </div>
            )}

            {/* =================================================
                CTA BUTTONS
            ================================================= */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              {/* ADD TO CART */}

              {currentQuantity === 0 ? (
                <button
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-medium text-sm py-3.5 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  Add to cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setCartOpen(true)
                  }
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 bg-gray-900 text-white font-medium text-sm py-3.5 rounded-xl hover:bg-gray-700 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  Added to cart

                  <span className="bg-amber-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {currentQuantity}
                  </span>
                </button>
              )}

              {/* BUY NOW */}

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-semibold text-sm py-3.5 rounded-xl hover:bg-amber-300 transition-colors"
              >
                Buy now →
              </button>
            </div>

            {/* =================================================
                REASSURANCES
            ================================================= */}

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                {
                  icon: "🚚",
                  text: "Free shipping",
                },
                {
                  icon: "↩️",
                  text: "30-day returns",
                },
                {
                  icon: "🔒",
                  text: "Secure checkout",
                },
              ].map((r) => (
                <div
                  key={r.text}
                  className="text-center py-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="text-base mb-0.5">
                    {r.icon}
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            FEATURES + SPECS
        ===================================================== */}

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What's inside
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {/* Existing features section untouched */}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Specifications
            </h2>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {/* Existing specs section untouched */}

              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm text-gray-400">
                  SKU
                </span>

                <span className="text-sm font-mono text-gray-500">
                  {product.sku}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}