export default defineEventHandler((event) => {
  // Skip logging for static assets to reduce overhead
  const url = event.path;
  if (url.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|ico|map)$/)) {
    return;
  }

  const start = Date.now();
  const method = event.method;

  // Only log errors and slow requests in production
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development: log all requests
    console.log(`[Request] ${method} ${url}`);
  }

  // Track response
  event.node.res.on('finish', () => {
    const duration = Date.now() - start;
    const status = event.node.res.statusCode;

    // Production: only log errors or slow requests (>1000ms)
    if (isProduction) {
      if (status >= 500) {
        console.error(`[Error] ${method} ${url} - ${status} (${duration}ms)`);
      } else if (status >= 400) {
        console.warn(`[ClientError] ${method} ${url} - ${status} (${duration}ms)`);
      } else if (duration > 1000) {
        console.warn(`[Slow] ${method} ${url} - ${status} (${duration}ms)`);
      }
      // Log requests approaching CPU timeout (>5000ms suggests heavy processing)
      else if (duration > 5000) {
        console.warn(`[VerySlow] ${method} ${url} - ${status} (${duration}ms) - Possible CPU issue`);
      }
    } else {
      // Development: log everything
      const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'log';
      console[logLevel](`[Response] ${method} ${url} - ${status} (${duration}ms)`);
    }
  });

  // Catch uncaught errors (won't catch CPU limits, but will catch other errors)
  event.node.res.on('error', (error) => {
    const duration = Date.now() - start;
    console.error(`[UnhandledError] ${method} ${url} (${duration}ms)`, {
      message: error.message,
      name: error.name,
    });
  });
});
