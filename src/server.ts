// Must be imported first so Sentry is initialized before any other server code runs.
// Netlify/serverless deployments can't use the `--import` Node flag, so the
// instrumentation is loaded through the server entry point instead.
import "./instrument.server";

import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry(
    wrapFetchWithSentry({
        fetch(request: Request) {
            return handler.fetch(request);
        },
    }),
);