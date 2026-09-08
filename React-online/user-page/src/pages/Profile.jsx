import { useEffect, useState } from "react";
import api from "../services/api";

const NAV_ITEMS = [
  {
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    label: "Profile",
    active: true,
  },
  {
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    label: "Settings",
    active: false,
  },
  {
    icon: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
    label: "Alerts",
    active: false,
  },
];

function Icon({ path, size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const HOME_PATH =
  "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25";
const MAIL_PATH =
  "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75";
const USER_PATH =
  "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z";
const EDIT_PATH =
  "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125";
const CHECK_PATH = "m4.5 12.75 6 6 9-13.5";
const X_PATH = "M6 18 18 6M6 6l12 12";
const CAL_PATH =
  "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5";

export default function UserProfile() {
  const [email, setEmail] = useState();
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(email);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({});

  const userdata = async () => {
    const res = await api.get("/auth/profile");
    console.log(res.data.user);
    setProfile(res.data.user);
  };

  useEffect(() => {
      userdata()
  },[])

  function startEdit() {
    setTemp(email);
    setEditing(true);
    setError("");
    setSaved(false);
  }
  function cancel() {
    setEditing(false);
    setError("");
  }
  function save() {
    if (!temp.trim()) return setError("Email cannot be empty.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(temp))
      return setError("Enter a valid email address.");
    setEmail(temp);
    setEditing(false);
    setSaved(true);
    setError("");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex shadow-xl border border-slate-200"
        style={{ minHeight: 480 }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <div className="bg-[#0F172A] w-64 flex-shrink-0 flex flex-col">
          {/* Avatar block */}
          <div className="px-6 pt-10 pb-8 border-b border-slate-700/50">
            <div className="w-16 h-16 rounded-2xl bg-[#1D9E75] flex items-center justify-center text-white text-xl font-semibold mb-4 select-none"></div>
            <p className="text-white font-semibold text-lg leading-tight">
              {profile.username}
            </p>
            <p className="text-slate-400 text-sm mt-1">Product Designer</p>
            <span className="inline-block mt-3 text-[11px] px-2.5 py-1 rounded-full bg-[#1D9E75]/20 text-[#5DCAA5] font-medium tracking-wide">
              Active
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  item.active
                    ? "bg-[#1D9E75]/20 text-[#5DCAA5]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon path={item.icon} size={17} />
                {item.label}
                {item.active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                )}
              </button>
            ))}
          </nav>

          {/* Back to Home button */}
          <div className="px-3 pb-6">
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border border-slate-700/60"
            >
              <Icon path={HOME_PATH} size={17} />
              Back to Home
            </button>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                My Profile
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your account details
              </p>
            </div>
            {saved && (              
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <Icon path={CHECK_PATH} size={13} />
                Saved                
              </span>
              
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 px-8 py-7 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <Icon
                  path={USER_PATH}
                  size={16}
                  className="text-slate-300 flex-shrink-0"
                />
                <span className="text-slate-700 text-sm flex-1">
                  {profile.username}
                </span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest">
                  read only
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>

              {editing ? (
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all ${error ? "border-red-300 ring-2 ring-red-100" : "border-[#1D9E75] ring-2 ring-[#1D9E75]/20"}`}
                  >
                    <Icon
                      path={MAIL_PATH}
                      size={16}
                      className="text-[#1D9E75] flex-shrink-0"
                    />
                    <input
                      type="email"
                      value={temp}
                      onChange={(e) => {
                        setTemp(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") save();
                        if (e.key === "Escape") cancel();
                      }}
                      autoFocus
                      className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 px-1">{error}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={save}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D9E75] text-white text-sm hover:bg-[#0F6E56] active:scale-[0.98] transition-all"
                    >
                      <Icon path={CHECK_PATH} size={14} /> Save
                    </button>
                    <button
                      onClick={cancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <Icon path={X_PATH} size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 group">
                  <Icon
                    path={MAIL_PATH}
                    size={16}
                    className="text-slate-300 flex-shrink-0"
                  />
                  <span className="text-slate-700 text-sm flex-1 truncate">
                    {profile.email}
                  </span>
                  <button
                    onClick={startEdit}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#1D9E75]/10 text-[#1D9E75]"
                    aria-label="Edit email"
                  >
                    <Icon path={EDIT_PATH} size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Member since */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <Icon
                  path={CAL_PATH}
                  size={16}
                  className="text-slate-300 flex-shrink-0"
                />
                <span className="text-slate-700 text-sm">March 2022</span>
              </div>
            </div>
          </div>

          {/* Footer action */}
          {!editing && (
            <div className="px-8 pb-7">
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D9E75] text-white text-sm font-medium hover:bg-[#0F6E56] active:scale-[0.98] transition-all"
              >
                <Icon path={EDIT_PATH} size={15} />
                Edit email address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
