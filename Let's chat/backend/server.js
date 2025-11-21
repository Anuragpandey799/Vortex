require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const Message = require('./models/Message');
const User = require('./models/Users');
const channelRoutes = require("./routes/channelRoutes");

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
app.use("/channels", channelRoutes);

// Protected message fetch
app.get('/messages/:room', authMiddleware, async (req, res) => {
  const room = req.params.room;
  try {
    const msgs = await Message.find({ room }).sort({ createdAt: 1 }).limit(1000);
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// health route
app.get('/', (req, res) => res.send('Realtime chat backend with auth'));

// Create HTTP & Socket servers
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] }
});

// Socket auth middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error: token required'));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return next(new Error('Authentication error: user not found'));

    socket.user = user;
    next();
  } catch (err) {
    console.error('socket auth error', err);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id, 'user:', socket.user.username);

  // join room
  socket.on('join_room', (room) => {
    socket.join(room);
  });

  // leave room
  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  // ✅ REALTIME CHANNEL CREATION
  socket.on("create_channel", (channelData) => {
    // Broadcast to all users so channels update live
    io.emit("new_channel", channelData);
  });

  // handle incoming chat message
  socket.on('send_message', async (payload) => {
    try {
      const { room, text } = payload;
      if (!room || !text) return;

      const message = new Message({
        room,
        userId: socket.user._id,
        username: socket.user.username,
        text
      });

      await message.save();

      io.to(room).emit('receive_message', message);
    } catch (err) {
      console.error('send_message error', err);
    }
  });

  socket.on('disconnect', () => {
    // optional
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
