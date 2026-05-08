// Simple request logging middleware
// Logs method, URL, response status and duration
module.exports = function logger(req, res, next) {
  const start = Date.now();
  // When response finishes, log details
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
};
