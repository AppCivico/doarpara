import * as Sentry from '@sentry/nuxt';

// Temporarily disabled to test CPU usage
// Sentry.init({
//   dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,

//   // Performance monitoring
//   tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.2,

//   // Capture more context for server errors
//   beforeSend(event, hint) {
//     // Add extra context for debugging
//     if (event.exception) {
//       console.error('[Sentry] Capturing server error:', {
//         message: event.exception.values?.[0]?.value,
//         type: event.exception.values?.[0]?.type,
//         url: event.request?.url,
//       });
//     }
//     return event;
//   },

//   // Enable debugging in development
//   debug: process.env.NODE_ENV === 'development',
// });
