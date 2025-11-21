const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // denormalized for quick display
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Message', MessageSchema);
