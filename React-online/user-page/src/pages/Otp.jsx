import { useRef } from "react"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

const Otp = () => {
  const Navigate = useNavigate();
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    if(event.key === "Backspace" && index > 0 && value.length === 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    const otp = inputRefs.current.map(input => input.value).join('');
    console.log("Entered OTP:", otp);

    api.post("/auth/verify-otp", {email, otp })
    .then((res) => {
      if (res.status === 200) {
        alert("OTP verified successfully");
      }
      if (res.status === 400) {
        alert("Invalid OTP");
      }
    })

    .then(() => Navigate("/login"));
  }

  return (
    <div className='w-full h-screen bg-amber-200 flex  justify-center items-center'>
      <div className='w-200 h-150 border-red-100 flex flex-col items-center justify-center gap-5 bg-gray-800 rounded-3xl p-5'>
        <h1 className='text-3xl text-white font-bold text-center mt-6'>OTP Verification</h1>
        <form className='w-full flex flex-col justify-center items-center gap-5 mt-5  p-5'>
          <h3 className='font-medium text-white'>Enter OTP</h3>
          <div className='flex gap-3'>
            <input type="text" required ref={(el) => (inputRefs.current[0] = el)} onKeyDown={(e) => handleInputChange(0, e)} onChange={(e) => handleInputChange(0, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
            <input type="text" required ref={(el) => (inputRefs.current[1] = el)} onKeyDown={(e) => handleInputChange(1, e)} onChange={(e) => handleInputChange(1, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
            <input type="text" required ref={(el) => (inputRefs.current[2] = el)} onKeyDown={(e) => handleInputChange(2, e)} onChange={(e) => handleInputChange(2, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
            <input type="text" required ref={(el) => (inputRefs.current[3] = el)} onKeyDown={(e) => handleInputChange(3, e)} onChange={(e) => handleInputChange(3, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
            <input type="text" required ref={(el) => (inputRefs.current[4] = el)} onKeyDown={(e) => handleInputChange(4, e)} onChange={(e) => handleInputChange(4, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
            <input type="text" required ref={(el) => (inputRefs.current[5] = el)} onKeyDown={(e) => handleInputChange(5, e)} onChange={(e) => handleInputChange(5, e)} maxLength={1} className='w-13 h-13 focus:outline-none p-5 rounded-md bg-gray-800 text-white border' />
          </div>
          <a href="" className={`text-blue-500 text-sm cursor-pointer hover:underline ${timer > 0 ? 'pointer-events-none opacity-50' : ''}`}>
            Resend Otp: {timer}
          </a>
          <button className='w-50 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300' onClick={handleVerify}>Verify</button>
        </form>
        <div className='text-center mt-5'>
          <a href="/login" className='text-white'>Back to Login</a> 
        </div>
        <div className='text-center mt-5'>
          <a href="/" className='text-white '>Back to Home</a>
        </div>
      </div>
    </div>
  )
}

export default Otp
