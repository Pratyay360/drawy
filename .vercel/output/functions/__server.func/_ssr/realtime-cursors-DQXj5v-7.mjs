if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { createBrowserClient } from "../_libs/@supabase/ssr+[...].mjs";
import { REALTIME_SUBSCRIBE_STATES } from "../_libs/supabase__realtime-js.mjs";
import { MousePointer2 } from "../_libs/lucide-react.mjs";
import { create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/realtime-cursors-DQXj5v-7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialState = { cursors: {} };
var useRealtimeCursorStore = create((set) => ({
	...initialState,
	setCursors: (value) => set((state) => ({ cursors: typeof value === "function" ? value(state.cursors) : value })),
	reset: () => set({ ...initialState })
}));
var client;
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
function createClient$1() {
	if (client) return client;
	const url = getEnv("SUPABASE_URL");
	const key = getEnv("SUPABASE_PUBLISHABLE_KEY");
	if (!url || !key) throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set (check .env and Vercel env). Received url=" + String(url) + " key=" + (String(key)?.slice(0, 8) ?? "undefined"));
	client = createBrowserClient(url, key);
	return client;
}
function useThrottleCallback(callback, delay) {
	const lastCall = (0, import_react.useRef)(0);
	const timeout = (0, import_react.useRef)(null);
	return (0, import_react.useCallback)((...args) => {
		const now = Date.now();
		const remainingTime = delay - (now - lastCall.current);
		if (remainingTime <= 0) {
			if (timeout.current) {
				clearTimeout(timeout.current);
				timeout.current = null;
			}
			lastCall.current = now;
			callback(...args);
		} else if (!timeout.current) timeout.current = setTimeout(() => {
			lastCall.current = Date.now();
			timeout.current = null;
			callback(...args);
		}, remainingTime);
	}, [callback, delay]);
}
var supabase = createClient$1();
var generateRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
var generateClientId = () => {
	const c = globalThis.crypto;
	if (c?.randomUUID) return c.randomUUID();
	return `client-${Math.random().toString(36).slice(2)}`;
};
var EVENT_NAME = "realtime-cursor-move";
var useRealtimeCursors = ({ roomName, username, throttleMs }) => {
	const [color] = (0, import_react.useState)(generateRandomColor());
	const [userId] = (0, import_react.useState)(generateClientId());
	const setCursors = useRealtimeCursorStore((s) => s.setCursors);
	const cursors = useRealtimeCursorStore((s) => s.cursors);
	const cursorPayload = (0, import_react.useRef)(null);
	const channelRef = (0, import_react.useRef)(null);
	const handleMouseMove = useThrottleCallback((0, import_react.useCallback)((event) => {
		const { clientX, clientY } = event;
		const payload = {
			position: {
				x: clientX,
				y: clientY
			},
			user: {
				id: userId,
				name: username
			},
			color,
			timestamp: Date.now()
		};
		cursorPayload.current = payload;
		channelRef.current?.send({
			type: "broadcast",
			event: EVENT_NAME,
			payload
		});
	}, [
		color,
		userId,
		username
	]), throttleMs);
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(roomName, { config: { presence: { key: userId } } });
		channel.on("presence", { event: "leave" }, ({ leftPresences }) => {
			leftPresences.forEach((element) => {
				setCursors((prev) => {
					if (prev[element.key]) delete prev[element.key];
					return { ...prev };
				});
			});
		}).on("presence", { event: "join" }, () => {
			if (!cursorPayload.current) return;
			channelRef.current?.send({
				type: "broadcast",
				event: EVENT_NAME,
				payload: cursorPayload.current
			});
		}).on("broadcast", { event: EVENT_NAME }, (data) => {
			const { user } = data.payload;
			if (user.id === userId) return;
			setCursors((prev) => {
				if (prev[userId]) delete prev[userId];
				return {
					...prev,
					[user.id]: data.payload
				};
			});
		}).subscribe(async (status) => {
			if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
				await channel.track({ id: userId });
				channelRef.current = channel;
			} else {
				setCursors({});
				channelRef.current = null;
			}
		});
		return () => {
			channel.unsubscribe();
			channelRef.current = null;
		};
	}, [
		roomName,
		userId,
		setCursors
	]);
	(0, import_react.useEffect)(() => {
		addEventListener("mousemove", handleMouseMove);
		return () => {
			removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);
	return { cursors };
};
var Cursor = ({ className, style, color, name }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-none${className ? ` ${className}` : ""}`,
		style,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, {
			color,
			fill: color,
			size: 30
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 px-2 py-1 rounded-sm text-xs font-bold text-white text-center",
			style: { backgroundColor: color },
			children: name
		})]
	});
};
var RealtimeCursors = ({ roomName, username }) => {
	const { cursors } = useRealtimeCursors({
		roomName,
		username,
		throttleMs: 30
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: Object.keys(cursors).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cursor, {
		className: "fixed transition-transform ease-in-out z-50",
		style: {
			transitionDuration: "30ms",
			top: 0,
			left: 0,
			transform: `translate(${cursors[id].position.x}px, ${cursors[id].position.y}px)`
		},
		color: cursors[id].color,
		name: cursors[id].user.name
	}, id)) });
};
//#endregion
export { RealtimeCursors };
