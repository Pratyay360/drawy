import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		notFoundMode: "root",
		defaultNotFoundComponent: () => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "50vh",
					gap: 12,
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<h1>404 — Page not found</h1>
				<a href="/">Go home</a>
			</div>
		),
		Wrap: ({ children }) => (
			<QueryClientProvider client={context.queryClient}>
				{children}
			</QueryClientProvider>
		),
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
