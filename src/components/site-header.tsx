import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { NavIcon } from "@astryxdesign/core/NavIcon";
import { HStack } from "@astryxdesign/core/Stack";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { useRouterState } from "@tanstack/react-router";
import { PenTool } from "lucide-react";

/** Public destinations surfaced in the top navigation. */
const NAV_ITEMS = [
    { label: "Docs", href: "/docs" },
    { label: "About", href: "/about" },
    { label: "Help", href: "/help" },
] as const;

export function SiteHeader() {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });

    return (
        <TopNav
            label="Main"
            heading={
                <TopNavHeading
                    heading="Drawy party"
                    headingHref="/"
                    logo={<NavIcon icon={<Icon icon={PenTool} size="sm" />} />}
                />
            }
            startContent={NAV_ITEMS.map((item) => (
                <TopNavItem
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    isSelected={pathname === item.href}
                />
            ))}
            endContent={
                <HStack align="center" gap={2}>
                    <Button label="Contact" href="/contact" size="sm" variant="secondary" />
                    <Button label="Open Drawy" href="/login" size="sm" variant="primary" />
                </HStack>
            }
        />
    );
}