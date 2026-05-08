# Logging Middleware Package

A reusable, production-ready logging middleware for TypeScript/JavaScript applications that captures application lifecycle events and sends them to a centralized logging server.

## Features

✅ **Unified Logging** - Single interface for both backend and frontend applications
✅ **Type-Safe** - Full TypeScript support with strict typing
✅ **Simple API** - Easy-to-use `Log(stack, level, package, message)` function
✅ **Remote Logging** - Sends logs to test server for centralized monitoring
✅ **Local Fallback** - Console logging for development and debugging
✅ **Error Handling** - Graceful error handling with retry logic
✅ **Reusable Package** - Can be consumed by any TypeScript/JavaScript project

## Installation

```bash
npm install logging-middleware-package
```

## Usage

### Basic Setup (Backend)

```typescript
import { logger } from 'logging-middleware-package';

// Simple logging
await logger.log('backend', 'info', 'controller', 'User registration started');
await logger.log('backend', 'error', 'service', 'Database connection failed');
```

### Using Convenience Methods (Backend)

```typescript
import { logger } from 'logging-middleware-package';

// Info logging
await logger.info('controller', 'Notification created successfully');

// Warning logging
await logger.warn('service', 'Rate limit approaching');

// Error logging
await logger.error('handler', 'received string, expected bool');

// Fatal logging
await logger.fatal('service', 'Critical system failure');

// Debug logging
await logger.debug('repository', 'Executing database query');
```

### Frontend Usage

```typescript
import { logger } from 'logging-middleware-package';

// Frontend logs
await logger.log('frontend', 'info', 'component', 'User dashboard rendered');
await logger.log('frontend', 'error', 'api', 'Failed to fetch notifications');
```

### Custom Configuration

```typescript
import { Logger } from 'logging-middleware-package';

const customLogger = new Logger({
  apiUrl: 'http://your-custom-server/logs',
  timeout: 10000,
  silentMode: false,
});

await customLogger.info('service', 'Custom logger initialized');
```

## API Reference

### Log Function

```typescript
log(stack: Stack, level: LogLevel, package: string, message: string): Promise<LogResponse>
```

**Parameters:**
- `stack` - 'backend' or 'frontend'
- `level` - 'debug', 'info', 'warn', 'error', 'fatal'
- `package` - Package/module name (e.g., 'controller', 'service', 'handler')
- `message` - Descriptive log message

**Returns:** Promise with `{ logID: string, message: string }`

### Convenience Methods

```typescript
// All return Promise<LogResponse | null>
debug(pkg: string, message: string, stack?: Stack)
info(pkg: string, message: string, stack?: Stack)
warn(pkg: string, message: string, stack?: Stack)
error(pkg: string, message: string, stack?: Stack)
fatal(pkg: string, message: string, stack?: Stack)
```

## Log Levels

| Level | Severity | Use Case |
|-------|----------|----------|
| `debug` | Low | Detailed diagnostic information |
| `info` | Low-Medium | General informational messages |
| `warn` | Medium | Potential issues that should be investigated |
| `error` | High | Error conditions requiring attention |
| `fatal` | Critical | Critical errors causing system failure |

## Supported Packages

### Backend Only
- `cache` - Caching operations
- `cron_job` - Scheduled jobs
- `db` - Database operations
- `domain` - Domain logic
- `repository` - Data access layer

### Frontend Only
- `component` - React/UI components
- `hook` - Custom React hooks
- `page` - Page components
- `state` - State management
- `style` - Styling related

### Both Backend & Frontend
- `api` - API calls and handlers
- `auth` - Authentication/authorization
- `config` - Configuration
- `controller` - Controllers/handlers
- `middleware` - Middleware functions
- `route` - Route definitions
- `service` - Business logic
- `utils` - Utility functions

## Examples

### Backend Controller Example

```typescript
import { logger } from 'logging-middleware-package';

export async function createNotification(req, res) {
  try {
    await logger.info('controller', `Creating notification for user ${req.user.id}`);
    
    const notification = await notificationService.create(req.body);
    
    await logger.info('controller', `Notification ${notification.id} created successfully`);
    
    res.json({ success: true, data: notification });
  } catch (error) {
    await logger.error('controller', `Failed to create notification: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Backend Service Example

