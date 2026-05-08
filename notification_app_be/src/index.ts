import express from 'express';
import { logger } from 'logging-middleware-package';
import { initializeDatabase } from './utils/database';
import notificationRoutes from './routes/notificationRoutes';
import { requestLogger, errorHandler, corsMiddleware } from './middleware/notificationMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsMiddleware);
app.use(requestLogger);

initializeDatabase();

app.get('/health', async (req, res) => {
  await logger.info('route', 'Health check endpoint accessed');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  await logger.info('service', `Server started on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
