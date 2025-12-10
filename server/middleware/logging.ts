export default defineEventHandler((event) => {
  const start = Date.now();
  const url = event.path;
  const method = event.method;
  const userAgent = getHeader(event, 'user-agent') || 'unknown';
  const ip = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-forwarded-for') || 'unknown';

  // Log incoming request
  console.log(`[Request] ${method} ${url}`, {
    ip,
    userAgent: userAgent.substring(0, 100), // Truncate long user agents
    timestamp: new Date().toISOString(),
  });

  // Track response
  event.node.res.on('finish', () => {
    const duration = Date.now() - start;
    const status = event.node.res.statusCode;
    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'log';

    console[logLevel](`[Response] ${method} ${url} - ${status} (${duration}ms)`, {
      status,
      duration,
      timestamp: new Date().toISOString(),
    });
  });

  // Catch errors that might not be properly handled
  event.node.res.on('error', (error) => {
    console.error(`[Error] ${method} ${url}`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  });
});
