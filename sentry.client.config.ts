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

  beforeSend(event) {
    // Meta's own scripts throwing on deferred callbacks that outlive their
    // target: their in-app-browser bridge (Android Java object / iOS
    // window.webkit.messageHandlers, wording varies) firing on page
    // hide/unload after the WebView is already torn down, and their
    // Business Extension signals script (/signals/iwl.js) firing a
    // requestAnimationFrame callback after its target element is gone.
    // None of this is reachable from our code — key off the frame data
    // Sentry already resolved (more reliable than the raw stack string,
    // which varies by browser and is often empty for parse errors like
    // "Unexpected end of input") rather than chasing every message/platform.
    const frames = event.exception?.values?.flatMap((v) => v.stacktrace?.frames ?? []) ?? [];
    const isMetaScriptNoise = frames.some((f) => f.function === 'sendDataToNative'
      || f.filename?.startsWith('iabjs://')
      || f.filename?.includes('/signals/iwl.js'));
    if (isMetaScriptNoise) return null;
    return event;
  },
});
