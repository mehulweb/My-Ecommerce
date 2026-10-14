import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const Otp = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleInputChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      setOtp((prev) =>
        prev.map((digit, i) => (i === index ? "" : digit))
      );
      return;
    }

    // Support pasting multiple OTP digits
    const digits = value.split("").slice(0, 6 - index);

    setOtp((prev) => {
      const updated = [...prev];

      digits.forEach((digit, i) => {
        updated[index + i] = digit;
      });

      return updated;
    });

    const nextIndex = Math.min(index + digits.length, 5);

    if (index + digits.length < 6) {
      inputRefs.current[nextIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    const enteredOtp = otp.join("");

    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/sign-up");
      return;
    }

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      if (res.status === 200) {
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired OTP"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const email = localStorage.getItem("email");

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

          <div className="flex items-center gap-1 text-sm font-medium text-black">
            <ShieldCheck size={19} className="text-green-400" />
            Secure verification
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">

        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/70 md:grid-cols-2">

          {/* Left Banner */}
          <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-500 via-purple-500 to-purple-400 p-8 text-white sm:p-12 md:min-h-[560px]">

            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />

            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-300/20 blur-2xl" />

            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-orange-100">
                One last step
              </p>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Verify your
                <br />
                <span className="text-yellow-100">
                  email address.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-base leading-7 text-orange-50">
                A quick verification keeps your account
                secure and helps you enjoy a better shopping
                experience.
              </p>
            </div>

            {/* Verification Illustration */}
            <div className="relative z-10 my-8 flex justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm sm:h-52 sm:w-52">

                <div className="absolute inset-4 rounded-full border border-dashed border-white/40" />

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-orange-500 shadow-xl sm:h-28 sm:w-28">
                  <Mail size={58} strokeWidth={1.5} />
                </div>

                <div className="absolute -right-2 top-5 rounded-xl bg-white p-3 text-green-600 shadow-lg">
                  <ShieldCheck size={25} />
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-white/25 pt-5">
              <div className="flex items-center gap-3">
                <ShieldCheck size={23} />
                <div>
                  <p className="text-sm font-bold">
                    Your security matters
                  </p>
                  <p className="mt-1 text-xs text-orange-100">
                    Protecting your shopping account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right OTP Form */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-8">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-black">
                  <ShieldCheck size={27} />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  OTP Verification
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  We've sent a verification code to your
                  email address. Enter the 6-digit code below.
                </p>
              </div>

              {/* Email Info */}
              <div className="mb-7 flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black shadow-sm">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    Verification email
                  </p>

                  <p className="truncate text-sm font-semibold text-gray-800">
                    {email || "Your registered email"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerify}>

                <label className="mb-4 block text-sm font-semibold text-gray-700">
                  Enter verification code
                </label>

                {/* OTP Inputs */}
                <div className="mb-6 grid grid-cols-6 gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      pattern="[0-9]*"
                      maxLength={6}
                      value={digit}
                      required
                      aria-label={`OTP digit ${index + 1}`}
                      onChange={(e) => handleInputChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={(e) => e.target.select()}
                      className="h-12 min-w-0 rounded-xl border border-gray-200 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 sm:h-14"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">

                  <span className="text-gray-500">
                    Didn't receive the code?
                  </span>

                  <div className="flex items-center gap-2 font-semibold">
                    <RefreshCw
                      size={15}
                      className={timer > 0 ? "text-gray-400" : "text-orange-500"}
                    />

                    <span className={timer > 0 ? "text-gray-400" : "text-orange-600"}>
                      {timer > 0
                        ? `Resend in 00:${String(timer).padStart(2, "0")}`
                        : "Resend available"}
                    </span>
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify Email"}

                  {!loading && (
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Navigation */}
              <Link
                to="/login"
                className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 transition hover:text-orange-500"
                >
                  Back to shopping
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

export default Otp;