import { useState } from "react";
import api from "../services/api";

export default function SellerSignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bname: "",
    category: "",
    gst: "",
    password: "",
    terms: false,
  });
  

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "";
    if (!form.email.includes("@") || !form.email.includes("."))
      e.email = "Enter a valid email";
    if (form.phone.trim().length < 7) e.phone = "Enter a phone number";
    if (!form.bname.trim()) e.bname = "Required";
    if (!form.category) e.category = "Select a category";
    if (form.password.length < 8) e.password = "Min. 8 characters";
    if (!form.terms) e.terms = "Please accept the terms to continue.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/seller/register", {form})

    .then(()  => setSubmitted(true))

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .input-base {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 8px;
          border: 0.5px solid #d1d5db;
          background: #f9fafb;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-base:focus {
          border-color: #1d9e75;
          box-shadow: 0 0 0 3px rgba(29,158,117,0.1);
        }
        .input-base::placeholder { color: #9ca3af; }
        .input-error { border-color: #ef4444 !important; }
      `}</style>

      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl flex"
        style={{ minHeight: "580px" }}>

        {/* ── Left Panel ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-10"
          style={{
            width: "38%",
            background: "#0f2a2a",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#1d9e75" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#e1f5ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ color: "#9fe1cb", fontWeight: 500, fontSize: 16 }}>Marketo</span>
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <div style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#1d9e75", marginBottom: 14
            }}>
              Seller Platform
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 500, color: "#e1f5ee", lineHeight: 1.3, marginBottom: 14 }}>
              Start selling to{" "}
              <span style={{ color: "#5dcaa5" }}>millions</span>{" "}
              of customers today.
            </h1>
            <p style={{ fontSize: 13, color: "#5dcaa5", lineHeight: 1.7 }}>
              Join thousands of sellers growing their business on our platform.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-col gap-3">
            {[
              "0% commission for your first 3 months",
              "Instant payouts to your bank account",
              "Built-in analytics and inventory tools",
              "Dedicated seller support 24/7",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#1d9e75", flexShrink: 0
                }} />
                <span style={{ fontSize: 12, color: "#9fe1cb" }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 bg-white overflow-y-auto p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ background: "#e1f5ee" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Seller account created!</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Welcome to Marketo. Check your email to verify your account and start listing your products.
              </p>
              <a
                href="/seller-login"
                className="mt-6 px-5 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "#1d9e75" }}
              >
                Back to Sign in
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-1">Create your seller account</h2>
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a href="/seller-login" style={{ color: "#1d9e75" }}>Sign in</a>
                </p>
              </div>

              {/* Personal Info */}
              <SectionLabel>Personal info</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Field label="First name" error={errors.firstName}>
                  <input
                    className={`input-base ${errors.firstName ? "input-error" : ""}`}
                    name="firstName" value={form.firstName}
                    onChange={handleChange} placeholder="Rahul"
                  />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input
                    className={`input-base ${errors.lastName ? "input-error" : ""}`}
                    name="lastName" value={form.lastName}
                    onChange={handleChange} placeholder="Sharma"
                  />
                </Field>
              </div>
              <Field label="Email address" error={errors.email}>
                <input
                  className={`input-base ${errors.email ? "input-error" : ""}`}
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="rahul@example.com"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  className={`input-base ${errors.phone ? "input-error" : ""}`}
                  type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+91 98765 43210"
                />
              </Field>

              {/* Business Info */}
              <SectionLabel>Business info</SectionLabel>
              <Field label="Business / Store name" error={errors.bname}>
                <input
                  className={`input-base ${errors.bname ? "input-error" : ""}`}
                  name="bname" value={form.bname}
                  onChange={handleChange} placeholder="Rahul's Electronics"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Field label="Category" error={errors.category}>
                  <select
                    className={`input-base ${errors.category ? "input-error" : ""}`}
                    name="category" value={form.category} onChange={handleChange}
                  >
                    <option value="">Select…</option>
                    {["Electronics","Fashion","Home & Living","Beauty","Sports","Books","Other"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="GST / Tax ID (optional)">
                  <input
                    className="input-base"
                    name="gst" value={form.gst}
                    onChange={handleChange} placeholder="22AAAAA0000A1Z5"
                  />
                </Field>
              </div>

              {/* Security */}
              <SectionLabel>Security</SectionLabel>
              <Field label="Password" error={errors.password}>
                <input
                  className={`input-base ${errors.password ? "input-error" : ""}`}
                  type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters"
                />
              </Field>

              {/* Terms */}
              <div className="flex items-start gap-2 mb-1 mt-4">
                <input
                  type="checkbox" id="terms" name="terms"
                  checked={form.terms} onChange={handleChange}
                  className="mt-0.5" style={{ accentColor: "#1d9e75" }}
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" style={{ color: "#1d9e75" }}>Seller Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" style={{ color: "#1d9e75" }}>Privacy Policy</a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs mb-3" style={{ color: "#ef4444" }}>{errors.terms}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white text-sm font-medium mt-4 transition-opacity hover:opacity-90 active:scale-99"
                style={{ background: "#1d9e75" }}
              >
                Create seller account →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "#9ca3af",
      marginTop: 18, marginBottom: 10,
      paddingBottom: 6,
      borderBottom: "0.5px solid #e5e7eb"
    }}>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 5 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{error}</p>}
    </div>
  );
}