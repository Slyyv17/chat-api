const jwt = require('jsonwebtoken');

const generateUserToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_USER,
        {
            expiresIn: process.env.EXPIRATION_TIME_USER || '7d',
        }
    )
}

module.exports = generateUserToken;