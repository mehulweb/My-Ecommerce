import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Star, Package } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Card = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addCart } = useCart();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const aboutProduct = (id) => {
    navigate(`/productpage/${id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[390px] animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center rounded-2xl px-5 text-center">
        <Package size={48} className="text-purple-400" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No products available
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please check back later for new products.
        </p>
      </div>
    );
  }

  return (
    <div className="w-4/4 flex items-center flex-wrap gap-3 p-10">

      {products.map((product) => {
        const outOfStock =
          product.stock !== undefined &&
          Number(product.stock) <= 0;

        const image =
          product.images?.[0] || product.image || "";

        return (
          <article
            key={product._id}
            className="w-75 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/70"
          >
            {/* Image Section */}
            <div
              onClick={() => aboutProduct(product._id)}
              className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden bg-gray-50 p-5"
            >
              <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                Featured
              </span>

              <span className="absolute right-3 top-3 z-10 rounded-full bg-orange-50 p-2 text-orange-500">
                <ShoppingBag size={17} />
              </span>

              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              ) : (
                <Package size={48} className="text-gray-300" />
              )}

              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                  <span className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                    Out of stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col p-4">

              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                  ShopEase
                </span>

                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-600">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  4.5/5
                </span>
              </div>

              <h2
                onClick={() => aboutProduct(product._id)}
                className="cursor-pointer truncate text-lg font-bold text-gray-900 transition hover:text-orange-600"
                title={product.name}
              >
                {product.name}
              </h2>

              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                {product.description || "Discover this product and explore its details."}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="mt-0.5 text-2xl font-extrabold text-gray-900">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => aboutProduct(product._id)}
                  className="flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                >
                  Details
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  toast.success(`${product.name} added to cart!`, { duration: 500 });
                  addCart(product);
                }}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                <ShoppingBag size={17} />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

            </div>
          </article>
        );
      })}

    </div>
  );
};

export default Card;