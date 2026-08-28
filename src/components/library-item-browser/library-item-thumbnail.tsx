import { Icon } from "@astryxdesign/core/Icon";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { ImageOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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

export function LibraryItemThumbnail({
	itemId,
	elements,
}: LibraryItemThumbnailProps) {
	const [url, setUrl] = useState<string | null>(
		() => thumbnailUrlCache.get(itemId) ?? null,
	);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
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
