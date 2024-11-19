const bcrypt = require('bcryptjs');
const UserModel = require("../models/UserModel")

async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });

        // If user not found, return error
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true
            });
        }

        // Update user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await UserModel.updateOne({ email: user.email }, { password: hashedPassword });


        // Send response
        return res.status(200).json({
            message: "Password Reset Successfully",
            success: true,
            data: resetPassword
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true
        });
    }
}

module.exports = resetPassword