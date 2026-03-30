const mongoose = require('mongoose');

const routeLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  transportMode: {
    type: String,
    enum: ['Walking', 'Biking', 'Transit', 'Carpool'],
    required: true,
  },
  emissionsSaved: { 
    type: Number, // Measured in kilograms of CO2
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('RouteLog', routeLogSchema);
