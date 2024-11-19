import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [email, setEmail] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setEmail((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-email`,
        { email: email.email }
      );
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { email: email.email } }); // Pass email
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleBack = () => {
    navigate("/email"); // Navigate to email page
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="text-center text-4xl font-bold mt-20">
          Email Verification
        </h3>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={email.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Get OTP
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-black leading-relaxed tracking-wide"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
