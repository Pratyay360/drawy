import type { Canvas } from "../../services/canvases";

interface CanvasGroup {
    Today: Canvas[];
    Older: Canvas[];
}

export function groupCanvasesByDate(canvases: Canvas[]): CanvasGroup {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const grouped: CanvasGroup = { Today: [], Older: [] };

    canvases.map((canvas) => {
        const canvasDate = new Date(canvas.updatedAt);
        if (canvasDate >= today) {
            grouped.Today.push(canvas);
        } else {
            grouped.Older.push(canvas);
        }
    });

    return grouped;
}