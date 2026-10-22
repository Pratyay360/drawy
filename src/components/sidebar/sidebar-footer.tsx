import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Link } from "@astryxdesign/core/Link";
import { useSideNavCollapse } from "@astryxdesign/core/SideNav";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { WebsiteCarbonBadge } from "react-websitecarbon-badge";
import { CONTACT_URL } from "#/components/site-footer";
import { useTheme } from "#/hooks/usetheme";
import { getCurrentUser, logout } from "#/lib/session";
import { useSidebarStore } from "#/stores/sidebar";

export function SidebarFooter() {
	const router = useRouter();
	const navigate = useNavigate();
	const user = useSidebarStore((s) => s.user);
	const setUser = useSidebarStore((s) => s.setUser);
	const signingOut = useSidebarStore((s) => s.signingOut);
	const setSigningOut = useSidebarStore((s) => s.setSigningOut);
	const { isCollapsed } = useSideNavCollapse();
	const { mode } = useTheme();

	// The carbon badge needs a page URL and styled-components cannot render it
	// on the server, so it only appears once the page is interactive.
	const [carbonUrl, setCarbonUrl] = useState<string | null>(null);

	useEffect(() => {
		setCarbonUrl(window.location.href);
	}, []);

	useEffect(() => {
		let cancelled = false;
		void Promise.race([
			getCurrentUser(),
			new Promise<null>((_, reject) =>
				setTimeout(() => reject(new Error("user fetch timeout")), 8000),
			),
		])
			.then((currentUser) => {
				if (!cancelled && currentUser) {
					setUser({ username: (currentUser as { username: string }).username });
				}
			})
			.catch(() => {
				// Slow network: keep previous user if any, otherwise stay null — don't block sidebar
			});

		return () => {
			cancelled = true;
		};
	}, [setUser]);

	async function handleSignOut() {
		setSigningOut(true);
		try {
			await Promise.race([
				logout(),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("logout timeout")), 10000),
				),
			]);
			await router.invalidate();
			await navigate({ to: "/login" });
		} catch (e) {
			console.error("Logout failed (slow network):", e);
		} finally {
			setSigningOut(false);
		}
	}

	if (!user) return null;

	if (isCollapsed) {
		return (
			<VStack gap={1} hAlign="center" padding={2}>
				<IconButton
					label="Sign out"
					tooltip={`Sign out (${user.username})`}
					variant="ghost"
					size="sm"
					icon={<Icon icon={LogOut} size="sm" />}
					isLoading={signingOut}
					onClick={handleSignOut}
				/>
			</VStack>
		);
	}

	return (
		<VStack gap={2} padding={3}>
			<Text type="supporting" maxLines={1}>
				{user.username}
			</Text>
			<Button
				label="Sign out"
				variant="ghost"
				size="sm"
				icon={<Icon icon={LogOut} size="sm" />}
				isLoading={signingOut}
				onClick={handleSignOut}
				width="100%"
			/>
			<Button
				label="Contact us"
				variant="ghost"
				size="sm"
				icon={<Icon icon={Mail} size="sm" />}
				href={CONTACT_URL}
				target="_blank"
				rel="noopener noreferrer"
				width="100%"
			/>
			<HStack hAlign="center" gap={2} wrap="wrap">
				<Link href="/help" isStandalone size="sm">
					Help
				</Link>
				<Link href="/about" isStandalone size="sm">
					About
				</Link>
				<Link href="/privacy" isStandalone size="sm">
					Privacy
				</Link>
				<Link href="/terms" isStandalone size="sm">
					Terms
				</Link>
				<Link href="/cookies" isStandalone size="sm">
					Cookies
				</Link>
			</HStack>
			{carbonUrl && <WebsiteCarbonBadge dark={mode === "dark"} url={carbonUrl} />}
		</VStack>
	);
}
