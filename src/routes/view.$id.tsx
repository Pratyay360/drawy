import { AppShell } from "@astryxdesign/core/AppShell";
import { Center } from "@astryxdesign/core/Center";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { type ComponentType, useEffect, useState } from "react";

export const Route = createFileRoute("/view/$id")({
    component: PublicCanvasRoute,
});

function LoadingShell() {
    return (
        <AppShell contentPadding={0}>
            <Center height="100%">
                <VStack gap={2} hAlign="center">
                    <Icon icon={Loader2} size="lg" />
                    <Text type="supporting">Loading viewer...</Text>
                </VStack>
            </Center>
        </AppShell>
    );
}

function PublicCanvasRoute() {
    const { id } = Route.useParams();
    const [Viewer, setViewer] = useState<ComponentType<{ id: string }> | null>(null);

    useEffect(() => {
        let cancelled = false;
        void import("../components/canvas-viewer").then((module) => {
            if (!cancelled) setViewer(() => module.CanvasViewer);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!Viewer) return <LoadingShell />;
    return <Viewer id={id} />;
}