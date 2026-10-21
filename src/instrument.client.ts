import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
    dsn: "https://c8f3f91059853255d39bc8dcc4d2b3a5@o4510758181208064.ingest.de.sentry.io/4512277234974800",

    integrations: [Sentry.replayIntegration()],

    // Capture 100% of transactions for tracing.
    // Adjust this value in production.
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});