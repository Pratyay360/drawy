import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFileData, BinaryFiles } from "@excalidraw/excalidraw/types";

const MAX_IMAGE_DIMENSION = 1920;
const COMPRESSION_QUALITY = 0.82;
const MAX_DATA_URL_LENGTH_BEFORE_COMPRESS = 300_000;

export function pruneUnusedFiles(
	files: BinaryFiles | undefined,
	elements: readonly ExcalidrawElement[],
): BinaryFiles {
	if (!files || Object.keys(files).length === 0) return {};
	const usedFileIds = new Set<string>();
	for (const el of elements) {
		if (el.type === "image" && "fileId" in el && el.fileId) {
			usedFileIds.add(el.fileId);
		}
	}
	const pruned: BinaryFiles = {};
	for (const [id, file] of Object.entries(files)) {
		if (usedFileIds.has(id)) {
			pruned[id] = file;
		}
	}
	return pruned;
}

export async function compressDataUrl(
	dataURL: string,
	mimeType: string,
	maxDimension = MAX_IMAGE_DIMENSION,
	quality = COMPRESSION_QUALITY,
): Promise<{ dataURL: string; mimeType: string }> {
	if (!dataURL.startsWith("data:image/")) {
		return { dataURL, mimeType };
	}

	// Skip SVG as vector formats shouldn't be rasterized
	if (
		mimeType === "image/svg+xml" ||
		dataURL.startsWith("data:image/svg+xml")
	) {
		return { dataURL, mimeType: "image/svg+xml" };
	}

	// If already small enough, skip compression
	if (dataURL.length < MAX_DATA_URL_LENGTH_BEFORE_COMPRESS) {
		return { dataURL, mimeType };
	}

	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			let { width, height } = img;
			if (width <= 0 || height <= 0) {
				resolve({ dataURL, mimeType });
				return;
			}

			// Downscale if exceeds max dimension
			if (width > maxDimension || height > maxDimension) {
				if (width > height) {
					height = Math.round((height * maxDimension) / width);
					width = maxDimension;
				} else {
					width = Math.round((width * maxDimension) / height);
					height = maxDimension;
				}
			}

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve({ dataURL, mimeType });
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);

			// Determine target format (prefer webp, fallback to jpeg)
			const targetMime = "image/webp";
			const compressed = canvas.toDataURL(targetMime, quality);

			// Only use compressed version if it is actually smaller
			if (compressed.length < dataURL.length) {
				resolve({ dataURL: compressed, mimeType: targetMime });
			} else {
				resolve({ dataURL, mimeType });
			}
		};

		img.onerror = () => {
			resolve({ dataURL, mimeType });
		};

		img.src = dataURL;
	});
}

/**
 * Optimize all binary files by compressing large images and returning an updated dictionary.
 */
export async function optimizeBinaryFiles(
	files: BinaryFiles,
): Promise<BinaryFiles> {
	if (!files || Object.keys(files).length === 0) return {};

	const optimized: BinaryFiles = {};
	const promises = Object.entries(files).map(async ([id, file]) => {
		if (!file?.dataURL) return;
		try {
			const { dataURL, mimeType } = await compressDataUrl(
				file.dataURL,
				file.mimeType,
			);
			optimized[id] = {
				...file,
				dataURL: dataURL as BinaryFileData["dataURL"],
				mimeType: mimeType as BinaryFileData["mimeType"],
			};
		} catch {
			optimized[id] = file;
		}
	});

	await Promise.all(promises);
	return optimized;
}

/**
 * Estimate the total size in bytes of all stored binary files.
 */
export function calculateAssetsSize(files: BinaryFiles | undefined): number {
	if (!files) return 0;
	let bytes = 0;
	for (const file of Object.values(files)) {
		if (file?.dataURL) {
			bytes += file.dataURL.length;
		}
	}
	return bytes;
}

export async function uploadPendingAssets(
	canvasId: string,
	files: BinaryFiles,
	uploadFn: (
		canvasId: string,
		fileId: string,
		mimeType: string,
		base64Data: string,
	) => Promise<{ fileId: string; url: string; mimeType: string }>,
): Promise<{ updatedFiles: BinaryFiles; hasNewUploads: boolean }> {
	if (!files || Object.keys(files).length === 0) {
		return { updatedFiles: files || {}, hasNewUploads: false };
	}

	const updated: BinaryFiles = { ...files };
	let hasNewUploads = false;

	const entries = Object.entries(files).filter(([, file]) =>
		file?.dataURL?.startsWith("data:"),
	);

	// Compress all pending images in parallel, then upload in parallel.
	const results = await Promise.all(
		entries.map(async ([id, file]) => {
			try {
				const { dataURL, mimeType } = await compressDataUrl(
					file.dataURL!,
					file.mimeType,
				);
				const res = await uploadFn(canvasId, id, mimeType, dataURL);
				return { id, file, res };
			} catch (err) {
				console.error(`Failed to upload asset ${id} to Supabase storage:`, err);
				return null;
			}
		}),
	);

	for (const result of results) {
		if (!result?.res?.url) continue;
		const { id, file, res } = result;
		updated[id] = {
			...file,
			dataURL: res.url as BinaryFileData["dataURL"],
			mimeType: res.mimeType as BinaryFileData["mimeType"],
		};
		hasNewUploads = true;
	}

	return { updatedFiles: updated, hasNewUploads };
}
