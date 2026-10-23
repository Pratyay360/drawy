import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";
import { PublicPage } from "#/components/public-page";
import { docs } from "#/lib/docs";

export const Route = createFileRoute("/docs/")({
    head: () => ({
        meta: [
            { title: "Documentation — Drawy" },
            {
                name: "description",
                content:
                    "Guides for Drawy: getting started, sharing and collaboration, libraries, privacy and self-hosting.",
            },
        ],
    }),
    component: DocsIndexPage,
});

function DocsIndexPage() {
    const navigate = useNavigate();

    return (
        <PublicPage>
            <VStack gap={2}>
                <Heading level={1}>Documentation</Heading>
                <Text type="supporting">
                    Short guides that cover everything from your first canvas to running your own
                    instance.
                </Text>
            </VStack>

            <List header={<Heading level={2}>Guides</Heading>} hasDividers>
                {docs.map((doc) => (
                    <ListItem
                        key={doc.slug}
                        label={doc.title}
                        description={doc.description}
                        startContent={<Icon icon={BookOpen} size="sm" />}
                        endContent={<Icon icon={ChevronRight} size="sm" />}
                        onClick={() => navigate({ to: "/docs/$slug", params: { slug: doc.slug } })}
                    />
                ))}
            </List>
        </PublicPage>
    );
}