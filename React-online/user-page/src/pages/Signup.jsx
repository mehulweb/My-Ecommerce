import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      localStorage.setItem("email", email);

      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("OTP sent successfully to your email");
        navigate("/otp");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Please enter valid details");
      } else if (status === 409) {
        toast.error(message || "User already exists");
      } else {
        toast.error(message || "Registration failed. Try again.");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">

      {/* Navbar */}
      <nav className="bg-purple-500 border-b border-gray-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-black p-2 text-white">
              <ShoppingBag size={25} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-white">
              Shop<span className="text-white">Ease</span>
            </span>
          </Link>

          <Link
            to="/login"
            className="text-sm font-bold text-black transition "
          >
            Already a member? Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">

        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/70 md:grid-cols-2">

          {/* Left Banner */}
          <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-500 via-purple-500 to-purple-400 p-8 text-white sm:p-12 md:min-h-[620px]">

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-yellow-300/20 blur-2xl" />

            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-orange-100">
                Join our community
              </p>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Shopping
                <br />
                made simple.
                <br />
                <span className="text-yellow-100">
                  Life made better.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-base leading-7 text-orange-50">
                Create your account and discover products
                you'll love, all in one place.
              </p>
            </div>

            {/* Shopping Icon */}
            <div className="relative z-10 my-8 flex justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm sm:h-52 sm:w-52">

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
                <p className="mt-1 text-xs text-orange-100">To your door</p>
              </div>

              <div>
                <ShieldCheck size={22} className="mb-2" />
                <p className="text-sm font-bold">Secure</p>
                <p className="mt-1 text-xs text-orange-100">Safe shopping</p>
              </div>

              <div>
                <Headphones size={22} className="mb-2" />
                <p className="text-sm font-bold">Support</p>
                <p className="mt-1 text-xs text-orange-100">Here to help</p>
              </div>

            </div>
          </div>

          {/* Signup Form */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-7">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-orange-500/20">
                  <UserRound size={25} />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Create Account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign up to start your shopping journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-500/10">

                    <UserRound size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                      className="h-12 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

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

                    <LockKeyhole size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={12}
                      required
                      className="h-12 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Password must be 8–12 characters.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-500 font-bold text-white shadow-lg shadow-black-500/20 transition hover:bg-purple-600 hover:shadow-black-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account"}

                  {!loading && (
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-orange-500 hover:text-orange-600"
                >
                  Login
                </Link>
              </p>

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
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

      <footer className="py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ShopEase. Happy shopping!
      </footer>
    </div>
  );
};

export default Signup;