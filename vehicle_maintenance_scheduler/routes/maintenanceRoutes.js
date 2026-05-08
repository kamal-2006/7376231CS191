const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenanceController');

// GET /vehicles
router.get('/vehicles', controller.getVehicles);

// GET /optimize-maintenance?hours=8
router.get('/optimize-maintenance', controller.optimizeMaintenance);

module.exports = router;
