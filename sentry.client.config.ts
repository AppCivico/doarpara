import * as Sentry from '@sentry/nuxt';

Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.2,

  // Session replay for debugging user sessions
  replaysSessionSampleRate: Number(process.env.SENTRY_REPLAY_SAMPLE_RATE) || 0,
  replaysOnErrorSampleRate: Number(process.env.SENTRY_ERROR_REPLAY_SAMPLE_RATE) || 1.0,

  beforeSend(event, hint) {
    // Facebook's In-App Browser fires a native bridge call on page unload;
    // if the WebView is already being torn down, Android throws this.
    const message = (hint?.originalException as Error)?.message ?? '';
    if (message.includes('Java object is gone')) return null;
    return event;
  },
});
