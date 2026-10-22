import * as Sentry from "@sentry/tanstackstart-react";

// This module is evaluated in global scope, before any request handler runs.
// The Sentry Node SDK starts timers and I/O inside init(), which the
// Cloudflare Workers runtime rejects in global scope (every request 500s), so
// server-side Sentry is skipped there. Client-side Sentry is unaffected.
const isWorkersRuntime =
	(typeof globalThis.navigator?.userAgent === "string" &&
		globalThis.navigator.userAgent.includes("Cloudflare")) ||
	typeof globalThis.caches?.default !== "undefined";

if (!isWorkersRuntime) {
	Sentry.init({
		dsn: "https://c8f3f91059853255d39bc8dcc4d2b3a5@o4510758181208064.ingest.de.sentry.io/4512277234974800",

		// Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
		// Adjust this value in production.
		tracesSampleRate: 1.0,
	});
}
