import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { PublicPage } from "#/components/public-page";
import { CONTACT_URL } from "#/components/site-footer";

export const Route = createFileRoute("/contact")({
    head: () => ({
        meta: [
            { title: "Contact — Drawy" },
            {
                name: "description",
                content: "Report a bug, request a feature or ask a question about Drawy.",
            },
        ],
    }),
    component: ContactPage,
});

/** Where messages are sent from. */
const SUPPORT_EMAIL = "pratyaymustafi@outlook.com";

function ContactPage() {
    return (
        <PublicPage>
            <VStack gap={3}>
                <Heading level={1}>Contact us</Heading>
                <Text as="p" type="large">
                    Found a bug, spotted something odd, or want a feature that is not there yet?
                    Tell us about it and we will get back to you.
                </Text>
            </VStack>

            <Card padding={5}>
                <VStack gap={4}>
                    <VStack gap={1}>
                        <Heading level={2}>Send a message</Heading>
                        <Text type="supporting">
                            The form below collects the details we need to answer you. It opens in a
                            new tab, and you can attach a screenshot of the canvas there.
                        </Text>
                    </VStack>

                    <HStack align="center" gap={3} wrap="wrap">
                        <Button
                            label="Open the contact form"
                            href={CONTACT_URL}
                            icon={<Icon icon={MessageCircle} size="sm" />}
                            rel="noopener noreferrer"
                            target="_blank"
                            variant="primary"
                        />
                        <Button
                            label="Email us instead"
                            href={`mailto:${SUPPORT_EMAIL}`}
                            icon={<Icon icon={Mail} size="sm" />}
                            variant="secondary"
                        />
                    </HStack>
                </VStack>
            </Card>

            <VStack gap={3}>
                <Heading level={2}>Other ways to reach us</Heading>
                <HStack align="center" gap={2} wrap="wrap">
                    <Icon icon={Mail} size="sm" />
                    <Text as="p">
                        Email us directly at{" "}
                        <Link href={`mailto:${SUPPORT_EMAIL}`} isStandalone>
                            {SUPPORT_EMAIL}
                        </Link>
                    </Text>
                </HStack>
                <Text as="p" type="supporting">
                    We aim to reply within a couple of working days. If you are writing about
                    deleting your account or your data, say so in the subject line so it reaches the
                    right person.
                </Text>
            </VStack>

            <VStack gap={3}>
                <Heading level={2}>Before you write</Heading>
                <Text as="p" type="supporting">
                    The{" "}
                    <Link href="/help" isStandalone>
                        help centre
                    </Link>{" "}
                    answers the questions we get most often, and the{" "}
                    <Link href="/docs" isStandalone>
                        documentation
                    </Link>{" "}
                    covers accounts, sharing, libraries and self-hosting.
                </Text>
            </VStack>
        </PublicPage>
    );
}