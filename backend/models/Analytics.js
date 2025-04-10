const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    userAgent: String
  },
  urlClicked: String
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;