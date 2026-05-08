# Vehicle Maintenance Scheduler Microservice

This microservice optimizes vehicle maintenance tasks to maximize operational impact given available mechanic-hours using the 0/1 Knapsack dynamic programming algorithm.

Features:
- Node.js + Express server
- Axios for fetching tasks/depots from external APIs
- Logging middleware
- 0/1 Knapsack optimizer (Dynamic Programming)
- No database required

Setup
1. Copy and update the `.env` file with real API endpoints for `TASKS_API_URL` and `DEPOTS_API_URL`.
2. Install dependencies:

```bash
cd notification_app_be
npm install
```

Run

```bash
# Start server
node server.js

# Or for development (if you have nodemon):
npm run dev
```

API
- GET /optimize-maintenance?hours=8

Query parameters:
- `hours` (optional): available mechanic-hours. If not provided, `DEFAULT_AVAILABLE_HOURS` from `.env` will be used.

Response example:

```json
{
  "selectedTasks": [
    { "vehicleId": "V101", "duration": 3, "impactScore": 50 }
  ],
  "totalHours": 3,
  "totalImpact": 50
}
```

Notes
- The service expects the external tasks API to return an array of objects containing fields for vehicle id, duration, and impact score. Common field names are handled (`vehicleId`, `vehicle_id`, `id`, `duration`, `hours`, `impactScore`, `impact_score`, `score`).
- Durations are treated as hours. Non-integer durations will be rounded conservatively for capacity accounting.

Authentication
- The depots endpoint requires a Bearer token. Set `BEARER_TOKEN` in your `.env`:

```env
BEARER_TOKEN=YOUR_BEARER_TOKEN
```

Example curl for the depots endpoint:

```bash
curl -X GET "http://4.224.186.213/evaluation-service/depots" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN"
```

Base URL and paths
- You can either set full URLs for `DEPOTS_API_URL` and `TASKS_API_URL`, or set a single `BASE_API_URL` with `DEPOTS_PATH` and `TASKS_PATH`.

Example `.env` options:

```env
# Full URLs (explicit)
DEPOTS_API_URL=http://4.224.186.213/evaluation-service/depots
TASKS_API_URL=http://4.224.186.213/evaluation-service/tasks

# Or base + paths (the service will construct the URLs)
BASE_API_URL=http://4.224.186.213
DEPOTS_PATH=/evaluation-service/depots
TASKS_PATH=/evaluation-service/tasks
```
