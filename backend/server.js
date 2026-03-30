const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const adminRoutes = require('./routes/adminRoutes');
const routeRoutes = require('./routes/routeRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/feedback', feedbackRoutes);


app.get('/', (req, res) => {
  res.send('EcoRoute API is running...');
});

// Database Connection
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      // Use Mongo Atlas if explicitly provided in .env
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`🌍 Production MongoDB Atlas connected!`);
    } else {
      // Fallback: Spin up a full, local, in-memory MongoDB cluster!
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();

      await mongoose.connect(uri);
      console.log(`✅ Zero-Config Local MongoDB connected seamlessly at: ${uri}`);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
