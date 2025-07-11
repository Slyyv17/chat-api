const { getDB } = require('../config/connect');
const AppError = require('../errors/AppError');
const catchAsync = require('../errors/catchAsync');

const sendMessage = catchAsync(async (req, res, next) => {
    const db = getDB();
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const { content } = req.body;

    const message = {
        senderId,
        receiverId,
        content,
        read: false,
    }

    const result = await db.collection('messages').insertOne(message);
    if (!result.acknowledged) {
        return next(new AppError('Failed to send message', 500));
    }

    res.status(201).json({
        status: 'success',
        message: 'Message sent successfully',
        data: {
            messageId: result.insertedId,
            ...message
        }
    })
});

const getMessages = catchAsync(async (req, res, next) => {
    const db = getDB();
    const currentUserId = String(req.user.id);
    const receiverId = String(req.params.receiverId);
  
    // Mark all messages from receiver to current user as read
    const updateResult = await db.collection('messages').updateMany(
      {
        senderId: receiverId,
        receiverId: currentUserId,
        read: false
      },
      { $set: { read: true } }
    );
    console.log('🔄 Matched:', updateResult.matchedCount);
    console.log('✅ Modified:', updateResult.modifiedCount);
  
    // Fetch messages both ways
    const messages = await db.collection('messages').find({
      $or: [
        { senderId: currentUserId, receiverId },
        { senderId: receiverId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }).toArray();
  
    res.status(200).json({
      status: 'success',
      data: { messages }
    });
});



module.exports = {
    sendMessage,
    getMessages,
}