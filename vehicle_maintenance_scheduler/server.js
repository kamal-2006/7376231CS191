// Simple Express server for Vehicle Maintenance Scheduler Microservice
const express = require('express');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const logger = require('./middleware/logger');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const app = express();
app.use(express.json());

// Request logging middleware
app.use(logger);

// Mount routes at root so endpoint becomes GET /optimize-maintenance
app.use('/', maintenanceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vehicle Maintenance Scheduler service listening on port ${PORT}`);
});
