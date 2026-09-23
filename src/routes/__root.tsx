import { Theme } from "@astryxdesign/core";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlobalDialogs } from "../components/global-dialogs";
import { useTheme } from "../hooks/usetheme";
import { themeRegistry } from "../themes/index";
import "../styles.css";

/**
 * Restores the persisted theme + mode before first paint (no flash).
 * Mirrors readStored* / getEffectiveMode in hooks/usetheme.ts.
 */
const themeScript = `(function(){try{var n=localStorage.getItem("drawy-theme");var names=["butter","neutral","matcha","stone","y2k","gothic"];if(!n||names.indexOf(n)<0){n="butter";}var darkOnly={gothic:1};var p=localStorage.getItem("drawy-theme-mode")||"system";var m;if(darkOnly[n]){m="dark";}else if(p==="light"||p==="dark"){m=p;}else{m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;r.classList.toggle("dark",m==="dark");r.dataset.theme=m;r.dataset.appTheme=n;r.style.colorScheme=m;}catch(e){}})();`;

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

function AppThemeProvider({ children }: { children: React.ReactNode }) {
	const { themeName, modePreference } = useTheme();
	const entry = themeRegistry[themeName];
	return (
		<Theme theme={entry.theme} mode={entry.darkOnly ? "dark" : modePreference}>
			{children}
		</Theme>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<HeadContent />
			</head>
			<body>
				<AppThemeProvider>
					{children}
					<GlobalDialogs />
				</AppThemeProvider>
				<Devtools />
				<Scripts />
			</body>
		</html>
	);
}
