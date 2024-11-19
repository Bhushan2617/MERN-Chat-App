import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(""); // State to store password strength
  const [showPasswordStrength, setShowPasswordStrength] = useState(false); // State to control visibility of password strength
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to check if passwords match

  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/email");
    }
  }, [email, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
      setShowPasswordStrength(value.length > 0); // Show password strength only if there is input
    }

    if (name === "confirmPassword") {
      // Check if passwords match
      setPasswordsMatch(value === data.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(email, data.password);
      toast.success("Password changed successfully");
      navigate("/email");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password");
    }
  };

  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`;

  const resetPassword = async (email, newPassword) => {
    try {
      const response = await axios.post(URL, {
        email: String(email),
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const mediumPassword = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongPassword.test(password)) {
      return "Strong";
    } else if (mediumPassword.test(password)) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h1 className="text-center text-blue-950 font-mono text-2xl font-bold mt-4">
          Reset Password
        </h1>
        <div className="mt-4">
          {email && (
            <p className="text-center text-gray-600 py-3">
              Resetting password for email:{" "}
              <span className="font-bold">{email}</span>
            </p>
          )}
        </div>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
            />
            {showPasswordStrength && ( // Only show strength if there is input
              <p
                className={`${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                    ? "text-orange-600"
                    : "text-red-600"
                } text-sm font-semibold mt-1`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className={`bg-slate-100 px-2 py-1 focus:outline-primary ${
                passwordsMatch ? "" : "border-red-500"
              }`}
              value={data.confirmPassword}
              onChange={handleOnChange}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              required
            />
            {!passwordsMatch && (
              <p className="text-red-600 text-sm font-semibold mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            disabled={!passwordsMatch} // Disable button if passwords don't match
          >
            Change password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
