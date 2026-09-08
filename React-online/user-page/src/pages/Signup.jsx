import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("user:",username, email, password);
    localStorage.setItem("email", email);

    api
      .post("/auth/register", { username, email, password })

      .then((res) => {
      
        if (res.status === 201) {
           toast("Registration successfully");
        }
        if (res.status === 400) {
            toast("Invalid input");
        }
        if (res.status === 409) {
            toast("User already exists");
        }
        if (res.status === 200) {
          toast("otp sent successfully to your email");
        }

      })
      .then(() => Navigate("/otp"));
  };

  return (
    <div className="background w-full h-screen flex items-center justify-center">
      <div className="w-280 h-160 border-0 rounded-xl bg-white flex overflow-hidden">
        <div className="w-130 h-full flex justify-center items-center">
          <div className="w-85 h-120 border-0 rounded-xl flex flex-col gap-6 py-8 items-center">
            <div className="flex flex-wrap items-center justify-center gap-1">
              <h1 className="font-extrabold text-2xl italic">Sign-up</h1>
              <p className="text-gray-400 text-lg  font-8">
                welcome to ulala - let's create account
              </p>
            </div>
            <form className="w-85 flex flex-col">
              <h3 className="font-extralight text-base">Name</h3>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full border-1 rounded-4xl  h-10 font-medium px-4 "
              />
              <h3 className="font-extralight text-base">E-mail</h3>
              <input
                type="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full border-1 rounded-4xl  h-10 font-medium px-4 "
              />
              <h3 className="font-extralight text-base">Password</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={12}
                required
                placeholder="password"
                className="w-full border-1 rounded-4xl  h-10 font-medium px-4 "
              />
            </form>
            <a href="/login" className="text-gray-500 hover:underline">
              Already have an account? Login
            </a>
            <a href="/" className="text-gray-500 hover:underline">
              Back to Home
            </a>
            <button
              className="w-50 h-40  bg-blue-500 text-white border-1 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="w-155 h-full flex items-center justify-center">
          <img
            className="w-130 h-150 bg- bg-center border-0 rounded-xl"
            src="src/assests/pexels-alex-ning-523843601-36361501.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
