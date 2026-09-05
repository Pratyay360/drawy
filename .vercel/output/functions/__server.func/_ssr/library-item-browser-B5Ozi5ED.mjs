if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { Button, Card, Center, Grid, HStack, Heading, Icon, IconButton, Section, Text, TextInput, VStack, require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { Search } from "../_libs/@astryxdesign/theme-matcha+[...].mjs";
import { ArrowLeft, CloudDownload, Download, ImageOff, LoaderCircle, RefreshCw } from "../_libs/lucide-react.mjs";
import { create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-item-browser-B5Ozi5ED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialState = {
	query: "",
	refreshing: false
};
var useLibraryItemStore = create((set) => ({
	...initialState,
	setQuery: (query) => set({ query }),
	setRefreshing: (refreshing) => set({ refreshing }),
	reset: () => set({ ...initialState })
}));
var thumbnailUrlCache = /* @__PURE__ */ new Map();
var thumbnailQueue = Promise.resolve();
function enqueueThumbnailRender(task) {
	const run = thumbnailQueue.then(task);
	thumbnailQueue = run.catch(() => {});
	return run;
}
function LibraryItemThumbnail({ itemId, elements }) {
	const [url, setUrl] = (0, import_react.useState)(() => thumbnailUrlCache.get(itemId) ?? null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (url) return;
		let cancelled = false;
		enqueueThumbnailRender(async () => {
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
						exportWithDarkMode: true
					},
					files: null,
					exportPadding: 6,
					skipInliningFonts: true
				});
				if (cancelled) return;
				const xml = new XMLSerializer().serializeToString(svg);
				const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
				if (thumbnailUrlCache.size >= 1e3) thumbnailUrlCache.clear();
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
	}, [
		itemId,
		elements,
		url
	]);
	if (url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		className: "max-h-full max-w-full object-contain",
		draggable: false
	});
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		icon: ImageOff,
		size: "sm"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		icon: LoaderCircle,
		size: "sm"
	});
}
function getItemName(item, index, itemNames) {
	return item?.name?.trim() || itemNames?.[index]?.trim() || `Item ${index + 1}`;
}
function getItemSearchText(item, index, itemNames) {
	const parts = [];
	if (item?.name?.trim()) parts.push(item.name);
	if (itemNames?.[index]?.trim()) parts.push(itemNames[index]);
	if (Array.isArray(item?.elements)) {
		for (const element of item.elements) if (element?.type === "text" && element?.text) parts.push(element.text);
		else if (element?.type === "arrow" && element?.label?.text) parts.push(element.label.text);
	}
	return parts.join(" ").toLowerCase();
}
function LibraryItemBrowser({ library, onBack, onRefreshContent }) {
	const query = useLibraryItemStore((s) => s.query);
	const refreshing = useLibraryItemStore((s) => s.refreshing);
	const setQuery = useLibraryItemStore((s) => s.setQuery);
	const setRefreshing = useLibraryItemStore((s) => s.setRefreshing);
	const hasContent = Array.isArray(library.items) && library.items.length > 0;
	const items = (0, import_react.useMemo)(() => {
		const raw = Array.isArray(library.items) ? library.items : [];
		const itemNames = Array.isArray(library.item_names) ? library.item_names : [];
		const lowerQuery = query.trim().toLowerCase();
		return raw.map((item, index) => ({
			item,
			name: getItemName(item, index, itemNames),
			searchText: getItemSearchText(item, index, itemNames)
		})).filter(({ name, searchText }) => !lowerQuery || name.toLowerCase().includes(lowerQuery) || searchText.includes(lowerQuery));
	}, [
		library.items,
		library.item_names,
		query
	]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.key !== "Escape") return;
			if (query.trim()) setQuery("");
			else onBack();
		};
		globalThis.addEventListener("keydown", handler);
		return () => globalThis.removeEventListener("keydown", handler);
	}, [
		query,
		onBack,
		setQuery
	]);
	(0, import_react.useEffect)(() => () => useLibraryItemStore.getState().reset(), []);
	async function handleRefresh() {
		setRefreshing(true);
		try {
			await onRefreshContent();
		} finally {
			setRefreshing(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
		gap: 2,
		align: "center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Back to libraries",
				variant: "ghost",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: ArrowLeft,
					size: "sm"
				}),
				onClick: onBack,
				tooltip: "Back to libraries"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 0,
				width: "100%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
					gap: 2,
					align: "center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 2,
						maxLines: 1,
						children: library.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: hasContent ? `${library.items.length} items` : "No items"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					maxLines: 1,
					children: library.description || "Saved library"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				label: "Refresh",
				variant: "ghost",
				size: "sm",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: RefreshCw,
					size: "sm"
				}),
				isLoading: refreshing,
				onClick: handleRefresh,
				tooltip: "Download latest content"
			})
		]
	}), hasContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 3,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			label: `Search ${library.items.length} items`,
			isLabelHidden: true,
			placeholder: `Search ${library.items.length} items...`,
			value: query,
			onChange: setQuery,
			startIcon: Search,
			hasClear: true
		}), items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
			columns: {
				minWidth: 160,
				max: 4
			},
			gap: 3,
			children: items.map(({ item, name }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				padding: 2,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 2,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						variant: "muted",
						height: 110,
						padding: 1,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryItemThumbnail, {
							itemId: item.id || `${library.id}-${index}`,
							elements: item.elements || []
						}) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						maxLines: 1,
						justify: "center",
						children: name
					})]
				})
			}, item.id || `${library.id}-${index}`))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			type: "supporting",
			justify: "center",
			children: "No items match your search."
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 3,
		hAlign: "center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: CloudDownload,
				size: "lg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 1,
				hAlign: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					weight: "medium",
					children: "Content not downloaded yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "Download this library to browse and use its items."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				label: "Download items",
				variant: "secondary",
				size: "sm",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Download,
					size: "sm"
				}),
				isLoading: refreshing,
				onClick: handleRefresh
			})
		]
	}) })] });
}
//#endregion
export { LibraryItemBrowser };
