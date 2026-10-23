import * as Sentry from "@sentry/tanstackstart-react";

/**
 * Cloudflare Workers forbid timers in the global scope: the isolate must not
 * touch async APIs before a request comes in. The Node SDK that backs
 * `@sentry/tanstackstart-react` starts a client-report interval while it
 * initialises, which throws "Disallowed operation called within global scope"
 * and takes the whole worker down.
 */
const isCloudflareWorker =
    typeof navigator !== "undefined" && navigator.userAgent.includes("Cloudflare-Workers");

Sentry.init({
    dsn: "https://0a5766dad9c9a5fb9356372246bd2073@o4510758181208064.ingest.de.sentry.io/4512278565027920",

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // Tracing must stay enabled for Sentry Agent Tracing (gen_ai spans) to be
    // captured. Adjust this value in production.
    tracesSampleRate: 1.0,

    // Client reports need a timer, so they are off on Workers.
    sendClientReports: !isCloudflareWorker,
});