const asyncHandler = require('express-async-handler');
const {
    MessageModel,
    ConversationModel
} = require('../models/ConversationModel');

// @desc    Clear chat history
// @route   DELETE /api/messages/clear
// @access  Private
const clearChatHistory = asyncHandler(async(req, res) => {
    const { senderId, receiverId } = req.body;

    // Find the conversation between the sender and receiver
    const conversation = await ConversationModel.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });

    if (conversation) {
        // Delete all messages in this conversation
        await MessageModel.deleteMany({ _id: { $in: conversation.messages } });

        // Clear the messages array in the conversation document
        conversation.messages = [];
        await conversation.save();

        res.status(200).json({ message: 'Chat history cleared' });
    } else {
        res.status(404).json({ message: 'Conversation not found' });
    }
});

module.exports = { clearChatHistory };