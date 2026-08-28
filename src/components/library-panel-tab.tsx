import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { List, ListItem } from "@astryxdesign/core/List";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Compass, Eye, Library } from "lucide-react";
import { useEffect } from "react";
import { useLibraryStore } from "#/stores/library";
import {
	getLibraryAssetUrl,
	getSavedLibraries,
	libraryItemCount,
	onLibraryConfigUpdated,
	requestLibraryBrowse,
} from "../services/libraries.ts";

export function LibraryPanelTab() {
	const savedLibraries = useLibraryStore((s) => s.savedLibraries);
	const setSavedLibraries = useLibraryStore((s) => s.setSavedLibraries);

	useEffect(() => {
		let active = true;
		const load = () => {
			void getSavedLibraries().then((saved) => {
				if (active) setSavedLibraries(saved);
			});
		};
		load();
		const unsubscribe = onLibraryConfigUpdated(load);
		return () => {
			active = false;
			unsubscribe();
		};
	}, [setSavedLibraries]);

	return (
		<VStack gap={3} height="100%" isScrollable>
			<HStack gap={2} align="center">
				<Icon icon={Library} size="sm" />
				<Heading level={3}>Drawy libraries</Heading>
			</HStack>

			<StackItem size="fill">
				{savedLibraries.length > 0 ? (
					<List hasDividers>
						{savedLibraries.map((library) => (
							<ListItem
								key={library.id}
								label={library.name}
								description={`${libraryItemCount(library)} items`}
								startContent={
									library.preview ? (
										<img
											src={getLibraryAssetUrl(library.preview)}
											alt=""
											className="h-7 w-9 rounded object-cover"
										/>
									) : (
										<Icon icon={Library} size="sm" />
									)
								}
								endContent={<Icon icon={Eye} size="sm" />}
								onClick={() => requestLibraryBrowse(library.id)}
							/>
						))}
					</List>
				) : (
					<Text type="supporting">
						No saved libraries yet. Save one to browse and use its items on your
						canvas.
					</Text>
				)}
			</StackItem>

			<Button
				label="Open library browser"
				variant="secondary"
				size="sm"
				icon={<Icon icon={Compass} size="sm" />}
				onClick={() => requestLibraryBrowse(null)}
				width="100%"
			/>
		</VStack>
	);
}
