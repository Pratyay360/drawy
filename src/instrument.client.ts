import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
    dsn: "https://0a5766dad9c9a5fb9356372246bd2073@o4510758181208064.ingest.de.sentry.io/4512278565027920",

    integrations: [Sentry.replayIntegration()],

	tracesSampleRate: 1.0,

	replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
