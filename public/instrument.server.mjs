import * as Sentry from '@sentry/nuxt';

Sentry.init({
  dsn: process.env.SENTRY_DSN_PUBLIC || process.env.SENTRY_DSN,
});
