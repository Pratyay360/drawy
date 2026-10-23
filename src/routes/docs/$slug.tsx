import { BreadcrumbItem, Breadcrumbs } from "@astryxdesign/core/Breadcrumbs";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { Markdown } from "@astryxdesign/core/Markdown";
import { Outline, useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { PublicPage } from "#/components/public-page";
import { type Doc, getDoc, getDocNeighbours } from "#/lib/docs";
export const Route = createFileRoute("/docs/$slug")({
    head: ({ params }) => {
        const doc = getDoc(params.slug);
        return {
            meta: [
                { title: `${doc?.title ?? "Documentation"} — Drawy` },
                {
                    name: "description",
                    content: doc?.description ?? "Drawy documentation.",
                },
            ],
        };
    },
    component: DocPage,
});

function DocPage() {
    const { slug } = Route.useParams();
    const doc = getDoc(slug);

    if (!doc) {
        return (
            <PublicPage>
                <EmptyState
                    headingLevel={1}
                    title="Guide not found"
                    description="That guide does not exist, or it has moved somewhere else."
                    icon={<Icon icon={Compass} size="lg" />}
                    actions={
                        <Link to="/docs">
                            <Button label="Back to documentation" variant="primary" />
                        </Link>
                    }
                />
            </PublicPage>
        );
    }

    return <DocBody doc={doc} />;
}

function DocBody({ doc }: { doc: Doc }) {
    const outlineItems = useOutlineFromMarkdown(doc.content);
    const { previous, next } = getDocNeighbours(doc.slug);

    return (
        <PublicPage maxWidth={1080}>
            <Breadcrumbs>
                <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
                <BreadcrumbItem isCurrent>{doc.title}</BreadcrumbItem>
            </Breadcrumbs>

            <VStack gap={1}>
                <Heading level={1}>{doc.title}</Heading>
                {doc.description && <Text type="supporting">{doc.description}</Text>}
            </VStack>

            <HStack align="start" gap={8} wrap="wrap">
                {outlineItems.length > 0 && (
                    <VStack width={220} gap={2}>
                        <Outline items={outlineItems} density="compact" label="On this page" />
                    </VStack>
                )}
                <StackItem size="fill">
                    <VStack gap={4}>
                        <Markdown contentWidth={720} headingLevelStart={1} autolink="gfm">
                            {doc.content}
                        </Markdown>
                    </VStack>
                </StackItem>
            </HStack>

            <Divider />

            <HStack align="center" justify="between" gap={4} wrap="wrap">
                <StackItem size="fill">
                    {previous && (
                        <Link to="/docs/$slug" params={{ slug: previous.slug }}>
                            <Button
                                label={previous.title}
                                icon={<Icon icon={ArrowLeft} size="sm" />}
                                variant="secondary"
                            />
                        </Link>
                    )}
                </StackItem>
                <StackItem size="fill">
                    <VStack hAlign="end">
                        {next && (
                            <Link to="/docs/$slug" params={{ slug: next.slug }}>
                                <Button
                                    label={next.title}
                                    icon={<Icon icon={ArrowRight} size="sm" />}
                                    variant="secondary"
                                />
                            </Link>
                        )}
                    </VStack>
                </StackItem>
            </HStack>
        </PublicPage>
    );
}