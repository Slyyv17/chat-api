require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/authRoute');
const catchAsync = require('./errors/catchAsync');
const AppError = require('./errors/AppError');
const globalErrorHandler = require('./controller/errorController');
const userRoute = require('./routes/userRoute');
const requestRouter = require('./routes/requestRoute');
const { connectToMongo } = require('./config/connect');

const app = express();

connectToMongo();

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the API!'
    });
})

app.use(express.json());

// all routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/request', requestRouter);

app.use(
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
)

// error global handler
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})