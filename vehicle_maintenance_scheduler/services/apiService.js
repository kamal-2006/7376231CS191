const axios = require('axios');

// URLs are provided via environment variables to avoid hardcoding.
// Support either full URL env vars or a BASE_API_URL + PATH combination.
function buildUrl(fullUrlEnv, baseEnv, pathEnv) {
  if (process.env[fullUrlEnv]) return process.env[fullUrlEnv];
  const base = process.env[baseEnv];
  const path = process.env[pathEnv];
  if (base && path) {
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  return undefined;
}

const DEPOTS_API_URL = buildUrl('DEPOTS_API_URL', 'BASE_API_URL', 'DEPOTS_PATH');
const TASKS_API_URL = process.env.TASKS_API_URL || `${process.env.BASE_API_URL?.replace(/\/$/, '')}/evaluation-service/tasks`;
const VEHICLES_API_URL = buildUrl('VEHICLES_API_URL', 'BASE_API_URL', 'VEHICLES_PATH');

function getAuthHeaders() {
  const token = process.env.BEARER_TOKEN;
  if (!token) throw new Error('BEARER_TOKEN not set in .env for protected API routes');
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function fetchProtectedResource(url, label) {
  if (!url) throw new Error(`${label} API URL not set in .env`);
  try {
    const res = await axios.get(url, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404 && label === 'Tasks') {
      console.warn(`Tasks API returned 404 at ${url} — returning empty task list`);
      return [];
    }
    throw new Error(`Failed to fetch ${label.toLowerCase()}: ${err.message}`);
  }
}

async function fetchDepots() {
  return fetchProtectedResource(DEPOTS_API_URL, 'Depots');
}

async function fetchTasks() {
  return fetchProtectedResource(TASKS_API_URL, 'Tasks');
}

async function fetchVehicles() {
  return fetchProtectedResource(VEHICLES_API_URL, 'Vehicles');
}

module.exports = { fetchDepots, fetchTasks, fetchVehicles };
