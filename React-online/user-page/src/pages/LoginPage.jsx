import React from "react";
import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/auth/login", { email, password })

      .then((res) => {
          if (res.status === 200) {
            // console.log(res.data.userId);
            document.cookie = `token=${res.data.token}`;
            Navigate(`/dashboard`);
          }
          toast("Login successful");
        }
      )
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error(err.response?.data?.message || "Invalid email or password");
        } 
        console.log(err);
      });
  };

  return (
    <div className="background-login w-full h-screen bg-gray-50 flex items-center justify-center">
      <div className="background-login1 w-320 h-150 border rounded-3xl bg-white shadow-lg flex items-center justify-center">
        <div className="w-100 h-110 border bg-transparent flex items-center justify-center gap-2 flex-col rounded-2xl">
          <h1 className="text-white font-bold text-4xl text-center mt-6">
            Login
          </h1>
          <form className="w-80 flex flex-col mt-5  p-5">
            <h3 className="font-medium text-white">Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email"
              className="w-full h-9 bg-white border rounded-md p-2 outline-none"
            />
            <h3 className="font-medium text-white">Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={12}
              required
              placeholder="Password"
              className="w-full h-9 bg-white border rounded-md p-2 outline-none"
            />
            <button
              className="w-full h-9 bg-blue-500 text-white mt-5 rounded-md"
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
          <div className="text-center mt-5">
            <a href="/sign-up" className="text-white">
              Don't have an account? Sign up
            </a>
          </div>
          <div className="text-center mt-5">
            <a href="/" className="text-white  required">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
