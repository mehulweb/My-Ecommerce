import React, { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        document.cookie = `token=${res.data.token}; path=/; SameSite=Lax`;

        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error(
          err.response?.data?.message ||
            "Invalid email or password"
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">

      {/* Navbar */}
      <nav className="bg-purple-500 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-black text-white p-2 rounded-xl">
              <ShoppingBag size={25} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-white">
              Shop<span className="text-white">Ease</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-sm font-bold text-black transition "
          >
            Continue shopping →
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">

        <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/70 grid grid-cols-1 md:grid-cols-2">

          {/* Left Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-500 to-purple-400 p-8 sm:p-12 text-white flex flex-col justify-between min-h-[300px] md:min-h-[580px]">

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border-[35px] border-white/10" />

            <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-yellow-300/20 blur-2xl" />

            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-orange-100">
                Welcome to ShopEase
              </p>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
                Your next
                <br />
                favourite thing
                <br />
                <span className="text-yellow-100">
                  is waiting.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-base leading-7 text-orange-50">
                Discover products you'll love.
                Shop your favourites and enjoy
                a seamless shopping experience.
              </p>
            </div>

            {/* Shopping Illustration */}
            <div className="relative z-10 my-8 flex items-center justify-center">

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white/15 border border-white/20 backdrop-blur-sm sm:h-52 sm:w-52">

                <div className="absolute inset-4 rounded-full border border-dashed border-white/40" />

                <ShoppingBag
                  size={90}
                  strokeWidth={1.2}
                  className="drop-shadow-lg"
                />

                <div className="absolute -right-3 top-5 rounded-xl bg-white p-3 text-black shadow-lg">
                  <ShieldCheck size={25} />
                </div>

                <div className="absolute -bottom-2 -left-3 rounded-xl bg-white p-3 text-black shadow-lg">
                  <Truck size={25} />
                </div>

              </div>
            </div>

            {/* Benefits */}
            <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/25 pt-6">

              <div>
                <Truck size={22} className="mb-2" />
                <p className="text-sm font-bold">Fast Delivery</p>
                <p className="mt-1 text-xs text-orange-100">
                  To your door
                </p>
              </div>

              <div>
                <ShieldCheck size={22} className="mb-2" />
                <p className="text-sm font-bold">Secure</p>
                <p className="mt-1 text-xs text-orange-100">
                  Safe shopping
                </p>
              </div>

              <div>
                <Headphones size={22} className="mb-2" />
                <p className="text-sm font-bold">Support</p>
                <p className="mt-1 text-xs text-orange-100">
                  Here to help
                </p>
              </div>

            </div>
          </div>

          {/* Right Panel */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-8">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-orange-500/20">
                  <ShoppingBag size={25} />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Welcome back!
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Login to your account to continue shopping.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-500/10">

                    <Mail size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="h-12 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-500/10">

                    <LockKeyhole
                      size={19}
                      className="shrink-0 text-gray-400"
                    />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      minLength={6}
                      maxLength={12}
                      required
                      className="h-12 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-500 font-bold text-white shadow-lg shadow-black-500/20 transition hover:bg-purple-600 hover:shadow-black-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login to your account"}

                  {!loading && (
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>

              </form>

              {/* Signup */}
              <div className="mt-7 text-center text-sm text-gray-500">
                New to ShopEase?{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-orange-500 hover:text-orange-600"
                >
                  Create an account
                </Link>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-5 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 transition hover:text-orange-500"
                >
                  ← Back to shopping
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ShopEase. Happy shopping!
      </footer>

    </div>
  );
};

export default LoginPage;