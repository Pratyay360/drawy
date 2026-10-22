import { AppShell } from "@astryxdesign/core/AppShell";
import { Center } from "@astryxdesign/core/Center";
import { VStack } from "@astryxdesign/core/Stack";
import type { ReactNode } from "react";
import { SiteFooter } from "#/components/site-footer";
import { SiteHeader } from "#/components/site-header";

interface PublicPageProps {
    children: ReactNode;
    /**
     * Maximum content width in pixels. Prose reads best around 800, while
     * card grids want the full 960.
     */
    maxWidth?: number;
}

/**
 * Shared shell for every public page: top navigation, a centred content
 * column and the site footer. Keeps the marketing and legal pages on the
 * same frame.
 */
export function PublicPage({ children, maxWidth = 800 }: PublicPageProps) {
    return (
        <AppShell height="auto" contentPadding={0} topNav={<SiteHeader />}>
            <Center axis="horizontal" padding={4} width="100%">
                <VStack gap={6} maxWidth={maxWidth}>
                    {children}
                </VStack>
            </Center>
            <SiteFooter />
        </AppShell>
    );
}