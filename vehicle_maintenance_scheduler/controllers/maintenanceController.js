const apiService = require('../services/apiService');
const optimizer = require('../services/optimizer');

/**
 * Controller for GET /optimize-maintenance
 * Query param: hours (optional if DEFAULT_AVAILABLE_HOURS set in .env)
 */
async function optimizeMaintenance(req, res) {
  try {
    const hoursParam = req.query.hours || process.env.DEFAULT_AVAILABLE_HOURS;
    if (!hoursParam) {
      return res.status(400).json({ error: 'Provide available hours via query `hours` or DEFAULT_AVAILABLE_HOURS in .env' });
    }

    const hours = parseInt(hoursParam, 10);
    if (isNaN(hours) || hours <= 0) {
      return res.status(400).json({ error: '`hours` must be a positive integer' });
    }

    let depotsData = [];
    try {
      depotsData = await apiService.fetchDepots();
    } catch (depErr) {
      console.warn('Warning: failed to fetch depots:', depErr.message);
    }

    


    return res.status(200).json({
      depots: depotsData,
    });
  } catch (err) {
    console.error('Error in optimizeMaintenance:', err);
    return res.status(500).json({ error: 'Failed to optimize maintenance', details: err.message });
  }
}

/**
 * Controller for GET /vehicles
 * Returns the protected external vehicles API response.
 */
async function getVehicles(req, res) {
  try {
    const vehiclesData = await apiService.fetchVehicles();
    return res.status(200).json(vehiclesData);
  } catch (err) {
    console.error('Error in getVehicles:', err);
    return res.status(500).json({ error: 'Failed to fetch vehicles', details: err.message });
  }
}

module.exports = { optimizeMaintenance, getVehicles };