```typescript
import { logger } from 'logging-middleware-package';

export async function sendNotification(notificationId: string) {
  try {
    await logger.debug('service', `Processing notification ${notificationId}`);
    
    const notification = await getNotification(notificationId);
    const user = await getUser(notification.userId);
    
    await logger.info('service', `Sending notification to ${user.email}`);
    
    await emailService.send(user.email, notification);
    
    await logger.info('service', `Notification ${notificationId} sent successfully`);
  } catch (error) {
    await logger.error('service', `Failed to send notification: ${error.message}`);
    throw error;
  }
}
```

### Frontend Component Example

```typescript
import { logger } from 'logging-middleware-package';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await logger.debug('component', 'NotificationCenter mounted');
        
        const response = await fetch('/api/notifications');
        const data = await response.json();
        
        setNotifications(data);
        
        await logger.info('component', `Loaded ${data.length} notifications`);
      } catch (error) {
        await logger.error('component', `Failed to load notifications: ${error.message}`);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-center">
      {notifications.map(n => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
}
```

### Error Handling Example

```typescript
import { logger } from 'logging-middleware-package';

export async function processPayment(paymentData) {
  try {
    await logger.info('service', 'Starting payment processing');
    
    const result = await paymentGateway.charge(paymentData);
    
    await logger.info('service', `Payment processed successfully: ${result.id}`);
    
    return result;
  } catch (error) {
    // Log different severity based on error type
    if (error.code === 'NETWORK_ERROR') {
      await logger.warn('service', `Network error during payment: ${error.message}`);
    } else if (error.code === 'INVALID_CARD') {
      await logger.error('service', `Invalid payment method: ${error.message}`);
    } else {
      await logger.fatal('service', `Critical payment failure: ${error.message}`);
    }
    
    throw error;
  }
}
```

## Integration Points

### With Express Backend

```typescript
import { logger } from 'logging-middleware-package';
import express from 'express';

const app = express();

// Custom middleware to log all requests
app.use(async (req, res, next) => {
  await logger.info('middleware', `${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use(async (err, req, res, next) => {
  await logger.error('middleware', `Request error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});
```

### With React Frontend

```typescript
import { logger } from 'logging-middleware-package';

// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('component', `React error: ${error.message}`);
  }

  render() {
    return this.props.children;
  }
}
```

## Best Practices

1. **Be Specific** - Use descriptive messages that clearly indicate what happened
   ```typescript
   // Good
   await logger.error('service', 'Failed to fetch user data from database');
   
   // Bad
   await logger.error('service', 'Error');
   ```

2. **Include Context** - Add relevant IDs or identifiers
   ```typescript
   await logger.info('controller', `User ${userId} updated profile`);
   ```

3. **Use Appropriate Levels** - Match severity to actual impact
   ```typescript
   await logger.debug('service', 'Query parameters received');
   await logger.warn('service', 'Cache miss for frequently accessed resource');
   await logger.error('service', 'Database connection lost');
   ```

4. **Log Entry & Exit** - Track function flow for debugging
   ```typescript
   async function processNotification(id) {
     await logger.debug('service', `Processing notification ${id}`);
     // ... processing code ...
     await logger.debug('service', `Completed notification ${id}`);
   }
   ```

5. **Error Context** - Include error details in error logs
   ```typescript
   await logger.error('service', `Payment failed: ${error.message}`);
   ```

## Testing

```bash
npm run build
npm run test
```

## Troubleshooting

### Logs Not Appearing

1. Check if the API server is running at the configured URL
2. Verify network connectivity
3. Ensure firewall allows outbound requests
4. Check logger configuration

### Silent Mode

To disable local console logging:

```typescript
logger.setSilentMode(true);
```

### Custom API URL

```typescript
logger.setApiUrl('http://your-custom-server/logs');
```

## Performance Considerations

- Logging is asynchronous to prevent blocking operations
- Each log call returns a Promise - use `await` or `.catch()` to handle failures
- For high-frequency logging, consider batching logs
- Silent mode can improve performance in production if only remote logging is needed

## License

MIT

## Support

For issues, questions, or contributions, please contact the development team.
