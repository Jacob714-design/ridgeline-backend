import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import claimRoutes from './routes/claim.routes';
import projectRoutes from './routes/project.routes';
import estimateRoutes from './routes/estimate.routes';
import manufacturerRoutes from './routes/manufacturer.routes';
import codeRoutes from './routes/code.routes';
import documentRoutes from './routes/document.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', estimateRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/codes', codeRoutes);
app.use('/api/projects', documentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
  await prisma.$disconnect();
});

export { app, prisma };