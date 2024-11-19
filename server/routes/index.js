const express = require("express");
const registerUserVerify = require("../controller/registerUserVerify");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");
const authController = require("../controller/authController");
const friendController = require("../controller/friendController");
const verifyToken = require("../helpers/verifyToken");
const messageController = require("../controller/messageController");
const router = express.Router();

// create user api
router.post("/register-user", registerUserVerify.registerUser);
router.post("/register-otp", registerUserVerify.registerVerifyOtp);
router.post("/register-session", registerUserVerify.registerCreateResetSession);
// check user email
router.post("/email", checkEmail);
// check user password
router.post("/password", checkPassword);
// login user details
router.get("/user-details", userDetails);
// logout user
router.get("/logout", logout);
// update user details
router.post("/update-user", updateUserDetails.updateUserDetails);
// delete user photo
router.post("/delete-photo", updateUserDetails.deletePhoto);
// search user
router.post("/search-user", searchUser);
// reset password
router.post("/verify-email", authController.verifyEmail);
router.post("/verify-otp", authController.verifyOtp);
router.get("/create-reset-session", authController.createResetSession);
router.post("/reset-password", authController.resetPassword);

// delete a friend
router.delete("/friends/:id", verifyToken, friendController.deleteFriend);
router.delete("/messages/:id", verifyToken, friendController.deleteMessage);
router.delete("/clear", verifyToken, messageController.clearChatHistory);

module.exports = router;
