import { Markdown } from "@astryxdesign/core/Markdown";
import { Button } from "@astryxdesign/core/Button";
import { VStack } from "@astryxdesign/core/Stack";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getDoc } from "#/lib/docs";
import { PublicPage } from "#/components/public-page";

export const Route = createFileRoute("/docs/$slug")({
    head: ({ params }) => {
        const doc = getDoc(params.slug);
        return {
            meta: [
                { title: `${doc?.title ?? "Documentation"} — Drawy` },
                {
                    name: "description",
                    content: doc?.title
                        ? `Drawy documentation: ${doc.title}.`
                        : "Drawy documentation.",
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
                <VStack gap={2}>
                    <h1>Page not found</h1>
                </VStack>
            </PublicPage>
        );
    }

    return (
        <PublicPage>
            <VStack gap={4}>
                <Link to="/docs">
                    <Button
                        label="Back to documentation"
                        variant="ghost"
                        size="sm"
                        icon={<ArrowLeft size={14} />}
                    />
                </Link>
                <Markdown contentWidth={720} autolink="gfm">
                    {doc.content}
                </Markdown>
            </VStack>
        </PublicPage>
    );
}