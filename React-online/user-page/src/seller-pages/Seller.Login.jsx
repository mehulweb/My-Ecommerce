import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const Navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();

    api.post("/seller/login", {email, password})

    .then((res) => {
      if (res.status === 401) {
          toast("Invalid email or password");
        } else {
          if (res.status === 200) {
            // console.log(res.data.userId);
            document.cookie = `token=${res.data.token}`;
            Navigate(`/seller-dashboard/${res.data.sellerId}`);
          }
          toast("Login successful");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    
  
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Dark Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-r from-slate-900 to-slate-800 flex-col justify-between p-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Banaya</h1>
          <p className="text-slate-300 text-lg">Seller Dashboard</p>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Active Sellers</p>
            <p className="text-3xl font-bold text-white">12,480</p>
          </div>
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Total Sales</p>
            <p className="text-3xl font-bold text-white">₹2.4 Cr</p>
          </div>
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Growth This Month</p>
            <p className="text-3xl font-bold text-emerald-400">+18%</p>
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          © 2026 Banaya. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your seller account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@banaya.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Keep Signed In Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="keepSignedIn"
                className="ml-2 text-sm text-gray-700"
              >
                Keep me signed in
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"
              />
              <path
                fill="#fff"
                d="M18.52 11.5h-7v2.5h4.15c-.5 2.5-2.75 4-4.15 4-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.1 0 2.1.4 2.85 1.15l2-2C15.4 5.5 13.9 4.5 12 4.5 7.86 4.5 4.5 7.86 4.5 12s3.36 7.5 7.5 7.5c4.5 0 7.5-3 7.5-7.5 0-.5 0-1-.15-1.5z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Google</span>
          </button>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/seller-signup"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign up here
              </a>
            </p>
            <p>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
