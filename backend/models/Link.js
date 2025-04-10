const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    unique: true,
    sparse: true,
  },
  expirationDate: {
    type: Date,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
  }
}, {
  timestamps: true
});

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;