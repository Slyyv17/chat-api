const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/AppError');
const cloudinary = require('../utils/cloudinary');
const db = require('../db/models');

const uploadProfileImg = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  if (!req.file) {
    return next(new AppError('No image uploaded', 400));
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profiles' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });
    
  const [updated] = await db.user.update(
    { profileImg: result.secure_url },
    { where: { id: userId } }
  );

  if (!updated) {
    return next(new AppError('Failed to update profile image', 500));
  }

  const updatedUser = await db.user.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile image updated successfully',
    data: { user: updatedUser }
  });
});

module.exports = {
  uploadProfileImg
};