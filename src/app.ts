import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', bookRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

export default app;
