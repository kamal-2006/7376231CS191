# Campus Notifications Microservice Backend

A production-ready notification system designed for campus notification platform serving 50,000+ students.

## Features

- RESTful API for notification management
- SQLite database with WAL mode for high performance
- Priority-based notifications (low, medium, high)
- Broadcast notifications to all students
- Student-specific notifications
- Unread notification tracking
- Pagination support for large datasets
- Comprehensive logging and monitoring
- Type-safe TypeScript implementation

## Setup

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Notification Management

- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/single/:id` - Get notification by ID
- `GET /api/notifications/student/:studentID` - Get student notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/:id/priority` - Update notification priority
- `DELETE /api/notifications/:id` - Delete notification

### Broadcast

- `POST /api/notifications/broadcast/all` - Send to all students

### Filtering & Queries

- `GET /api/notifications/type/:type` - Get notifications by type
- `GET /api/notifications/priority/:priority` - Get notifications by priority
- `GET /api/notifications/student/:studentID/unread` - Get unread count

### Administration

- `POST /api/notifications/init/sample-data` - Initialize sample data
- `GET /health` - Health check

## Database Schema

### students
- studentID (TEXT PRIMARY KEY)
- email (TEXT)
- name (TEXT)
- createdAt (TIMESTAMP)

### notifications
- id (TEXT PRIMARY KEY)
- studentID (FOREIGN KEY)
- notificationType (TEXT)
- placementType (TEXT)
- message (TEXT)
- priority (TEXT)
- read (INTEGER)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

## Performance Features

- WAL (Write-Ahead Logging) mode for concurrent access
- Indexed queries on frequently searched columns
- Pagination with configurable page size
- Optimized database schema for 50,000+ students
- Connection pooling

## Logging

Integrated with centralized logging middleware for:
- Request/response tracking
- Error logging and monitoring
- Performance monitoring
- Audit trails

## Notification Types

- Alert
- Info
- Warning
- Event
- Placement
- Academic

## Priority Levels

- low
- medium
- high

## Response Format

### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Requests

### Create Notification
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "studentID": "STU000001",
    "notificationType": "placement",
    "placementType": "event",
    "message": "New placement opportunity",
    "priority": "high"
  }'
```

### Broadcast to All Students
```bash
curl -X POST http://localhost:3000/api/notifications/broadcast/all \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": "notif_123",
    "notification_type": "event",
    "notification_type_enum": "event",
    "placement_type_enum": "event",
    "message": "Important announcement"
  }'
```

### Get Student Notifications
```bash
curl http://localhost:3000/api/notifications/student/STU000001?page=1&pageSize=10
```

## Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic implementation
- **Database**: SQLite with optimized schema
- **Middleware**: CORS, logging, error handling
- **Types**: TypeScript interfaces and types

---

**Status**: Production Ready
**Version**: 1.0.0
**Created**: May 8, 2026
