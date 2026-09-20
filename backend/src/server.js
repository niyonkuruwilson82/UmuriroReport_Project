import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';
import faultRoutes from './routes/faultRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

fs.mkdirSync('uploads', { recursive: true });

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (_,res) => res.json({message:'UmuriroReport API is running'}));
app.use('/api/auth', authRoutes);
app.use('/api/faults', faultRoutes);

app.use((err,req,res,next) => {
  console.error(err);
  res.status(500).json({message:'Server error'});
});

app.listen(PORT, '0.0.0.0', () => console.log(`UmuriroReport backend running on http://0.0.0.0:${PORT}`));