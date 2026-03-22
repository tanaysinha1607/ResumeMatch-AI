import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
      console.error('MongoDB connection error:', err);
      // Fallback start without DB
      app.listen(PORT, () => console.log(`Server running on port ${PORT} (No DB)`));
    });
} else {
  console.log('No MONGO_URI provided in .env');
  console.log('Starting server in fallback mode (Database features will not work until configured)');
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (No DB)`));
}
