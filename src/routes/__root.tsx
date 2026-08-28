import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlobalDialogs } from "../components/global-dialogs";
import "../styles.css";

const themeScript = `(function(){try{var s=localStorage.getItem("drawy-theme");var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;r.style.colorScheme=t;}catch(e){}})();`;

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Drawy",
			},
			{
				name: "description",
				content: "Drawy — a collaborative drawing workspace.",
			},
		],
	}),
	shellComponent: RootDocument,
});

function Devtools() {
	const [DevtoolsComponent, setDevtoolsComponent] =
		useState<React.ComponentType | null>(null);

	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;
		Promise.all([
			import("@tanstack/react-devtools"),
			import("@tanstack/react-router-devtools"),
			import("../integrations/tanstack-query/devtools"),
		]).then(([dt, routerDt, queryDt]) => {
			setDevtoolsComponent(() => () => (
				<dt.TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <routerDt.TanStackRouterDevtoolsPanel />,
						},
						queryDt.default,
					]}
				/>
			));
		});
	}, []);

	if (!DevtoolsComponent) return null;
	return <DevtoolsComponent />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<HeadContent />
			</head>
			<body>
				{children}
				<GlobalDialogs />
				<Devtools />
				<Scripts />
			</body>
		</html>
	);
}
