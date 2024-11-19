const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");

const deleteFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    // Remove friend from user's friend list
    await ConversationModel.findByIdAndDelete(userId);

    // Optionally, remove user from friend's friend list (if bi-directional friendship)
    await ConversationModel.findByIdAndDelete(friendId);

    res.status(200).json({ message: "Friend Removed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageIds = req.params.id;
    await MessageModel.findByIdAndDelete(messageIds);
    res
      .status(200)
      .json({ success: true, message: "Message Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { deleteFriend, deleteMessage };
