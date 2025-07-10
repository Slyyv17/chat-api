// 📦 Core imports
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// 📦 Routes and Config
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const messageRoute = require('./routes/messageRoute');
const requestRouter = require('./routes/requestRoute');
const catchAsync = require('./errors/catchAsync');
const AppError = require('./errors/AppError');
const globalErrorHandler = require('./controller/errorController');
const { connectToMongo, getDB } = require('./config/connect');

const app = express();
const server = http.createServer(app);

// 🧠 Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

// ✅ Connect MongoDB
connectToMongo();

// 📲 Real-time messaging logic (💥 Add your block here)
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('send_message', async (data) => {
    const db = getDB();
    const { senderId, receiverId, content } = data;

    const message = {
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date(),
    };

    const result = await db.collection('messages').insertOne(message);
    if (!result.acknowledged) return;

    // Emit to receiver
    io.to(receiverId).emit('receive_message', {
      ...message,
      _id: result.insertedId,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// 🔧 Middleware
app.use(express.json());

// 🌐 Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API!',
  });
});
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/request', requestRouter);
app.use('/api/v1/message', messageRoute);

// 404 fallback
app.use(
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

// 🛠️ Global error handler
app.use(globalErrorHandler);

// 🚀 Start server (with sockets!)
const PORT = process.env.APP_PORT || 6000;
server.listen(PORT, () => {
  console.log(`🚀 Server and Socket.IO running on port ${PORT}`);
});