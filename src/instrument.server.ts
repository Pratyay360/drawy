import * as Sentry from "@sentry/tanstackstart-react";

// Sentry client reports start a global timer, which Workers forbid.
const isCloudflareWorker =
    typeof navigator !== "undefined" && navigator.userAgent.includes("Cloudflare-Workers");

Sentry.init({
    dsn: "https://0a5766dad9c9a5fb9356372246bd2073@o4510758181208064.ingest.de.sentry.io/4512278565027920",

	tracesSampleRate: 1.0,

	sendClientReports: !isCloudflareWorker,
	enableRuntimeChannelInjection: !isCloudflareWorker,
});
