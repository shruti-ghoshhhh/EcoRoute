const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  description: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['reported', 'collected'], default: 'reported' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
