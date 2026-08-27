import { AppShell } from "@astryxdesign/core/AppShell";
import { Center } from "@astryxdesign/core/Center";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { type ComponentType, useEffect, useState } from "react";
import { getCurrentUser } from "#/lib/session";
import { Sidebar } from "../../../components/sidebar";
export const Route = createFileRoute("/_authenticated/canvas/$id")({
	component: CanvasRoute,
});

function LoadingShell() {
	return (
		<AppShell contentPadding={0} sideNav={<Sidebar />}>
			<Center height="100%">
				<VStack gap={2} hAlign="center">
					<Icon icon={Loader2} size="lg" />
					<Text type="supporting">Loading editor...</Text>
				</VStack>
			</Center>
		</AppShell>
	);
}

function CanvasRoute() {
	const { id } = Route.useParams();
	const [Editor, setEditor] = useState<ComponentType<{
		id: string;
		username?: string;
	}> | null>(null);
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		let cancelled = false;
		void getCurrentUser().then((currentUser) => {
			if (!cancelled && currentUser?.username) {
				setUsername(currentUser.username);
			}
		});
		void import("../../../components/canvas-editor").then((module) => {
			if (!cancelled) setEditor(() => module.CanvasEditor);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	if (!Editor) return <LoadingShell />;
	return <Editor id={id} username={username} />;
}
