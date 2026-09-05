import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
	installUpdate,
	onUpdateAvailable,
	skipUpdate,
	type UpdateInfo,
} from "../updater.ts";

export function UpdatePrompt() {
	const [update, setUpdate] = useState<UpdateInfo | null>(null);
	const [installing, setInstalling] = useState(false);

	useEffect(() => {
		return onUpdateAvailable((info) => setUpdate(info));
	}, []);

	async function handleInstall() {
		if (!update) return;
		setInstalling(true);
		try {
			await installUpdate(update.version);
		} catch (error) {
			console.error("Failed to install update:", error);
			setInstalling(false);
		}
	}

	function handleLater() {
		if (update) void skipUpdate(update.version);
		setUpdate(null);
	}

	return (
		<Dialog
			isOpen={update !== null}
			onOpenChange={(open) => {
				if (!open && !installing) handleLater();
			}}
			width={480}
			purpose="form"
		>
			{update && (
				<Layout
					header={
						<DialogHeader
							title={`Update to ${update.version}`}
							onOpenChange={() => {
								if (!installing) handleLater();
							}}
						/>
					}
					content={
						<LayoutContent padding={4}>
							<VStack gap={2}>
								<Text>
									A new version of Drawy is available. Update to{" "}
									{update.version}?
								</Text>
								{update.notes ? (
									<Text type="supporting">{update.notes}</Text>
								) : null}
							</VStack>
						</LayoutContent>
					}
					footer={
						<LayoutFooter hasDivider padding={4}>
							<HStack justify="end" gap={2}>
								<Button
									label="Later"
									variant="secondary"
									onClick={handleLater}
									isDisabled={installing}
								/>
								<Button
									label={installing ? "Installing..." : "Update Now"}
									variant="primary"
									icon={
										<Icon icon={installing ? Loader2 : RefreshCw} size="sm" />
									}
									onClick={handleInstall}
									isLoading={installing}
								/>
							</HStack>
						</LayoutFooter>
					}
				/>
			)}
		</Dialog>
	);
}
