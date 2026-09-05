if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { getRequestHeaders } from "./ssr.mjs";
import { createClient } from "../_libs/@supabase/ssr+[...].mjs";
import { createRouterClient } from "../_libs/@orpc/json-schema+[...].mjs";
import { createRouterUtils } from "../_libs/@orpc/tanstack-query+[...].mjs";
import { router_default } from "./router-CcE2zVrw.mjs";
import { create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/libraries-DLCIDk6W.js
var emptyShareForm = {
	targetUser: "",
	availableUsers: [],
	isSharing: false,
	unsharingUser: null,
	errorMsg: null,
	copied: false
};
var useUIStore = create((set) => ({
	libraryModal: {
		isOpen: false,
		initialBrowseId: null
	},
	shareModal: {
		isOpen: false,
		canvasId: null,
		owner: "",
		isOwner: false,
		sharedWith: [],
		...emptyShareForm
	},
	openLibraryBrowser: (initialBrowseId = null) => set({ libraryModal: {
		isOpen: true,
		initialBrowseId
	} }),
	closeLibraryBrowser: () => set((state) => ({ libraryModal: {
		...state.libraryModal,
		isOpen: false,
		initialBrowseId: null
	} })),
	openShareCanvas: (payload) => set({ shareModal: {
		...payload,
		isOpen: true,
		...emptyShareForm
	} }),
	closeShareCanvas: () => set((state) => ({ shareModal: {
		...state.shareModal,
		isOpen: false
	} })),
	setShareTargetUser: (targetUser) => set((s) => ({ shareModal: {
		...s.shareModal,
		targetUser
	} })),
	setShareAvailableUsers: (availableUsers) => set((s) => ({ shareModal: {
		...s.shareModal,
		availableUsers
	} })),
	setShareIsSharing: (isSharing) => set((s) => ({ shareModal: {
		...s.shareModal,
		isSharing
	} })),
	setShareUnsharingUser: (unsharingUser) => set((s) => ({ shareModal: {
		...s.shareModal,
		unsharingUser
	} })),
	setShareErrorMsg: (errorMsg) => set((s) => ({ shareModal: {
		...s.shareModal,
		errorMsg
	} })),
	setShareCopied: (copied) => set((s) => ({ shareModal: {
		...s.shareModal,
		copied
	} }))
}));
var getORPCClient = () => createRouterClient(router_default, { context: () => ({ request: { headers: getRequestHeaders() } }) });
var client = getORPCClient();
createRouterUtils(client);
var browserClient;
function getEnv(key) {
	const metaEnv = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_TMStxIe-4sVhIGu2vu6kgw_33JifIpS",
		"VITE_SUPABASE_URL": "https://hybfhglabiwnqezarhmz.supabase.co"
	};
	return metaEnv?.[`VITE_${key}`] ?? metaEnv?.[key] ?? process.env[`VITE_${key}`] ?? process.env[key];
}
function getSupabaseBrowserClient() {
	const url = getEnv("SUPABASE_URL");
	const key = getEnv("SUPABASE_PUBLISHABLE_KEY");
	if (!url || !key) throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set (check .env and Vercel env). Received url=" + String(url));
	if (browserClient) return browserClient;
	browserClient = createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false
		},
		realtime: { params: { eventsPerSecond: 30 } }
	});
	return browserClient;
}
var GLOBAL_CHANNEL = "drawy:canvases";
function mergeElements(local, remote) {
	if (!remote || remote.length === 0) return [...local];
	const byId = /* @__PURE__ */ new Map();
	for (const el of local) byId.set(el.id, el);
	for (const r of remote) {
		const existing = byId.get(r.id);
		const rv = r.version ?? 0;
		const lv = existing?.version ?? 0;
		if (!existing || rv >= lv) byId.set(r.id, r);
	}
	return [...byId.values()];
}
var CanvasRealtime = class {
	client = getSupabaseBrowserClient();
	channel;
	canvasId;
	sceneCbs = /* @__PURE__ */ new Set();
	savedCbs = /* @__PURE__ */ new Set();
	presenceCbs = /* @__PURE__ */ new Set();
	sceneTimer = null;
	pendingScene = null;
	constructor(canvasId) {
		this.canvasId = canvasId;
	}
	connect() {
		if (!this.client || this.channel) return;
		const channel = this.client.channel(`drawy:canvas:${this.canvasId}`, { config: {
			broadcast: { self: false },
			presence: { key: `client-${Math.random().toString(36).slice(2)}` }
		} });
		channel.on("broadcast", { event: "scene" }, ({ payload }) => {
			this.sceneCbs.forEach((fn) => fn(payload));
		});
		channel.on("broadcast", { event: "saved" }, () => {
			this.savedCbs.forEach((fn) => fn());
		});
		channel.on("presence", { event: "sync" }, () => {
			const state = channel.presenceState();
			const count = Object.keys(state).length;
			this.presenceCbs.forEach((fn) => fn(count));
		});
		channel.subscribe((status) => {
			if (status === "SUBSCRIBED") channel.track({ at: Date.now() });
		});
		this.channel = channel;
	}
	broadcastScene(elements, files) {
		if (!this.channel) return;
		this.pendingScene = {
			elements,
			files: files && Object.keys(files).length > 0 ? files : void 0
		};
		if (this.sceneTimer) return;
		this.sceneTimer = setTimeout(() => {
			this.sceneTimer = null;
			const payload = this.pendingScene;
			this.pendingScene = null;
			if (payload && this.channel) this.channel.send({
				type: "broadcast",
				event: "scene",
				payload
			});
		}, 250);
	}
	broadcastSaved() {
		if (!this.channel) return;
		this.channel.send({
			type: "broadcast",
			event: "saved",
			payload: {}
		});
	}
	onScene(cb) {
		this.sceneCbs.add(cb);
		return () => {
			this.sceneCbs.delete(cb);
		};
	}
	onSaved(cb) {
		this.savedCbs.add(cb);
		return () => {
			this.savedCbs.delete(cb);
		};
	}
	onPresence(cb) {
		this.presenceCbs.add(cb);
		if (this.channel) {
			const state = this.channel.presenceState();
			cb(Object.keys(state).length);
		}
		return () => {
			this.presenceCbs.delete(cb);
		};
	}
	disconnect() {
		if (this.sceneTimer) {
			clearTimeout(this.sceneTimer);
			this.sceneTimer = null;
		}
		if (this.channel) {
			this.channel.unsubscribe();
			this.channel = void 0;
		}
		this.sceneCbs.clear();
		this.savedCbs.clear();
		this.presenceCbs.clear();
	}
};
var globalChannel = null;
var globalListeners = /* @__PURE__ */ new Set();
function ensureGlobalChannel() {
	const client = getSupabaseBrowserClient();
	if (!client) return null;
	if (globalChannel) return globalChannel;
	const channel = client.channel(GLOBAL_CHANNEL, { config: { broadcast: { self: false } } });
	channel.on("broadcast", { event: "list-changed" }, () => {
		globalListeners.forEach((fn) => fn());
	});
	channel.subscribe();
	globalChannel = channel;
	return channel;
}
/** Tell other clients (and the workspace/sidebar) that the canvas list changed. */
function publishCanvasListChanged() {
	const channel = ensureGlobalChannel();
	if (channel) channel.send({
		type: "broadcast",
		event: "list-changed",
		payload: {}
	});
}
function subscribeCanvasListChanged(cb) {
	ensureGlobalChannel();
	globalListeners.add(cb);
	return () => {
		globalListeners.delete(cb);
	};
}
var REALTIME_CHANNEL = "canvas-updated";
var BROADCAST_CHANNEL = "drawy-canvas-updates";
function publishCanvasEvent() {
	dispatchEvent(new Event(REALTIME_CHANNEL));
	const channel = new BroadcastChannel(BROADCAST_CHANNEL);
	channel.postMessage({ type: REALTIME_CHANNEL });
	channel.close();
}
function subscribeCanvasEvents(cb) {
	const channel = new BroadcastChannel(BROADCAST_CHANNEL);
	const handler = (event) => {
		if (event.data?.type === REALTIME_CHANNEL) cb();
	};
	channel.addEventListener("message", handler);
	return () => {
		channel.removeEventListener("message", handler);
		channel.close();
	};
}
var CANVAS_UPDATED_EVENT = "canvas-updated";
function notifyCanvasUpdated() {
	dispatchEvent(new Event(CANVAS_UPDATED_EVENT));
}
function toCanvasData(row) {
	return {
		id: row.id,
		title: row.title,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		owner: row.owner,
		isOwner: row.isOwner,
		sharedWith: row.sharedWith,
		elements: Array.isArray(row.elements) ? row.elements : [],
		appState: row.appState,
		files: row.files
	};
}
async function listCanvases() {
	return client.canvases.list();
}
async function createCanvas(title) {
	const canvas = await client.canvases.create({ title });
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
	return canvas;
}
async function deleteCanvas(id) {
	await client.canvases.remove({ id });
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function loadCanvas(id) {
	const canvas = await client.canvases.get({ id });
	if (!canvas) return null;
	return toCanvasData(canvas);
}
async function saveCanvas(id, elements, appState, files) {
	await client.canvases.save({
		id,
		elements: [...elements],
		appState: sanitizeExcalidrawAppState(appState),
		files: files || {}
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
}
async function updateCanvasTitle(id, title) {
	await client.canvases.rename({
		id,
		title
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function shareCanvas(id, targetUsername) {
	await client.canvases.share({
		id,
		targetUsername
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function unshareCanvas(id, targetUsername) {
	await client.canvases.unshare({
		id,
		targetUsername
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function listAvailableUsers() {
	return client.canvases.listUsers();
}
async function uploadCanvasAsset(canvasId, fileId, mimeType, base64Data) {
	return client.canvases.uploadAsset({
		canvasId,
		fileId,
		mimeType,
		base64Data
	});
}
/** Keep only the app-state fields we persist, dropping transient editor state. */
function sanitizeExcalidrawAppState(appState) {
	if (!appState) return {};
	return {
		viewBackgroundColor: appState.viewBackgroundColor,
		gridSize: appState.gridSize,
		zenModeEnabled: appState.zenModeEnabled,
		gridModeEnabled: appState.gridModeEnabled,
		viewModeEnabled: appState.viewModeEnabled
	};
}
var LIBRARIES_API_URL = "https://libraries.excalidraw.com/libraries.json";
var SAVED_LIBRARIES_KEY = "drawy_saved_libraries";
var USER_LIBRARY_KEY = "drawy_user_library";
var LIBRARY_CONFIG_UPDATED_EVENT = "library-config-updated";
var LIBRARY_ITEMS_INSTALLED_EVENT = "library-items-installed";
function notifyLibraryConfigUpdated() {
	globalThis.dispatchEvent(new Event(LIBRARY_CONFIG_UPDATED_EVENT));
}
function onLibraryConfigUpdated(callback) {
	globalThis.addEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
	return () => globalThis.removeEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
}
function notifyLibraryItemsInstalled(items) {
	globalThis.dispatchEvent(new CustomEvent(LIBRARY_ITEMS_INSTALLED_EVENT, { detail: items }));
}
function requestLibraryBrowse(libraryId) {
	useUIStore.getState().openLibraryBrowser(libraryId);
}
/** Subscribe to libraries being installed/refreshed so canvases can merge them in. */
function onLibraryItemsInstalled(callback) {
	const handler = (event) => {
		const detail = event.detail;
		if (Array.isArray(detail)) callback(detail);
	};
	globalThis.addEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
	return () => globalThis.removeEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
}
async function getSavedLibraries() {
	try {
		const data = localStorage.getItem(SAVED_LIBRARIES_KEY);
		if (!data) return [];
		const parsed = JSON.parse(data);
		if (!Array.isArray(parsed)) return [];
		return parsed.map((lib) => ({
			...lib,
			items: Array.isArray(lib.items) ? lib.items : [],
			item_names: Array.isArray(lib.item_names) ? lib.item_names : []
		}));
	} catch (error) {
		console.error("Failed to parse saved libraries:", error);
		return [];
	}
}
/** Upsert the metadata bookmark for a library (content is managed separately). */
async function saveLibraryToConfig(library) {
	if (typeof window === "undefined") return;
	const next = (await getSavedLibraries()).filter((lib) => lib.id !== library.id);
	next.push(library);
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
	notifyLibraryConfigUpdated();
}
/** Persist fetched content (item names + normalized items) for a saved library. */
async function saveLibraryContent(id, itemNames, items) {
	const next = (await getSavedLibraries()).map((lib) => lib.id === id ? {
		...lib,
		item_names: itemNames,
		items,
		fetched_at: (/* @__PURE__ */ new Date()).toISOString()
	} : lib);
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
	notifyLibraryConfigUpdated();
}
async function removeLibraryFromConfig(id) {
	const saved = await getSavedLibraries();
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(saved.filter((lib) => lib.id !== id)));
	notifyLibraryConfigUpdated();
}
/** The user's full in-editor library (downloaded + hand-added items), persisted. */
async function getUserLibrary() {
	const data = localStorage.getItem(USER_LIBRARY_KEY);
	const parsed = data ? JSON.parse(data) : [];
	return Array.isArray(parsed) ? parsed : [];
}
async function setUserLibrary(items) {
	localStorage.setItem(USER_LIBRARY_KEY, JSON.stringify(items));
}
var installQueue = Promise.resolve();
/**
* Install library items: merge them into the persisted user library (deduped)
* and notify any mounted canvas to merge them into the editor library.
*/
function installLibraryItems(items) {
	if (!Array.isArray(items) || items.length === 0) return Promise.resolve();
	const task = installQueue.then(async () => {
		try {
			const current = await getUserLibrary();
			const existingIds = new Set(current.map((item) => item.id));
			const newItems = items.filter((item) => !existingIds.has(item.id));
			await setUserLibrary([...current, ...newItems]);
		} catch (error) {
			console.error("Failed to persist installed library items:", error);
		}
		notifyLibraryItemsInstalled(items);
	});
	installQueue = task.catch(() => {});
	return task;
}
//#endregion
export { CanvasRealtime, LIBRARIES_API_URL, createCanvas, deleteCanvas, getSavedLibraries, getUserLibrary, installLibraryItems, listAvailableUsers, listCanvases, loadCanvas, mergeElements, onLibraryConfigUpdated, onLibraryItemsInstalled, removeLibraryFromConfig, requestLibraryBrowse, sanitizeExcalidrawAppState, saveCanvas, saveLibraryContent, saveLibraryToConfig, setUserLibrary, shareCanvas, subscribeCanvasEvents, subscribeCanvasListChanged, unshareCanvas, updateCanvasTitle, uploadCanvasAsset, useUIStore };
