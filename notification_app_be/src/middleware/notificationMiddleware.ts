import { logger } from 'logging-middleware-package';

export async function requestLogger(req: any, res: any, next: any) {
  const startTime = Date.now();
  const { method, path, ip } = req;

  try {
    await logger.debug('middleware', `${method} ${path}`);

    res.on('finish', async () => {
      const duration = Date.now() - startTime;

      if (res.statusCode >= 400) {
        await logger.warn('middleware', `${method} ${path} - ${res.statusCode} (${duration}ms)`);
      } else {
        await logger.debug('middleware', `${method} ${path} - ${res.statusCode} (${duration}ms)`);
      }
    });

    next();
  } catch (error: any) {
    await logger.error('middleware', `Request logging error: ${error.message}`);
    next();
  }
}

export async function errorHandler(error: any, req: any, res: any, next: any) {
  await logger.error('middleware', `Error in ${req.method} ${req.path}: ${error.message}`);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
}

export async function corsMiddleware(req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}
