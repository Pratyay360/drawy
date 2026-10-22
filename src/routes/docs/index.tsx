import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { docs } from "#/lib/docs";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/docs/")({
    head: () => ({
        meta: [
            { title: "Documentation — Drawy" },
            {
                name: "description",
                content:
                    "Guides and reference for using Drawy: getting started, sharing, libraries and more.",
            },
        ],
    }),
    component: DocsIndexPage,
});

function DocsIndexPage() {
    return (
        <PublicPage>
            <VStack gap={2}>
                <Heading level={1}>Documentation</Heading>
                <Text>
                    Guides and reference for using Drawy. Pick a topic below to get started.
                </Text>
            </VStack>

            {docs.length === 0 ? (
                <Text>No documentation available yet.</Text>
            ) : (
                <VStack gap={3}>
                    {docs.map((doc) => (
                        <Card key={doc.slug}>
                            <VStack gap={2}>
                                <HStack align="center" gap={2}>
                                    <Icon icon={BookOpen} size="sm" />
                                    <Heading level={3}>{doc.title}</Heading>
                                </HStack>
                                <Link to="/docs/$slug" params={{ slug: doc.slug }}>
                                    <Button label="Read guide" variant="secondary" size="sm" />
                                </Link>
                            </VStack>
                        </Card>
                    ))}
                </VStack>
            )}
        </PublicPage>
    );
}