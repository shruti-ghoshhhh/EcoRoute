const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  category: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Route', 'Completed'],
    default: 'Pending',
  },
  pickupId: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

pickupSchema.pre('save', function () {
  if (!this.pickupId) {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.pickupId = `PK-${randomChars}`;
  }
});

module.exports = mongoose.model('Pickup', pickupSchema);
