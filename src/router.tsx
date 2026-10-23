import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";
import Clarity from "@microsoft/clarity";

export function getRouter() {
  const context = getContext();
  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <p>Not Found</p>,
    Wrap: ({ children }) => (
      <QueryClientProvider client={context.queryClient}>{children}</QueryClientProvider>
    ),
  });

  if (!router.isServer) {
    Clarity.init("z13e07689s");
    Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
