const { user } = require("../db/models");
const bcrypt = require("bcrypt");
const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const generateUserToken = require("../utils/generateUserToken");
const { Op } = require('sequelize');


const signupUser = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
  
    // You can add input validation here if needed
  
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      return next(new AppError('User with this username already exists', 400));
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
    });
  
    if (!newUser) {
      return next(new AppError('Failed to create user!', 400));
    }
  
    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;
  
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: result,
      },
    });
});

const loginUser = catchAsync(async (req, res, next) => {
    const { identifier, password } = req.body; // 'identifier' can be username or email

    if (!identifier || !password) {
      return next(new AppError('Please provide username/email and password', 400));
    }

    // Find user by username OR email
    const userData = await user.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });

    if (!userData) {
      return next(new AppError('Invalid username/email or password', 401)); // generic error
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid username/email or password', 401)); // generic error
    }

    const result = userData.toJSON();
    delete result.password;
    delete result.deletedAt;

    const token = generateUserToken(result.id, result.username, result.email);

    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      token,
      user: result,
    });
});

module.exports = {
    signupUser,
    loginUser
}