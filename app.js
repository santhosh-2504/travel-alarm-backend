import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import authRoutes from './routes/authRoutes.js';
import alarmRoutes from './routes/alarmRouter.js';

// Create Express app
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alarms', alarmRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'TravelAlarm'
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });
  

export default app;