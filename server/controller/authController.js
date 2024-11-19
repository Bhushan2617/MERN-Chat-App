const otpGenerator = require("otp-generator");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const OTP_EXPIRATION_TIME = 1 * 60 * 1000; // 1 minutes in milliseconds

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await UserModel.findOne({ email }).select("-password");

    if (!checkEmail) {
      return res.status(400).json({
        message: "User not exist",
        error: true,
      });
    } else {
      const OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const otpCreatedTime = Date.now();
      req.app.locals.OTP = OTP;
      req.app.locals.otpCreatedTime = otpCreatedTime;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Recovery",
        html: `<h1>RESET PASSWORD 🔑 </h1><p>Your One Time Password is valid upto <strong>1 Minute</strong> : 
                </p><h3>${OTP}</h3><br><p>Thank You....!👍 This is Automatic Mail Plz Don't Reply </p>`,
        text: "Thank You.... !",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error sending email", error });
        } else {
          return res.status(200).json({
            message: "Email verified. OTP sent to email.",
            success: true,
            info,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const verifyOtp = (req, res) => {
  const { code } = req.body;
  const currentTime = Date.now();
  const otpCreatedTime = req.app.locals.otpCreatedTime;

  if (!otpCreatedTime || currentTime > otpCreatedTime + OTP_EXPIRATION_TIME) {
    return res.status(400).send({ error: "OTP has expired" });
  }

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.otpCreatedTime = null; // reset the OTP creation time
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verified successfully!" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
};

const createResetSession = (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email: String(email) });
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne(
      { email: user.email },
      { password: hashedPassword }
    );
    req.app.locals.resetSession = false; // reset session
    return res.status(201).send({ msg: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).send({ error: "Unable to reset password" });
  }
};

module.exports = {
  verifyEmail,
  verifyOtp,
  createResetSession,
  resetPassword,
};
