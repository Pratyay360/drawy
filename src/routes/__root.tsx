import { AppShell } from "@astryxdesign/core/AppShell";
import { Button } from "@astryxdesign/core/Button";
import { Center } from "@astryxdesign/core/Center";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { AppThemeProvider } from "../components/app-theme-provider";
import { GlobalDialogs } from "../components/global-dialogs";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
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
    notFoundComponent: RootNotFound,
});

function RootNotFound() {
    return (
        <AppShell height="auto" contentPadding={0} topNav={<SiteHeader />}>
            <Center axis="horizontal" padding={4} width="100%">
                <VStack gap={4} maxWidth={480}>
                    <EmptyState
                        headingLevel={1}
                        title="404 — Page not found"
                        description="The page you are looking for does not exist, or it has moved somewhere else."
                        icon={<Icon icon={Compass} size="lg" />}
                        actions={
                            <HStack align="center" gap={3} wrap="wrap">
                                <Button label="Go to your drawings" href="/" variant="primary" />
                                <Button
                                    label="Read the help centre"
                                    href="/help"
                                    variant="secondary"
                                />
                            </HStack>
                        }
                    />
                </VStack>
            </Center>
            <SiteFooter />
        </AppShell>
    );
}

function Devtools() {
    const [DevtoolsComponent, setDevtoolsComponent] = useState<React.ComponentType | null>(null);

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
                <AppThemeProvider>
                    {children}
                    <GlobalDialogs />
                </AppThemeProvider>
                <Devtools />
                <Scripts />
                <script
                    src="https://analytics.ahrefs.com/analytics.js"
                    data-key="GYIovnnXwTlF25Efzy2rrw"
                    async
                ></script>
            </body>
        </html>
    );
}