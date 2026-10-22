import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { Selector } from "@astryxdesign/core/Selector";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import { createFileRoute } from "@tanstack/react-router";
import { AtSign, LifeBuoy, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
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

const TOPICS = [
    { value: "bug", label: "Something is broken" },
    { value: "feature", label: "I have a feature request" },
    { value: "account", label: "Account or access help" },
    { value: "privacy", label: "Privacy or data request" },
    { value: "other", label: "Something else" },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
    name?: string;
    email?: string;
    message?: string;
}

function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState<string>("bug");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Errors>({});

    function validate(): Errors {
        const next: Errors = {};
        if (name.trim().length === 0) {
            next.name = "Tell us who you are so we can reply.";
        }
        if (email.trim().length === 0) {
            next.email = "We need an email address to reply to.";
        } else if (!EMAIL_PATTERN.test(email.trim())) {
            next.email = "That does not look like an email address.";
        }
        if (message.trim().length < 10) {
            next.message = "Please add a little more detail (at least 10 characters).";
        }
        return next;
    }

    function handleSubmit() {
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        const topicLabel =
            TOPICS.find((option) => option.value === topic)?.label ?? "Support request";
        const body = [
            `Name: ${name.trim()}`,
            `Email: ${email.trim()}`,
            `Topic: ${topicLabel}`,
            "",
            message.trim(),
        ].join("\n");

        const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            `[Drawy] ${topicLabel}`,
        )}&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
    }

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
                            Submitting opens your email app with the message prefilled.
                        </Text>
                    </VStack>

                    <TextInput
                        label="Your name"
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setErrors((current) => ({ ...current, name: undefined }));
                        }}
                        placeholder="Alex"
                        startIcon={<Icon icon={LifeBuoy} size="sm" />}
                        isRequired
                        status={errors.name ? { type: "error", message: errors.name } : undefined}
                    />

                    <TextInput
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setErrors((current) => ({ ...current, email: undefined }));
                        }}
                        placeholder="you@example.com"
                        startIcon={<Icon icon={AtSign} size="sm" />}
                        isRequired
                        status={errors.email ? { type: "error", message: errors.email } : undefined}
                    />

                    <Selector
                        label="What is this about?"
                        options={TOPICS.map((option) => ({
                            value: option.value,
                            label: option.label,
                        }))}
                        value={topic}
                        onChange={(value) => setTopic(value)}
                        width="100%"
                    />

                    <TextArea
                        label="Message"
                        value={message}
                        onChange={(value) => {
                            setMessage(value);
                            setErrors((current) => ({ ...current, message: undefined }));
                        }}
                        placeholder="Tell us what happened, what you expected, and which browser you were using."
                        rows={6}
                        isRequired
                        status={
                            errors.message ? { type: "error", message: errors.message } : undefined
                        }
                    />

                    <HStack align="center" gap={3} wrap="wrap">
                        <Button
                            label="Send message"
                            icon={<Icon icon={Send} size="sm" />}
                            onClick={handleSubmit}
                            variant="primary"
                        />
                        <Button
                            label="Open the full form"
                            href={CONTACT_URL}
                            icon={<Icon icon={MessageCircle} size="sm" />}
                            rel="noopener noreferrer"
                            target="_blank"
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
                    We aim to reply within a couple of working days. If your message is about
                    deleting your account or your data, say so in the subject line so it reaches the
                    right place.
                </Text>
            </VStack>
        </PublicPage>
    );
}