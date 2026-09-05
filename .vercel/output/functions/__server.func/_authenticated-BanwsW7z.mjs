if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "./_runtime.mjs";
import { AppShell, Button, Card, Center, Grid, HStack, Heading, Icon, IconButton, Text, Token, VStack, require_jsx_runtime, require_react } from "./_libs/@astryxdesign/core+[...].mjs";
import { useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { LoaderCircle, PenTool, Plus, Trash } from "./_libs/lucide-react.mjs";
import { createCanvas, deleteCanvas, listCanvases, subscribeCanvasEvents } from "./_ssr/libraries-DLCIDk6W.mjs";
import { Sidebar } from "./_ssr/sidebar-DGqgt6G2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-BanwsW7z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatUpdatedAt(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const now = /* @__PURE__ */ new Date();
	if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) return `Today at ${date.toLocaleTimeString(void 0, {
		hour: "2-digit",
		minute: "2-digit"
	})}`;
	return date.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== now.getFullYear() ? "numeric" : void 0
	});
}
function withTimeout(promise, ms, label) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out after ${ms}ms`)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
function Home() {
	const navigate = useNavigate();
	const [canvases, setCanvases] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const canvasesRef = (0, import_react.useRef)(canvases);
	canvasesRef.current = canvases;
	const loadCanvases = (0, import_react.useCallback)(async () => {
		if (!(canvasesRef.current.length > 0)) setIsLoading(true);
		setLoadError(null);
		try {
			const result = await withTimeout(listCanvases(), 12e3, "Loading canvases");
			setCanvases(result);
			setLoadError(null);
		} catch (error) {
			console.error("Failed to load canvases:", error);
			setLoadError(error instanceof Error ? error.message : "Failed to load canvases — slow network, please retry");
		} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadCanvases();
		const onUpdate = () => void loadCanvases();
		addEventListener("canvas-updated", onUpdate);
		const unsubscribe = subscribeCanvasEvents(onUpdate);
		return () => {
			removeEventListener("canvas-updated", onUpdate);
			unsubscribe();
		};
	}, [loadCanvases]);
	async function handleCreate() {
		setIsCreating(true);
		try {
			const title = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
			const canvas = await withTimeout(createCanvas(title), 12e3, "Create canvas");
			navigate({
				to: "/canvas/$id",
				params: { id: canvas.id }
			});
		} catch (error) {
			console.error("Failed to create canvas:", error);
		} finally {
			setIsCreating(false);
		}
	}
	async function handleDelete(canvasId, event) {
		event.preventDefault();
		event.stopPropagation();
		setDeletingId(canvasId);
		try {
			await withTimeout(deleteCanvas(canvasId), 12e3, "Delete canvas");
		} catch (error) {
			console.error("Failed to delete canvas:", error);
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 4,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
			gap: 5,
			maxWidth: 960,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				justify: "between",
				align: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 1,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: 1,
						children: "Drawings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: canvases.length === 0 ? "Create your first drawing to get started." : `${canvases.length} ${canvases.length === 1 ? "drawing" : "drawings"} · your canvases and drawings shared with you`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					label: "New canvas",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: Plus,
						size: "sm"
					}),
					onClick: handleCreate,
					isLoading: isCreating
				})]
			}), isLoading && canvases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				variant: "muted",
				padding: 6,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 2,
					hAlign: "center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: LoaderCircle,
							size: "lg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							children: "Loading drawings…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							children: "Slow network — hang tight"
						})
					]
				}) })
			}) : loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				variant: "muted",
				padding: 6,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 3,
					hAlign: "center",
					maxWidth: 400,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							weight: "medium",
							children: "Failed to load drawings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							justify: "center",
							children: loadError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							label: "Retry",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: LoaderCircle,
								size: "sm"
							}),
							onClick: loadCanvases
						}),
						canvases.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							children: "Showing cached drawings below"
						})
					]
				}) })
			}) : canvases.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				gap: 2,
				align: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: LoaderCircle,
					size: "sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "Refreshing…"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				columns: {
					minWidth: 220,
					max: 3
				},
				gap: 3,
				children: canvases.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					padding: 3,
					onClick: () => navigate({
						to: "/canvas/$id",
						params: { id: canvas.id }
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VStack, {
						gap: 2,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
							justify: "between",
							align: "center",
							gap: 2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
								gap: 0,
								width: "100%",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
									align: "center",
									gap: 1,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										weight: "medium",
										maxLines: 1,
										children: canvas.title
									}), !canvas.isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Token, { label: `Shared by ${canvas.owner}` })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									type: "supporting",
									children: formatUpdatedAt(canvas.updatedAt)
								})]
							}), canvas.isOwner && (deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: LoaderCircle,
								size: "sm"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Delete drawing",
								variant: "ghost",
								size: "sm",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: Trash,
									size: "sm"
								}),
								onClick: (e) => handleDelete(canvas.id, e),
								tooltip: "Delete drawing"
							}))]
						})
					})
				}, canvas.id))
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				variant: "muted",
				padding: 6,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 3,
					hAlign: "center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: PenTool,
							size: "lg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
							gap: 1,
							hAlign: "center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								weight: "medium",
								children: "No drawings yet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								type: "supporting",
								children: "Start sketching — changes save automatically."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							label: "Create your first drawing",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: Plus,
								size: "sm"
							}),
							onClick: handleCreate,
							isLoading: isCreating
						})
					]
				}) })
			})]
		})
	});
}
//#endregion
export { Home as component };
