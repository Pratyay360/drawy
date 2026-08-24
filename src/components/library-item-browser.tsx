import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Section } from "@astryxdesign/core/Section";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { LibraryItem } from "@excalidraw/excalidraw/types";
import {
	ArrowLeft,
	CloudDownload,
	Download,
	ImageOff,
	Loader2,
	RefreshCw,
	Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SavedLibrary } from "../services/libraries.ts";

interface LibraryItemBrowserProps {
	library: SavedLibrary;
	source: "sidebar" | "canvas";
	onBack: () => void;
	onRefreshContent: () => Promise<void>;
}

const thumbnailUrlCache = new Map<string, string>();
let thumbnailQueue: Promise<void> = Promise.resolve();

function enqueueThumbnailRender(task: () => Promise<void>): Promise<void> {
	const run = thumbnailQueue.then(task);
	thumbnailQueue = run.catch(() => {});
	return run;
}

interface LibraryItemThumbnailProps {
	itemId: string;
	elements: readonly ExcalidrawElement[];
}

function LibraryItemThumbnail({ itemId, elements }: LibraryItemThumbnailProps) {
	const [url, setUrl] = useState<string | null>(
		() => thumbnailUrlCache.get(itemId) ?? null,
	);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (url) return;
		let cancelled = false;

		void enqueueThumbnailRender(async () => {
			if (cancelled) return;
			const cachedUrl = thumbnailUrlCache.get(itemId);
			if (cachedUrl) {
				setUrl(cachedUrl);
				return;
			}
			try {
				// Lazy import keeps Excalidraw (and its JSON imports) out of the SSR bundle.
				const { exportToSvg } = await import("@excalidraw/excalidraw");
				const svg = await exportToSvg({
					elements,
					appState: {
						exportBackground: false,
						exportWithDarkMode: true,
					},
					files: null,
					exportPadding: 6,
					skipInliningFonts: true,
				});
				if (cancelled) return;
				const xml = new XMLSerializer().serializeToString(svg);
				const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
				if (thumbnailUrlCache.size >= 1000) thumbnailUrlCache.clear();
				thumbnailUrlCache.set(itemId, dataUrl);
				setUrl(dataUrl);
			} catch (error) {
				console.error("Failed to render library item thumbnail:", error);
				if (!cancelled) setFailed(true);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [itemId, elements, url]);

	if (url) {
		return (
			<img
				src={url}
				alt=""
				className="max-h-full max-w-full object-contain"
				draggable={false}
			/>
		);
	}
	if (failed) {
		return <Icon icon={ImageOff} size="sm" />;
	}
	return <Icon icon={Loader2} size="sm" />;
}
function getItemName(
	item: LibraryItem | undefined,
	index: number,
	itemNames: string[],
): string {
	return (
		item?.name?.trim() || itemNames?.[index]?.trim() || `Item ${index + 1}`
	);
}

function getItemSearchText(
	item: LibraryItem | undefined,
	index: number,
	itemNames: string[],
): string {
	const parts: string[] = [];
	if (item?.name?.trim()) parts.push(item.name);
	if (itemNames?.[index]?.trim()) parts.push(itemNames[index]);
	if (Array.isArray(item?.elements)) {
		for (const element of item.elements) {
			if (element?.type === "text" && element?.text) {
				parts.push(element.text);
			} else if (element?.type === "arrow" && element?.label?.text) {
				parts.push(element.label.text);
			}
		}
	}
	return parts.join(" ").toLowerCase();
}

export function LibraryItemBrowser({
	library,
	onBack,
	onRefreshContent,
}: LibraryItemBrowserProps) {
	const [query, setQuery] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	const hasContent = Array.isArray(library.items) && library.items.length > 0;
	const items = useMemo(() => {
		const raw = Array.isArray(library.items) ? library.items : [];
		const itemNames = Array.isArray(library.item_names)
			? library.item_names
			: [];
		const lowerQuery = query.trim().toLowerCase();
		return raw
			.map((item, index) => ({
				item,
				name: getItemName(item, index, itemNames),
				searchText: getItemSearchText(item, index, itemNames),
			}))
			.filter(
				({ name, searchText }) =>
					!lowerQuery ||
					name.toLowerCase().includes(lowerQuery) ||
					searchText.includes(lowerQuery),
			);
	}, [library.items, library.item_names, query]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			if (query.trim()) {
				setQuery("");
			} else {
				onBack();
			}
		};
		globalThis.addEventListener("keydown", handler);
		return () => globalThis.removeEventListener("keydown", handler);
	}, [query, onBack]);

	async function handleRefresh() {
		setRefreshing(true);
		try {
			await onRefreshContent();
		} finally {
			setRefreshing(false);
		}
	}

	return (
		<Section>
			<HStack gap={2} align="center">
				<IconButton
					label="Back to libraries"
					variant="ghost"
					icon={<Icon icon={ArrowLeft} size="sm" />}
					onClick={onBack}
					tooltip="Back to libraries"
				/>
				<VStack gap={0} width="100%">
					<HStack gap={2} align="center">
						<Heading level={2} maxLines={1}>
							{library.name}
						</Heading>
						<Text type="supporting">
							{hasContent ? `${library.items.length} items` : "No items"}
						</Text>
					</HStack>
					<Text type="supporting" maxLines={1}>
						{library.description || "Saved library"}
					</Text>
				</VStack>
				<Button
					label="Refresh"
					variant="ghost"
					size="sm"
					icon={<Icon icon={RefreshCw} size="sm" />}
					isLoading={refreshing}
					onClick={handleRefresh}
					tooltip="Download latest content"
				/>
			</HStack>

			{hasContent ? (
				<VStack gap={3}>
					<TextInput
						label={`Search ${library.items.length} items`}
						isLabelHidden
						placeholder={`Search ${library.items.length} items...`}
						value={query}
						onChange={setQuery}
						startIcon={Search}
						hasClear
					/>

					{items.length > 0 ? (
						<Grid columns={{ minWidth: 160, max: 4 }} gap={3}>
							{items.map(({ item, name }, index) => (
								<Card key={item.id || `${library.id}-${index}`} padding={2}>
									<VStack gap={2}>
										<Card variant="muted" height={110} padding={1}>
											<Center>
												<LibraryItemThumbnail
													itemId={item.id || `${library.id}-${index}`}
													elements={item.elements || []}
												/>
											</Center>
										</Card>
										<Text type="supporting" maxLines={1} justify="center">
											{name}
										</Text>
									</VStack>
								</Card>
							))}
						</Grid>
					) : (
						<Text type="supporting" justify="center">
							No items match your search.
						</Text>
					)}
				</VStack>
			) : (
				<Center>
					<VStack gap={3} hAlign="center">
						<Icon icon={CloudDownload} size="lg" />
						<VStack gap={1} hAlign="center">
							<Text weight="medium">Content not downloaded yet</Text>
							<Text type="supporting">
								Download this library to browse and use its items.
							</Text>
						</VStack>
						<Button
							label="Download items"
							variant="secondary"
							size="sm"
							icon={<Icon icon={Download} size="sm" />}
							isLoading={refreshing}
							onClick={handleRefresh}
						/>
					</VStack>
				</Center>
			)}
		</Section>
	);
}
