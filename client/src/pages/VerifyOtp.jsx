import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // Timer state
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/verify-email");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Timer logic
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`,
        { code: otp }
      );
      toast.success(response.data.msg);
      navigate("/reset-password", { state: { email } }); // Pass email to reset password
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const ResendOTP = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-email`,
        { email }
      );
      toast.success(response.data.message);
      setTimer(60); // Reset the timer
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mt-5 p-20">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h1 className="text-center text-blue-950 font-mono text-2xl font-bold">
          Reset Password
        </h1>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <div className="flex justify-between items-center mt-2">
          {timer === 0 ? (
            <button
              className="text-[#1c4d2e] hover:text-[#166534] cursor-pointer"
              onClick={ResendOTP}
            >
              Resend OTP
            </button>
          ) : (
            <span className="timer">{`00:${
              timer < 10 ? `0${timer}` : timer
            } SEC`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
