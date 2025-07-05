const jwt = require('jsonwebtoken');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/AppError');

const protectUser = catchAsync(async (req, res, next) => {
    // Check if the token is provided in the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    // Verify the token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    } catch (err) {
        console.error('Token verification failed:', err);
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
    
    // Attach user information to the request object
    req.user = { id: decoded.id };
    
    next();
});

module.exports = protectUser;