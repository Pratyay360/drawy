if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { AppShell, Button, Center, Divider, HStack, Heading, Icon, IconButton, Layout, LayoutContent, LayoutHeader, List, ListItem, StackItem, Text, TextInput, VStack, require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { ArrowLeft, Compass, Download, Eye, FileCode, Image as Image$1, Layers, Library, LoaderCircle, PenTool, Pencil, Save, Share2, Upload } from "../_libs/lucide-react.mjs";
import { getCurrentUser, useTheme } from "./router-CcE2zVrw.mjs";
import { create } from "../_libs/zustand.mjs";
import { CanvasRealtime, getSavedLibraries, getUserLibrary, loadCanvas, mergeElements, onLibraryConfigUpdated, onLibraryItemsInstalled, requestLibraryBrowse, sanitizeExcalidrawAppState, saveCanvas, setUserLibrary, subscribeCanvasEvents, updateCanvasTitle, uploadCanvasAsset, useUIStore } from "./libraries-DLCIDk6W.mjs";
import { Sidebar } from "./sidebar-DGqgt6G2.mjs";
import { getLibraryAssetUrl, libraryItemCount, useLibraryStore } from "./library-Bpj0Zib1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/canvas-editor-BzpPbAFl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialState = {
	canvasData: null,
	loading: true,
	loadError: null,
	isChangingCanvas: false,
	elements: [],
	appState: {},
	excalidrawAPI: null,
	excalidrawModule: null,
	moduleError: null,
	saveStatus: "saved",
	collaborators: 0,
	isEditingTitle: false,
	titleInput: "",
	username: ""
};
var useCanvasStore = create((set) => ({
	...initialState,
	setCanvasData: (canvasData) => set({ canvasData }),
	setLoading: (loading) => set({ loading }),
	setLoadError: (loadError) => set({ loadError }),
	setIsChangingCanvas: (isChangingCanvas) => set({ isChangingCanvas }),
	setElements: (elements) => set({ elements }),
	setAppState: (appState) => set({ appState }),
	setExcalidrawAPI: (excalidrawAPI) => set({ excalidrawAPI }),
	setExcalidrawModule: (excalidrawModule) => set({ excalidrawModule }),
	setModuleError: (moduleError) => set({ moduleError }),
	setSaveStatus: (saveStatus) => set({ saveStatus }),
	setCollaborators: (collaborators) => set({ collaborators }),
	setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),
	setTitleInput: (titleInput) => set({ titleInput }),
	setUsername: (username) => set({ username }),
	reset: () => set({ ...initialState })
}));
function LibraryPanelTab() {
	const savedLibraries = useLibraryStore((s) => s.savedLibraries);
	const setSavedLibraries = useLibraryStore((s) => s.setSavedLibraries);
	(0, import_react.useEffect)(() => {
		let active = true;
		const load = () => {
			getSavedLibraries().then((saved) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 3,
		height: "100%",
		isScrollable: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				gap: 2,
				align: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Library,
					size: "sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 3,
					children: "Drawy libraries"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackItem, {
				size: "fill",
				children: savedLibraries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
					hasDividers: true,
					children: savedLibraries.map((library) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListItem, {
						label: library.name,
						description: `${libraryItemCount(library)} items`,
						startContent: library.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: getLibraryAssetUrl(library.preview),
							alt: "",
							className: "h-7 w-9 rounded object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Library,
							size: "sm"
						}),
						endContent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Eye,
							size: "sm"
						}),
						onClick: () => requestLibraryBrowse(library.id)
					}, library.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "No saved libraries yet. Save one to browse and use its items on your canvas."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				label: "Open library browser",
				variant: "secondary",
				size: "sm",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Compass,
					size: "sm"
				}),
				onClick: () => requestLibraryBrowse(null),
				width: "100%"
			})
		]
	});
}
var MAX_IMAGE_DIMENSION = 1920;
var COMPRESSION_QUALITY = .82;
var MAX_DATA_URL_LENGTH_BEFORE_COMPRESS = 3e5;
async function compressDataUrl(dataURL, mimeType, maxDimension = MAX_IMAGE_DIMENSION, quality = COMPRESSION_QUALITY) {
	if (!dataURL.startsWith("data:image/")) return {
		dataURL,
		mimeType
	};
	if (mimeType === "image/svg+xml" || dataURL.startsWith("data:image/svg+xml")) return {
		dataURL,
		mimeType: "image/svg+xml"
	};
	if (dataURL.length < MAX_DATA_URL_LENGTH_BEFORE_COMPRESS) return {
		dataURL,
		mimeType
	};
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			let { width, height } = img;
			if (width <= 0 || height <= 0) {
				resolve({
					dataURL,
					mimeType
				});
				return;
			}
			if (width > maxDimension || height > maxDimension) {
				if (width > height) {
					height = Math.round(height * maxDimension / width);
					width = maxDimension;
				} else {
					width = Math.round(width * maxDimension / height);
					height = maxDimension;
				}
			}
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve({
					dataURL,
					mimeType
				});
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);
			const targetMime = "image/webp";
			const compressed = canvas.toDataURL(targetMime, quality);
			if (compressed.length < dataURL.length) resolve({
				dataURL: compressed,
				mimeType: targetMime
			});
			else resolve({
				dataURL,
				mimeType
			});
		};
		img.onerror = () => {
			resolve({
				dataURL,
				mimeType
			});
		};
		img.src = dataURL;
	});
}
function pruneUnusedFiles(files, elements) {
	if (!files || Object.keys(files).length === 0) return {};
	const usedFileIds = /* @__PURE__ */ new Set();
	for (const el of elements) if (el.type === "image" && "fileId" in el && el.fileId) usedFileIds.add(el.fileId);
	const pruned = {};
	for (const [id, file] of Object.entries(files)) if (usedFileIds.has(id)) pruned[id] = file;
	return pruned;
}
async function uploadPendingAssets(canvasId, files, uploadFn) {
	if (!files || Object.keys(files).length === 0) return {
		updatedFiles: files || {},
		hasNewUploads: false
	};
	const updated = { ...files };
	let hasNewUploads = false;
	const entries = Object.entries(files).filter(([, file]) => file?.dataURL?.startsWith("data:"));
	const results = await Promise.all(entries.map(async ([id, file]) => {
		try {
			const { dataURL, mimeType } = await compressDataUrl(file.dataURL, file.mimeType);
			return {
				id,
				file,
				res: await uploadFn(canvasId, id, mimeType, dataURL)
			};
		} catch (err) {
			console.error(`Failed to upload asset ${id} to Supabase storage:`, err);
			return null;
		}
	}));
	for (const result of results) {
		if (!result?.res?.url) continue;
		const { id, file, res } = result;
		updated[id] = {
			...file,
			dataURL: res.url,
			mimeType: res.mimeType
		};
		hasNewUploads = true;
	}
	return {
		updatedFiles: updated,
		hasNewUploads
	};
}
function areElementsEqual(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i].id !== b[i].id || a[i].version !== b[i].version) return false;
	return true;
}
function areAppStatesEqual(a, b) {
	return a.gridSize === b.gridSize && a.zenModeEnabled === b.zenModeEnabled && a.gridModeEnabled === b.gridModeEnabled && a.viewModeEnabled === b.viewModeEnabled;
}
function getPersistentAppState(appState) {
	if (!appState) return {};
	return {
		viewBackgroundColor: appState.viewBackgroundColor,
		gridSize: appState.gridSize,
		zenModeEnabled: appState.zenModeEnabled,
		gridModeEnabled: appState.gridModeEnabled,
		viewModeEnabled: appState.viewModeEnabled
	};
}
function withTimeout$1(promise, ms, label) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out after ${ms}ms`)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
function useCanvasHandlers({ id, filesRef, excalidrawAPI, isSavingRef, realtimeRef, applyingRemoteRef, lastLocalEditRef, lastSavedData, fetchCanvas }) {
	const setElements = useCanvasStore((s) => s.setElements);
	const setAppState = useCanvasStore((s) => s.setAppState);
	const setSaveStatus = useCanvasStore((s) => s.setSaveStatus);
	const handleManualSave = (0, import_react.useCallback)(async () => {
		const { elements: currentElements, appState: currentAppState, saveStatus: currentStatus } = useCanvasStore.getState();
		if (!id || isSavingRef.current || currentStatus !== "unsaved") return;
		setSaveStatus("saving");
		isSavingRef.current = true;
		try {
			const prunedFiles = pruneUnusedFiles(filesRef.current, currentElements);
			filesRef.current = prunedFiles;
			await withTimeout$1(saveCanvas(id, currentElements, currentAppState, prunedFiles), 12e3, "Saving canvas");
			setSaveStatus("saved");
			realtimeRef.current?.broadcastSaved();
		} catch (error) {
			console.error("Failed to save canvas:", error);
			setSaveStatus("unsaved");
		} finally {
			isSavingRef.current = false;
		}
	}, [id, setSaveStatus]);
	const broadcastScene = (0, import_react.useCallback)((excalidrawElements, files) => {
		realtimeRef.current?.broadcastScene(excalidrawElements, files);
	}, []);
	return {
		handleManualSave,
		broadcastScene,
		handleExcalidrawChange: (0, import_react.useCallback)((excalidrawElements, excalidrawAppState, newFiles) => {
			const { loading: currentLoading, isChangingCanvas: currentChanging, excalidrawAPI: api } = useCanvasStore.getState();
			if (currentLoading || currentChanging) return;
			let filesChanged = false;
			let currentFiles = filesRef.current;
			if (newFiles && Object.keys(newFiles).length > 0) {
				currentFiles = {
					...currentFiles,
					...newFiles
				};
				filesRef.current = currentFiles;
				filesChanged = true;
				if (id) uploadPendingAssets(id, currentFiles, uploadCanvasAsset).then(({ updatedFiles, hasNewUploads }) => {
					if (hasNewUploads) {
						filesRef.current = {
							...filesRef.current,
							...updatedFiles
						};
						if (api) api.addFiles(Object.values(updatedFiles));
					}
				});
			}
			const currentElementsSig = excalidrawElements.map((e) => ({
				id: e.id,
				version: e.version
			}));
			const currentPersistentState = getPersistentAppState(excalidrawAppState);
			const savedElementsSig = lastSavedData.current?.elements || [];
			const savedPersistentState = lastSavedData.current?.appState || {};
			const elementsChanged = !areElementsEqual(currentElementsSig, savedElementsSig);
			const appStateChanged = !areAppStatesEqual(currentPersistentState, savedPersistentState);
			if (!elementsChanged && !appStateChanged && !filesChanged) return;
			setElements([...excalidrawElements]);
			setAppState(currentPersistentState);
			if (applyingRemoteRef.current) {
				lastSavedData.current = {
					elements: currentElementsSig,
					appState: currentPersistentState
				};
				return;
			}
			lastLocalEditRef.current = Date.now();
			setSaveStatus("unsaved");
			lastSavedData.current = {
				elements: currentElementsSig,
				appState: currentPersistentState
			};
			if (elementsChanged || filesChanged) broadcastScene(excalidrawElements, currentFiles);
		}, [
			id,
			broadcastScene,
			setElements,
			setAppState,
			setSaveStatus
		]),
		handleExportToJSON: (0, import_react.useCallback)(() => {
			const { canvasData, elements, appState } = useCanvasStore.getState();
			if (!canvasData) return;
			const exportData = {
				type: "excalidraw",
				version: 2,
				elements,
				appState,
				files: filesRef.current
			};
			const jsonString = JSON.stringify(exportData, null, 2);
			const blob = new Blob([jsonString], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${canvasData.title || "untitled"}.excalidraw`;
			link.click();
			URL.revokeObjectURL(url);
		}, []),
		handleImportFromJSON: (0, import_react.useCallback)(() => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".json,.excalidraw";
			input.onchange = (e) => {
				const file = e.target.files?.[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const imported = JSON.parse(event.target?.result);
						if (imported && Array.isArray(imported.elements)) {
							if (excalidrawAPI) {
								const importedAppState = getPersistentAppState(imported.appState || {});
								if (imported.files) {
									filesRef.current = {
										...filesRef.current,
										...imported.files
									};
									excalidrawAPI.addFiles(Object.values(imported.files));
								}
								excalidrawAPI.updateScene({
									elements: imported.elements,
									appState: { ...importedAppState }
								});
								setElements(imported.elements);
								setAppState(importedAppState);
								setSaveStatus("unsaved");
							}
						} else alert("Invalid Excalidraw file structure.");
					} catch (err) {
						console.error("Failed to parse imported file:", err);
						alert("Failed to parse the imported file.");
					}
				};
				reader.readAsText(file);
			};
			input.click();
		}, [
			excalidrawAPI,
			setElements,
			setAppState,
			setSaveStatus
		]),
		handleExportToPNG: (0, import_react.useCallback)(async () => {
			if (!excalidrawAPI) return;
			const { canvasData } = useCanvasStore.getState();
			if (!canvasData) return;
			try {
				const currentElements = excalidrawAPI.getSceneElements();
				const currentAppState = excalidrawAPI.getAppState();
				const blob = await useCanvasStore.getState().excalidrawModule?.exportToBlob?.({
					elements: currentElements,
					appState: currentAppState,
					files: filesRef.current,
					mimeType: "image/png",
					exportPadding: 15
				});
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${canvasData.title || "drawing"}.png`;
				link.click();
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Failed to export PNG:", error);
			}
		}, [excalidrawAPI]),
		handleExportToSVG: (0, import_react.useCallback)(async () => {
			if (!excalidrawAPI) return;
			const { canvasData } = useCanvasStore.getState();
			if (!canvasData) return;
			try {
				const currentElements = excalidrawAPI.getSceneElements();
				const currentAppState = excalidrawAPI.getAppState();
				const svg = await useCanvasStore.getState().excalidrawModule?.exportToSvg?.({
					elements: currentElements,
					appState: currentAppState,
					files: filesRef.current,
					exportPadding: 15
				});
				const svgString = new XMLSerializer().serializeToString(svg);
				const blob = new Blob([svgString], { type: "image/svg+xml" });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${canvasData.title || "drawing"}.svg`;
				link.click();
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Failed to export SVG:", error);
			}
		}, [excalidrawAPI])
	};
}
function withTimeout(promise, ms, label) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out after ${ms}ms — slow network`)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
function useCanvasLifecycle({ id }) {
	const navigate = useNavigate();
	const canvasData = useCanvasStore((s) => s.canvasData);
	const loading = useCanvasStore((s) => s.loading);
	const loadError = useCanvasStore((s) => s.loadError);
	const isChangingCanvas = useCanvasStore((s) => s.isChangingCanvas);
	const elements = useCanvasStore((s) => s.elements);
	const appState = useCanvasStore((s) => s.appState);
	const excalidrawAPI = useCanvasStore((s) => s.excalidrawAPI);
	const excalidrawModule = useCanvasStore((s) => s.excalidrawModule);
	const moduleError = useCanvasStore((s) => s.moduleError);
	const saveStatus = useCanvasStore((s) => s.saveStatus);
	const collaborators = useCanvasStore((s) => s.collaborators);
	const username = useCanvasStore((s) => s.username);
	const { setCanvasData, setLoading, setLoadError, setIsChangingCanvas, setElements, setAppState, setExcalidrawAPI, setExcalidrawModule, setModuleError, setSaveStatus, setCollaborators, reset: resetCanvas } = useCanvasStore.getState();
	const filesRef = (0, import_react.useRef)({});
	const initialLibraryItemsRef = (0, import_react.useRef)(null);
	if (!initialLibraryItemsRef.current) initialLibraryItemsRef.current = getUserLibrary();
	const isSavingRef = (0, import_react.useRef)(false);
	const realtimeRef = (0, import_react.useRef)(null);
	const applyingRemoteRef = (0, import_react.useRef)(false);
	const lastLocalEditRef = (0, import_react.useRef)(0);
	const lastSavedData = (0, import_react.useRef)({
		elements: [],
		appState: {}
	});
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		let cancelled = false;
		(async () => {
			try {
				setModuleError(null);
				const mod = await withTimeout(import("@excalidraw/excalidraw"), 15e3, "Loading editor");
				await Promise.resolve({});
				if (!cancelled) {
					setExcalidrawModule(mod);
					setModuleError(null);
				}
			} catch (err) {
				console.error("Failed to load Excalidraw:", err);
				if (!cancelled) setModuleError(err instanceof Error ? err.message : "Failed to load editor — slow network, please retry");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [setExcalidrawModule, setModuleError]);
	const fetchSeqRef = (0, import_react.useRef)(0);
	const fetchCanvas = (0, import_react.useCallback)(async (canvasId, isInitialMount) => {
		const seq = ++fetchSeqRef.current;
		if (isInitialMount) setLoading(true);
		else setIsChangingCanvas(true);
		setLoadError(null);
		try {
			const data = await withTimeout(loadCanvas(canvasId), 12e3, "Loading canvas");
			if (seq !== fetchSeqRef.current) return;
			if (data) {
				const sanitizedAppState = sanitizeExcalidrawAppState(data.appState);
				const resolvedElements = data.elements || [];
				const resolvedFiles = data.files || {};
				filesRef.current = resolvedFiles;
				setCanvasData({
					...data,
					appState: sanitizedAppState,
					files: resolvedFiles
				});
				setElements(resolvedElements);
				setAppState(sanitizedAppState);
				setLoadError(null);
				lastSavedData.current = {
					elements: resolvedElements.map((e) => ({
						id: e.id,
						version: e.version
					})),
					appState: getPersistentAppState(sanitizedAppState)
				};
				if (excalidrawAPI) {
					if (resolvedFiles && Object.keys(resolvedFiles).length > 0) excalidrawAPI.addFiles(Object.values(resolvedFiles));
					excalidrawAPI.updateScene({
						elements: resolvedElements,
						appState: { ...sanitizedAppState }
					});
				}
			} else navigate({ to: "/" });
		} catch (error) {
			if (seq !== fetchSeqRef.current) return;
			console.error("Failed to load canvas:", error);
			setLoadError(error instanceof Error ? error.message : "Failed to load canvas — check network and retry");
		} finally {
			if (seq !== fetchSeqRef.current) return;
			if (isInitialMount) setLoading(false);
			else setIsChangingCanvas(false);
		}
	}, [
		excalidrawAPI,
		navigate,
		setCanvasData,
		setElements,
		setAppState,
		setLoading,
		setLoadError,
		setIsChangingCanvas
	]);
	(0, import_react.useEffect)(() => {
		if (!id) return;
		setSaveStatus("saved");
		fetchCanvas(id, !excalidrawAPI);
	}, [
		id,
		excalidrawAPI,
		fetchCanvas,
		setSaveStatus
	]);
	(0, import_react.useEffect)(() => {
		const refreshCanvas = () => {
			if (!id) return;
			fetchCanvas(id, false);
		};
		addEventListener("canvas-updated", refreshCanvas);
		const unsubscribe = subscribeCanvasEvents(refreshCanvas);
		return () => {
			removeEventListener("canvas-updated", refreshCanvas);
			unsubscribe();
		};
	}, [id, fetchCanvas]);
	(0, import_react.useEffect)(() => {
		if (!id || !excalidrawAPI) return;
		const rt = new CanvasRealtime(id);
		realtimeRef.current = rt;
		rt.connect();
		const offScene = rt.onScene((payload) => {
			const api = excalidrawAPI;
			if (!api) return;
			if (payload.files && Object.keys(payload.files).length > 0) {
				filesRef.current = {
					...filesRef.current,
					...payload.files
				};
				api.addFiles(Object.values(payload.files));
			}
			const local = api.getSceneElements();
			const merged = mergeElements(local, payload.elements);
			applyingRemoteRef.current = true;
			lastSavedData.current = {
				elements: merged.map((e) => ({
					id: e.id,
					version: e.version
				})),
				appState: lastSavedData.current.appState
			};
			api.updateScene({ elements: merged });
			applyingRemoteRef.current = false;
		});
		const offSaved = rt.onSaved(() => {
			if (!id) return;
			if (Date.now() - lastLocalEditRef.current < 4e3) return;
			fetchCanvas(id, false);
		});
		const offPresence = rt.onPresence((count) => setCollaborators(count));
		return () => {
			offScene();
			offSaved();
			offPresence();
			rt.disconnect();
			realtimeRef.current = null;
		};
	}, [
		id,
		excalidrawAPI,
		fetchCanvas,
		setCollaborators
	]);
	(0, import_react.useEffect)(() => {
		if (loading || isChangingCanvas || !id || saveStatus !== "unsaved") return;
		const timer = setTimeout(async () => {
			setSaveStatus("saving");
			isSavingRef.current = true;
			try {
				const prunedFiles = pruneUnusedFiles(filesRef.current, elements);
				filesRef.current = prunedFiles;
				await withTimeout(saveCanvas(id, elements, appState, prunedFiles), 12e3, "Saving canvas");
				setSaveStatus("saved");
				realtimeRef.current?.broadcastSaved();
			} catch (error) {
				console.error("Failed to auto-save canvas:", error);
				setSaveStatus("unsaved");
			} finally {
				isSavingRef.current = false;
			}
		}, 1500);
		return () => clearTimeout(timer);
	}, [
		elements,
		appState,
		id,
		loading,
		isChangingCanvas,
		saveStatus,
		setSaveStatus
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			resetCanvas();
		};
	}, [resetCanvas]);
	return {
		canvasData,
		loading,
		loadError,
		isChangingCanvas,
		elements,
		appState,
		excalidrawAPI,
		excalidrawModule,
		moduleError,
		saveStatus,
		collaborators,
		username,
		filesRef,
		initialLibraryItemsRef,
		isSavingRef,
		realtimeRef,
		applyingRemoteRef,
		lastLocalEditRef,
		lastSavedData,
		setCanvasData,
		setElements,
		setAppState,
		setExcalidrawAPI,
		setSaveStatus,
		setIsEditingTitle: useCanvasStore.getState().setIsEditingTitle,
		setTitleInput: useCanvasStore.getState().setTitleInput,
		setLoadError,
		setModuleError,
		fetchCanvas
	};
}
var RealtimeCursors = (0, import_react.lazy)(() => import("./realtime-cursors-DQXj5v-7.mjs").then((m) => ({ default: m.RealtimeCursors })));
function CanvasEditor({ id, username: propUsername }) {
	const navigate = useNavigate();
	const { mode } = useTheme();
	const lifecycle = useCanvasLifecycle({ id });
	const handlers = useCanvasHandlers({
		id,
		filesRef: lifecycle.filesRef,
		excalidrawAPI: lifecycle.excalidrawAPI,
		isSavingRef: lifecycle.isSavingRef,
		realtimeRef: lifecycle.realtimeRef,
		applyingRemoteRef: lifecycle.applyingRemoteRef,
		lastLocalEditRef: lifecycle.lastLocalEditRef,
		lastSavedData: lifecycle.lastSavedData,
		fetchCanvas: lifecycle.fetchCanvas
	});
	const openShareCanvas = useUIStore((s) => s.openShareCanvas);
	const setUsername = useCanvasStore((s) => s.setUsername);
	(0, import_react.useEffect)(() => {
		if (propUsername) {
			setUsername(propUsername);
			return;
		}
		let cancelled = false;
		getCurrentUser().then((currentUser) => {
			if (!cancelled && currentUser?.username) setUsername(currentUser.username);
		});
		return () => {
			cancelled = true;
		};
	}, [propUsername, setUsername]);
	const librarySaveTimerRef = (0, import_react.useRef)(null);
	const pendingLibraryRef = (0, import_react.useRef)(null);
	const handleLibraryChange = (0, import_react.useCallback)((items) => {
		pendingLibraryRef.current = [...items];
		if (librarySaveTimerRef.current !== null) globalThis.clearTimeout(librarySaveTimerRef.current);
		librarySaveTimerRef.current = globalThis.setTimeout(() => {
			const toSave = pendingLibraryRef.current;
			pendingLibraryRef.current = null;
			if (toSave) setUserLibrary(toSave);
		}, 300);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			if (librarySaveTimerRef.current !== null) {
				clearTimeout(librarySaveTimerRef.current);
				librarySaveTimerRef.current = null;
			}
			const toSave = pendingLibraryRef.current;
			pendingLibraryRef.current = null;
			if (toSave) setUserLibrary(toSave);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!lifecycle.excalidrawAPI) return;
		return onLibraryItemsInstalled((items) => {
			lifecycle.excalidrawAPI?.updateLibrary({
				libraryItems: items,
				merge: true
			});
		});
	}, [lifecycle.excalidrawAPI]);
	const isEditingTitle = useCanvasStore((s) => s.isEditingTitle);
	const titleInput = useCanvasStore((s) => s.titleInput);
	const setIsEditingTitle = useCanvasStore((s) => s.setIsEditingTitle);
	const setTitleInput = useCanvasStore((s) => s.setTitleInput);
	const handleTitleSave = (0, import_react.useCallback)(async () => {
		if (!id || !titleInput.trim()) return;
		try {
			const withTimeout = (p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(/* @__PURE__ */ new Error("Saving title timed out — slow network")), 12e3))]);
			await withTimeout(updateCanvasTitle(id, titleInput.trim()));
			if (lifecycle.canvasData) lifecycle.setCanvasData({
				...lifecycle.canvasData,
				title: titleInput.trim()
			});
			setIsEditingTitle(false);
			globalThis.dispatchEvent(new Event("canvas-updated"));
		} catch (error) {
			console.error("Failed to update title:", error);
		}
	}, [
		id,
		titleInput,
		lifecycle.canvasData,
		lifecycle.setCanvasData,
		setIsEditingTitle
	]);
	const handleTitleKeyDown = (0, import_react.useCallback)((e) => {
		if (e.key === "Enter") handleTitleSave();
		else if (e.key === "Escape") {
			setTitleInput(lifecycle.canvasData?.title || "");
			setIsEditingTitle(false);
		}
	}, [
		handleTitleSave,
		lifecycle.canvasData?.title,
		setTitleInput,
		setIsEditingTitle
	]);
	if (lifecycle.loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 0,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 2,
				hAlign: "center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "lg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: "Loading canvas…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: "Slow network — hang tight"
					})
				]
			})
		})
	});
	if (lifecycle.loadError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 0,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 3,
				hAlign: "center",
				maxWidth: 400,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						weight: "medium",
						children: "Failed to load canvas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						justify: "center",
						children: lifecycle.loadError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
						gap: 2,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							label: "Retry",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: LoaderCircle,
								size: "sm"
							}),
							onClick: () => void lifecycle.fetchCanvas(id, true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							label: "Back to workspace",
							variant: "ghost",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: ArrowLeft,
								size: "sm"
							}),
							onClick: () => navigate({ to: "/" })
						})]
					})
				]
			})
		})
	});
	if (lifecycle.moduleError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 0,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 3,
				hAlign: "center",
				maxWidth: 400,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						weight: "medium",
						children: "Failed to load editor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						justify: "center",
						children: lifecycle.moduleError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Retry",
						onClick: () => globalThis.location.reload()
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 0,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, {
			height: "fill",
			header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutHeader, {
				hasDivider: true,
				padding: 2,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
					justify: "between",
					align: "center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
						gap: 2,
						align: "center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Back to workspace",
								variant: "ghost",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: ArrowLeft,
									size: "sm"
								}),
								onClick: () => navigate({ to: "/" }),
								tooltip: "Back to workspace"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { orientation: "vertical" }),
							isEditingTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								label: "Canvas title",
								isLabelHidden: true,
								value: titleInput,
								onChange: setTitleInput,
								onKeyDown: handleTitleKeyDown,
								hasAutoFocus: true,
								size: "sm",
								width: 280
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								label: lifecycle.canvasData?.title || "Untitled",
								variant: "ghost",
								size: "sm",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: Pencil,
									size: "sm"
								}),
								onClick: () => setIsEditingTitle(true),
								tooltip: "Click to rename"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
						gap: 2,
						align: "center",
						children: [
							lifecycle.collaborators >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								type: "supporting",
								children: [
									lifecycle.collaborators,
									" active",
									" ",
									lifecycle.collaborators === 1 ? "user" : "users"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								type: "supporting",
								children: lifecycle.saveStatus === "saving" ? "Saving..." : lifecycle.saveStatus === "saved" ? "Saved" : "Unsaved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Save",
								variant: "ghost",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: Save,
									size: "sm"
								}),
								tooltip: "Save",
								isLoading: lifecycle.saveStatus === "saving",
								isDisabled: lifecycle.saveStatus === "saved",
								onClick: handlers.handleManualSave
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								label: "Share",
								variant: "secondary",
								size: "sm",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: Share2,
									size: "sm"
								}),
								onClick: () => lifecycle.canvasData && openShareCanvas({
									canvasId: id,
									owner: lifecycle.canvasData.owner,
									isOwner: lifecycle.canvasData.isOwner,
									sharedWith: lifecycle.canvasData.sharedWith
								})
							})
						]
					})]
				})
			}),
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutContent, {
				isScrollable: false,
				padding: 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-full w-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: null,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RealtimeCursors, {
									roomName: id,
									username: lifecycle.username || "Anonymous"
								})
							}),
							lifecycle.excalidrawModule ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(lifecycle.excalidrawModule.Excalidraw, {
								excalidrawAPI: lifecycle.setExcalidrawAPI,
								theme: mode,
								isCollaborating: true,
								onPointerUpdate: () => {},
								initialData: {
									elements: lifecycle.elements,
									appState: lifecycle.appState,
									files: lifecycle.filesRef.current,
									libraryItems: lifecycle.initialLibraryItemsRef.current ?? void 0
								},
								onChange: handlers.handleExcalidrawChange,
								onLibraryChange: handleLibraryChange,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(lifecycle.excalidrawModule.MainMenu, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.DefaultItems.ClearCanvas, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Separator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Item, {
											onSelect: handlers.handleExportToJSON,
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												icon: Download,
												size: "sm"
											}),
											children: "Export File (.excalidraw)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Item, {
											onSelect: handlers.handleImportFromJSON,
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												icon: Upload,
												size: "sm"
											}),
											children: "Import File (.excalidraw)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Separator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Item, {
											onSelect: handlers.handleExportToPNG,
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												icon: Image$1,
												size: "sm"
											}),
											children: "Export as PNG"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Item, {
											onSelect: handlers.handleExportToSVG,
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												icon: FileCode,
												size: "sm"
											}),
											children: "Export as SVG"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.Separator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.MainMenu.DefaultItems.Help, {})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.WelcomeScreen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(lifecycle.excalidrawModule.WelcomeScreen.Center, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.WelcomeScreen.Center.Logo, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											icon: PenTool,
											size: "lg"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.WelcomeScreen.Center.Heading, { children: "Drawy" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.WelcomeScreen.Center.MenuItemHelp, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											type: "supporting",
											justify: "center",
											children: "Sketch, add shapes, or use templates. Changes save automatically."
										})
									] }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(lifecycle.excalidrawModule.DefaultSidebar, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.DefaultSidebar.TabTriggers, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.Sidebar.TabTrigger, {
										tab: "drawy-libraries",
										title: "Drawy libraries",
										"aria-label": "Drawy libraries",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											icon: Layers,
											size: "sm"
										})
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(lifecycle.excalidrawModule.Sidebar.Tab, {
										tab: "drawy-libraries",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryPanelTab, {})
									})] })
								]
							}) : lifecycle.moduleError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
									gap: 2,
									hAlign: "center",
									maxWidth: 360,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											weight: "medium",
											children: "Editor failed to load"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											type: "supporting",
											justify: "center",
											children: lifecycle.moduleError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											label: "Retry",
											onClick: () => globalThis.location.reload()
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
									gap: 2,
									hAlign: "center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											icon: LoaderCircle,
											size: "lg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											type: "supporting",
											children: "Loading editor..."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											type: "supporting",
											children: "Slow network — this can take a moment"
										})
									]
								})
							}),
							lifecycle.isChangingCanvas && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: LoaderCircle,
									size: "lg"
								})
							})
						]
					})
				})
			})
		})
	});
}
//#endregion
export { CanvasEditor };
