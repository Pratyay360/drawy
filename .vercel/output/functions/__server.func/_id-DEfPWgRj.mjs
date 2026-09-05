if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "./_runtime.mjs";
import { AppShell, Center, Icon, Text, VStack, require_jsx_runtime, require_react } from "./_libs/@astryxdesign/core+[...].mjs";
import { LoaderCircle } from "./_libs/lucide-react.mjs";
import { Route$1, getCurrentUser } from "./_ssr/router-CcE2zVrw.mjs";
import { Sidebar } from "./_ssr/sidebar-DGqgt6G2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-DEfPWgRj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoadingShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		contentPadding: 0,
		sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 2,
				hAlign: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: LoaderCircle,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "Loading editor..."
				})]
			})
		})
	});
}
function CanvasRoute() {
	const { id } = Route$1.useParams();
	const [Editor, setEditor] = (0, import_react.useState)(null);
	const [username, setUsername] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getCurrentUser().then((currentUser) => {
			if (!cancelled && currentUser?.username) setUsername(currentUser.username);
		});
		import("./_ssr/canvas-editor-BzpPbAFl.mjs").then((module) => {
			if (!cancelled) setEditor(() => module.CanvasEditor);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!Editor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingShell, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		id,
		username
	});
}
//#endregion
export { CanvasRoute as component };
