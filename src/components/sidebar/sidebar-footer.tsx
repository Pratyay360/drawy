import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { getCurrentUser, logout } from "#/lib/session";
import { useSidebarStore } from "#/stores/sidebar";

export function SidebarFooter() {
	const router = useRouter();
	const navigate = useNavigate();
	const user = useSidebarStore((s) => s.user);
	const setUser = useSidebarStore((s) => s.setUser);
	const signingOut = useSidebarStore((s) => s.signingOut);
	const setSigningOut = useSidebarStore((s) => s.setSigningOut);

	useEffect(() => {
		let cancelled = false;
		void getCurrentUser().then((currentUser) => {
			if (!cancelled && currentUser) {
				setUser({ username: currentUser.username });
			}
		});

		return () => {
			cancelled = true;
		};
	}, [setUser]);

	async function handleSignOut() {
		setSigningOut(true);
		try {
			await logout();
			await router.invalidate();
			await navigate({ to: "/login" });
		} finally {
			setSigningOut(false);
		}
	}

	if (!user) return null;

	return (
		<VStack gap={1} padding={3}>
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
		</VStack>
	);
}
