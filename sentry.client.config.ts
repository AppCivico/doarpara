import * as Sentry from '@sentry/nuxt';

Sentry.init({
  dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.2,

  // Session replay for debugging user sessions
  replaysSessionSampleRate: Number(process.env.SENTRY_REPLAY_SAMPLE_RATE) || 0,
  replaysOnErrorSampleRate: Number(process.env.SENTRY_ERROR_REPLAY_SAMPLE_RATE) || 1.0,
});
