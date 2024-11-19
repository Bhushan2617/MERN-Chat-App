import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(""); // State to store password strength
  const [showPasswordStrength, setShowPasswordStrength] = useState(false); // State to control visibility of password strength
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to check if passwords match

  const navigate = useNavigate();

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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG are allowed.");
      return;
    }

    // Validate file size (example: max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    const uploadPhoto = await uploadFile(file);

    setUploadPhoto(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register-user`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          profile_pic: "",
        });

        navigate("/register-verify", { state: { email: data.email } });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        <h3 className="flex justify-center">Welcome to Chat app!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">
              Name :<label className="ml-0 text-red-600">*</label>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              pattern="[A-Za-z ]{3,}"
              title="Must contain Alphabets"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">
              Email :
              <label htmlFor="email" className="ml-0 text-red-600">
                *
              </label>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">
              Password :
              <label htmlFor="password" className="ml-0 text-red-600">
                *
              </label>
            </label>
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
            {showPasswordStrength && (
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

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">
              Confirm Password :
              <label htmlFor="confirmPassword" className="ml-0 text-red-600">
                *
              </label>
            </label>
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

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>

            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
            disabled={!passwordsMatch} // Disable button if passwords don't match
          >
            Register
          </button>
        </form>

        <p className="my-3 text-center">
          Already have an account?{" "}
          <Link to={"/email"} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
