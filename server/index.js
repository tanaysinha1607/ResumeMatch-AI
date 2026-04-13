import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());
app.use('/api', limiter); // Apply rate limiter only to API routes

// Routes
app.use('/api', apiRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeMatch AI Server is running' });
});

const PORT = process.env.PORT || 5000;

console.log("DEBUG ENV STATUS: ", process.env.MONGO_URI ? "Has URI" : "Empty URI");

// Since user may not have MongoDB URI yet, we'll gracefully handle it
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.log('TIP: If this is a timeout, check if your IP is whitelisted in MongoDB Atlas.');
      // Fallback start without DB
      app.listen(PORT, () => console.log(`Server running on port ${PORT} (Database Offline)`));
    });
} else {
  console.log('No MONGO_URI provided in .env');
  console.log('Starting server in fallback mode (Database features will not work until configured)');
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (No DB)`));
}
