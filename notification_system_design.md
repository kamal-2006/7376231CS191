# Notification System Design

## Architecture

Client → Express Server → Controller → Logging Middleware

## Components

1. Express Backend
2. Logging Middleware
3. Notification API
4. Error Handling

## Logging Strategy

Logs are captured for:
- API Requests
- Errors
- Warnings
- Successful Operations

## API Endpoints

POST /api/notifications
GET /api/notifications
DELETE /api/notifications/:id

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Axios