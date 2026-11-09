const MAX_IMAGE_DIMENSION = 1920;
const COMPRESSION_QUALITY = 0.82;
const MAX_DATA_URL_LENGTH_BEFORE_COMPRESS = 300_000;

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
    if (mimeType === "image/svg+xml" || dataURL.startsWith("data:image/svg+xml")) {
        return { dataURL, mimeType: "image/svg+xml" };
    }

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
