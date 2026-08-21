import { readFileSync } from 'node:fs';
import * as Sentry from '@sentry/nuxt';

let version = 'unknown';
try {
  version = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')).version;
} catch { /* non-fatal */ }

Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,

  // Tag every event with the human-readable app version, alongside
  // Sentry's own release (which is the git SHA, tied to sourcemap upload —
  // left as-is so stack traces keep resolving).
  initialScope: {
    tags: { app_version: version },
  },

  // Performance monitoring
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.2,

  // Capture more context for server errors
  beforeSend(event, hint) {
    // Add extra context for debugging
    if (event.exception) {
      console.error('[Sentry] Capturing server error:', {
        message: event.exception.values?.[0]?.value,
        type: event.exception.values?.[0]?.type,
        url: event.request?.url,
      });
    }
    return event;
  },

});
