if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { Button, DropdownMenu, Icon, IconButton, SideNav, SideNavCollapseButton, SideNavHeading, SideNavItem, SideNavSection, Text, VStack, require_jsx_runtime, require_react, useSideNavCollapse } from "../_libs/@astryxdesign/core+[...].mjs";
import { Link, useNavigate, useParams, useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { Check } from "../_libs/@astryxdesign/theme-matcha+[...].mjs";
import { FileText, Library, LoaderCircle, LogOut, Monitor, Moon, Palette, PenTool, Plus, Sun, Trash } from "../_libs/lucide-react.mjs";
import { getCurrentUser, logout, themeNames, themeRegistry, useTheme } from "./router-CcE2zVrw.mjs";
import { create } from "../_libs/zustand.mjs";
import { createCanvas, deleteCanvas, listCanvases, requestLibraryBrowse, subscribeCanvasEvents, subscribeCanvasListChanged } from "./libraries-DLCIDk6W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sidebar-DGqgt6G2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function readSidebarCollapsed() {
	return false;
}
var useSidebarStore = create((set) => ({
	isCollapsed: readSidebarCollapsed(),
	canvases: [],
	isLoadingCanvases: true,
	canvasesError: null,
	isCreating: false,
	deletingId: null,
	user: null,
	signingOut: false,
	setIsCollapsed: (isCollapsed) => {
		set({ isCollapsed });
	},
	setCanvases: (canvases) => set({ canvases }),
	setIsLoadingCanvases: (isLoadingCanvases) => set({ isLoadingCanvases }),
	setCanvasesError: (canvasesError) => set({ canvasesError }),
	setIsCreating: (isCreating) => set({ isCreating }),
	setDeletingId: (deletingId) => set({ deletingId }),
	setUser: (user) => set({ user }),
	setSigningOut: (signingOut) => set({ signingOut })
}));
/**
* Theme picker: switches the app theme (Butter / Neutral / Gothic) and the
* color mode (light / dark / system) from the sidebar footer.
*/
function ThemeToggle() {
	const { themeName, modePreference, setThemeName, setMode } = useTheme();
	const current = themeRegistry[themeName];
	const checkFor = (selected) => selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		icon: Check,
		size: "sm"
	}) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenu, {
		button: {
			label: "Theme",
			tooltip: "Theme",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: Palette,
				size: "sm"
			}),
			variant: "ghost",
			isIconOnly: true,
			size: "sm"
		},
		hasChevron: false,
		placement: "above",
		menuWidth: 240,
		items: [{
			type: "section",
			title: "Theme",
			id: "theme",
			items: themeNames.map((name) => {
				const entry = themeRegistry[name];
				return {
					id: name,
					label: entry.label,
					description: entry.description,
					onClick: () => setThemeName(name),
					endContent: checkFor(name === themeName)
				};
			})
		}, {
			type: "section",
			title: "Mode",
			id: "mode",
			items: [
				{
					id: "light",
					label: "Light",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: Sun,
						size: "sm"
					}),
					onClick: () => setMode("light"),
					isDisabled: current.darkOnly,
					endContent: checkFor(modePreference === "light")
				},
				{
					id: "dark",
					label: "Dark",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: Moon,
						size: "sm"
					}),
					onClick: () => setMode("dark"),
					endContent: checkFor(modePreference === "dark")
				},
				{
					id: "system",
					label: "System",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: Monitor,
						size: "sm"
					}),
					onClick: () => setMode("system"),
					isDisabled: current.darkOnly,
					endContent: checkFor(modePreference === "system")
				}
			]
		}]
	});
}
function groupCanvasesByDate(canvases) {
	const now = /* @__PURE__ */ new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const grouped = {
		Today: [],
		Older: []
	};
	canvases.map((canvas) => {
		if (new Date(canvas.updatedAt) >= today) grouped.Today.push(canvas);
		else grouped.Older.push(canvas);
	});
	return grouped;
}
function SidebarFooter() {
	const router = useRouter();
	const navigate = useNavigate();
	const user = useSidebarStore((s) => s.user);
	const setUser = useSidebarStore((s) => s.setUser);
	const signingOut = useSidebarStore((s) => s.signingOut);
	const setSigningOut = useSidebarStore((s) => s.setSigningOut);
	const { isCollapsed } = useSideNavCollapse();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		Promise.race([getCurrentUser(), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("user fetch timeout")), 8e3))]).then((currentUser) => {
			if (!cancelled && currentUser) setUser({ username: currentUser.username });
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [setUser]);
	async function handleSignOut() {
		setSigningOut(true);
		try {
			await Promise.race([logout(), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("logout timeout")), 1e4))]);
			await router.invalidate();
			await navigate({ to: "/login" });
		} catch (e) {
			console.error("Logout failed (slow network):", e);
		} finally {
			setSigningOut(false);
		}
	}
	if (!user) return null;
	if (isCollapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VStack, {
		gap: 1,
		hAlign: "center",
		padding: 2,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
			label: "Sign out",
			tooltip: `Sign out (${user.username})`,
			variant: "ghost",
			size: "sm",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: LogOut,
				size: "sm"
			}),
			isLoading: signingOut,
			onClick: handleSignOut
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 1,
		padding: 3,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			type: "supporting",
			maxLines: 1,
			children: user.username
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			label: "Sign out",
			variant: "ghost",
			size: "sm",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: LogOut,
				size: "sm"
			}),
			isLoading: signingOut,
			onClick: handleSignOut,
			width: "100%"
		})]
	});
}
function SidebarNewCanvasButton({ onClick, isLoading }) {
	const { isCollapsed } = useSideNavCollapse();
	if (isCollapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
		label: "New canvas",
		tooltip: "New canvas",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			icon: Plus,
			size: "sm"
		}),
		onClick,
		isLoading,
		variant: "primary"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		label: "New canvas",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			icon: Plus,
			size: "sm"
		}),
		onClick,
		isLoading,
		width: "100%"
	});
}
function withTimeout(promise, ms, label) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out after ${ms}ms`)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
function Sidebar() {
	const isCollapsed = useSidebarStore((s) => s.isCollapsed);
	const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);
	const canvases = useSidebarStore((s) => s.canvases);
	const setCanvases = useSidebarStore((s) => s.setCanvases);
	const isLoadingCanvases = useSidebarStore((s) => s.isLoadingCanvases);
	const setIsLoadingCanvases = useSidebarStore((s) => s.setIsLoadingCanvases);
	const canvasesError = useSidebarStore((s) => s.canvasesError);
	const setCanvasesError = useSidebarStore((s) => s.setCanvasesError);
	const isCreating = useSidebarStore((s) => s.isCreating);
	const setIsCreating = useSidebarStore((s) => s.setIsCreating);
	const deletingId = useSidebarStore((s) => s.deletingId);
	const setDeletingId = useSidebarStore((s) => s.setDeletingId);
	const { id: currentCanvasId } = useParams({ strict: false });
	const navigate = useNavigate();
	const loadSeqRef = (0, import_react.useRef)(0);
	const loadCanvases = (0, import_react.useCallback)(async () => {
		const seq = ++loadSeqRef.current;
		if (!(useSidebarStore.getState().canvases.length > 0)) setIsLoadingCanvases(true);
		setCanvasesError(null);
		try {
			const result = await withTimeout(listCanvases(), 12e3, "Loading canvases");
			if (seq !== loadSeqRef.current) return;
			setCanvases(result);
			setCanvasesError(null);
		} catch (error) {
			if (seq !== loadSeqRef.current) return;
			console.error("Failed to load canvases:", error);
			setCanvasesError(error instanceof Error ? error.message : "Failed to load canvases");
		} finally {
			if (seq === loadSeqRef.current) setIsLoadingCanvases(false);
		}
	}, [
		setCanvases,
		setIsLoadingCanvases,
		setCanvasesError
	]);
	(0, import_react.useEffect)(() => {
		loadCanvases();
		const onUpdate = () => void loadCanvases();
		addEventListener("canvas-updated", onUpdate);
		const unsubscribe = subscribeCanvasEvents(onUpdate);
		const unsubscribeList = subscribeCanvasListChanged(onUpdate);
		return () => {
			removeEventListener("canvas-updated", onUpdate);
			unsubscribe();
			unsubscribeList();
		};
	}, [loadCanvases]);
	async function handleCreateCanvas() {
		setIsCreating(true);
		try {
			const title = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
			const newCanvas = await withTimeout(createCanvas(title), 12e3, "Create canvas");
			dispatchEvent(new Event("canvas-updated"));
			navigate({
				to: "/canvas/$id",
				params: { id: newCanvas.id }
			});
		} catch (error) {
			console.error("Failed to create canvas:", error);
		} finally {
			setIsCreating(false);
		}
	}
	async function handleDeleteCanvas(canvasId, event) {
		event.preventDefault();
		event.stopPropagation();
		setDeletingId(canvasId);
		try {
			await withTimeout(deleteCanvas(canvasId), 12e3, "Delete canvas");
			dispatchEvent(new Event("canvas-updated"));
			if (canvasId === currentCanvasId) navigate({ to: "/" });
		} catch (error) {
			console.error("Failed to delete canvas:", error);
		} finally {
			setDeletingId(null);
		}
	}
	const grouped = groupCanvasesByDate(canvases);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNav, {
		collapsible: {
			isCollapsed,
			onCollapsedChange: setIsCollapsed,
			hasButton: false
		},
		resizable: {
			defaultWidth: 240,
			minWidth: 200,
			maxWidth: 320,
			autoSaveId: "drawy-sidebar-width"
		},
		header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavHeading, {
			heading: "Drawy",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: PenTool,
				size: "sm"
			}),
			headingHref: "/",
			as: Link
		}),
		topContent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNewCanvasButton, {
			onClick: handleCreateCanvas,
			isLoading: isCreating
		}),
		footerIcons: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Libraries",
				tooltip: "Libraries",
				variant: "ghost",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Library,
					size: "sm"
				}),
				onClick: () => requestLibraryBrowse(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavCollapseButton, {})
		] }),
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {}),
		children: isLoadingCanvases && canvases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
			title: "Loading",
			isHeaderHidden: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 2,
				hAlign: "center",
				padding: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "sm"
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
			})
		}) : canvasesError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
			title: "Error",
			isHeaderHidden: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 2,
				hAlign: "center",
				padding: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						maxLines: 3,
						children: canvasesError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Retry",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: LoaderCircle,
							size: "sm"
						}),
						onClick: loadCanvases
					}),
					canvases.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: "Showing cached drawings"
					})
				]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			grouped.Today.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Today",
				children: grouped.Today.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavItem, {
					label: canvas.title,
					icon: FileText,
					href: `/canvas/${canvas.id}`,
					as: Link,
					isSelected: canvas.id === currentCanvasId,
					endContent: canvas.isOwner ? deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Delete canvas",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Trash,
							size: "sm"
						}),
						onClick: (e) => handleDeleteCanvas(canvas.id, e)
					}) : null
				}, canvas.id))
			}),
			grouped.Older.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Older",
				children: grouped.Older.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavItem, {
					label: canvas.title,
					icon: FileText,
					href: `/canvas/${canvas.id}`,
					as: Link,
					isSelected: canvas.id === currentCanvasId,
					endContent: canvas.isOwner ? deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Delete canvas",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Trash,
							size: "sm"
						}),
						onClick: (e) => handleDeleteCanvas(canvas.id, e)
					}) : null
				}, canvas.id))
			}),
			canvases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Drawings",
				isHeaderHidden: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 2,
					hAlign: "center",
					padding: 3,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: "No drawings yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Create one",
						variant: "ghost",
						size: "sm",
						onClick: handleCreateCanvas
					})]
				})
			}),
			isLoadingCanvases && canvases.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 1,
				hAlign: "center",
				padding: 2,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: LoaderCircle,
					size: "sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "Refreshing…"
				})]
			})
		] })
	});
}
//#endregion
export { Sidebar };
