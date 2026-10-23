import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { LayoutFooter } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Mail } from "lucide-react";

export const CONTACT_URL = "https://app.youform.com/forms/moki0tve";

/** Product and support destinations. */
const PRIMARY_LINKS = [
    { label: "Docs", href: "/docs" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
    { label: "Changelog", href: "/changelog" },
    { label: "Contact", href: "/contact" },
] as const;

/** Legal destinations. */
const LEGAL_LINKS = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
] as const;

export function SiteFooter() {
    return (
        <LayoutFooter hasDivider padding={4}>
            <VStack gap={3}>
                <HStack align="center" gap={3} justify="between" wrap="wrap">
                    <Text size="sm" type="supporting">
                        Drawy
                    </Text>
                    <HStack align="center" gap={3} wrap="wrap">
                        {PRIMARY_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} isStandalone size="sm">
                                {link.label}
                            </Link>
                        ))}
                        <Button
                            href={CONTACT_URL}
                            icon={<Icon icon={Mail} size="sm" />}
                            label="Contact us"
                            rel="noopener noreferrer"
                            size="sm"
                            target="_blank"
                            variant="secondary"
                        />
                    </HStack>
                </HStack>
                <HStack align="center" gap={3} wrap="wrap">
                    {LEGAL_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} isStandalone size="sm">
                            {link.label}
                        </Link>
                    ))}
                </HStack>
            </VStack>
        </LayoutFooter>
    );
}