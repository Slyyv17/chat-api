const { user, friendRequest } = require("../db/models");
const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/AppError");
const { Op } = require("sequelize");

const sendFriendRequest = catchAsync(async (req, res, next) => {
  const senderId = req.user.id;
  const { userId: receiverId } = req.params;

  if (parseInt(receiverId) === senderId) {
    return next(new AppError("You can't send a request to yourself", 400));
  }

  const receiver = await user.findByPk(receiverId);
  if (!receiver) {
    return next(new AppError("User not found", 404));
  }

  const existing = await friendRequest.findOne({
    where: {
      [Op.or]: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }
  });

  if (existing) {
    return next(new AppError("Friend request already exists or you're already friends", 400));
  }

  const request = await friendRequest.create({ senderId, receiverId });

  res.status(201).json({
    status: "success",
    message: "Friend request sent",
    data: request,
  });
});

const acceptFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;
  const { requestId } = req.params;

  const request = await friendRequest.findByPk(requestId);

  // 🔍 Log right after fetching
  // console.log('💡 Current user ID:', currentUserId);
  // console.log('📦 Friend request:', request);

  if (!request || request.receiverId !== currentUserId) {
    return next(new AppError("Friend request not found or unauthorized", 404));
  }

  if (request.status === "accepted") {
    return next(new AppError("Friend request already accepted", 400));
  }

  request.status = "accepted";
  await request.save();

  res.status(200).json({
    status: "success",
    message: "Friend request accepted",
    data: request,
  });
});


const rejectFriendRequest = catchAsync(async (req, res, next) => {
    const currentUserId = req.user.id;
    const { requestId } = req.params;
  
    const request = await friendRequest.findByPk(requestId);
  
    if (!request || request.receiverId !== currentUserId) {
      return next(new AppError("Friend request not found or unauthorized", 404));
    }

    if (request.status === "rejected") {
      return next(new AppError("Friend request already rejected", 400));
    }

    request.status = "rejected";
    await request.save();
  
    res.status(200).json({
      status: "success",
      message: "Friend request rejected",
      data: request,
    });
});

const cancelFriendRequest = catchAsync(async (req, res, next) => {
    const currentUserId = req.user.id;
    const { requestId } = req.params;
  
    const request = await friendRequest.findByPk(requestId);
  
    if (!request || request.senderId !== currentUserId) {
      return next(new AppError("Friend request not found or unauthorized", 404));
    }
  
    await request.destroy();
  
    res.status(200).json({
      status: "success",
      message: "Friend request cancelled",
    });
});

const getIncomingFriendRequests = catchAsync(async (req, res, next) => {
    const currentUserId = req.user.id;
  
    const requests = await friendRequest.findAll({
      where: { receiverId: currentUserId, status: "pending" },
      include: [{ model: user, as: "sender", attributes: ["id", "username"] }],
    });
  
    res.status(200).json({
      status: "success",
      data: requests,
    });
});

const getSentFriendRequests = catchAsync(async (req, res, next) => {
    const currentUserId = req.user.id;
  
    const requests = await friendRequest.findAll({
      where: { senderId: currentUserId, status: "pending" },
      include: [{ model: user, as: "receiver", attributes: ["id", "username"] }],
    });
  
    res.status(200).json({
      status: "success",
      data: requests,
    });
});



module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    // getFriendRequests,
    cancelFriendRequest,
    getSentFriendRequests,
    getIncomingFriendRequests,
}
