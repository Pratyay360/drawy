import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
    dsn: "https://c8f3f91059853255d39bc8dcc4d2b3a5@o4510758181208064.ingest.de.sentry.io/4512277234974800",

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // Adjust this value in production.
    tracesSampleRate: 1.0,
});
