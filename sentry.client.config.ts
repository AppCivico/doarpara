import * as Sentry from '@sentry/nuxt';

Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,

  // Tag every event with the human-readable app version, alongside
  // Sentry's own release (which is the git SHA, tied to sourcemap upload —
  // left as-is so stack traces keep resolving).
  initialScope: {
    tags: { app_version: process.env.APP_VERSION },
  },

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.2,

  // Session replay for debugging user sessions
  replaysSessionSampleRate: Number(process.env.SENTRY_REPLAY_SAMPLE_RATE) || 0,
  replaysOnErrorSampleRate: Number(process.env.SENTRY_ERROR_REPLAY_SAMPLE_RATE) || 1.0,

  beforeSend(event, hint) {
    // Facebook/Instagram's in-app browser fires a native bridge call on page
    // hide/unload — a Java object on Android, window.webkit.messageHandlers
    // on iOS; if that bridge is already torn down, it throws. Wording and
    // platform vary ("Java object is gone", "undefined is not an object
    // (evaluating 'window.webkit.messageHandlers')", ...), but every variant
    // routes through Meta's own sendDataToNative relay function, so key off
    // that instead of chasing each new message/platform.
    const stack = (hint?.originalException as Error)?.stack ?? '';
    if (stack.includes('sendDataToNative')) return null;
    return event;
  },
});
