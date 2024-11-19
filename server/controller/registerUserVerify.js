const otpGenerator = require("otp-generator");
const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerUser = async (request, response) => {
  try {
    const { name, email, password, profile_pic } = request.body;

    // Check if the email already exists
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return response.status(400).json({
        message: "User already exists",
        error: true,
      });
    }

    // Generate OTP
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    request.app.locals.OTP = OTP;

    // Store user details temporarily
    request.app.locals.userDetails = {
      name,
      email,
      password,
      profile_pic,
    };

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<h4>Welcome to Chat Application</h4><br><h5>Verify Your Email</h5><p>Your One Time Password (OTP) is </p><h3>${OTP}</h3><br><p>Thank You....👍This is automatic mail plz don't reply</p>`,
      text: "Thank You.... !",
    };

    // Send email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return response
          .status(500)
          .json({ message: "Error sending email", error });
      } else {
        return response.status(200).json({
          message: "OTP sent to email.",
          success: true,
          info,
        });
      }
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const registerVerifyOtp = async (req, res) => {
  const { code } = req.body;

  // Verify OTP
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    // Reset the OTP value
    req.app.locals.OTP = null;

    // Get the user details
    const { name, email, password, profile_pic } = req.app.locals.userDetails;

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    // Create user payload
    const payload = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    // Save user to the database
    const user = new UserModel(payload);
    const userSave = await user.save();

    // Clear the temporary user details
    req.app.locals.userDetails = null;

    // Return success response
    return res.status(201).json({
      message: "User verified successfully!",
      data: userSave,
      success: true,
    });
  }

  // Return error if OTP is invalid
  return res.status(400).send({ error: "Invalid OTP" });
};

const registerCreateResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

module.exports = {
  registerUser,
  registerVerifyOtp,
  registerCreateResetSession,
};
