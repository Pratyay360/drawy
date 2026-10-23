import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
    dsn: "https://0a5766dad9c9a5fb9356372246bd2073@o4510758181208064.ingest.de.sentry.io/4512278565027920",

    integrations: [Sentry.replayIntegration()],

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions, plus for 100% of sessions with an error.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});