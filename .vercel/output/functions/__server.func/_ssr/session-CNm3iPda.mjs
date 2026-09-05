if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { TSS_SERVER_FUNCTION, createServerFn } from "./ssr.mjs";
import { object, string } from "../_libs/zod.mjs";
import { normalizeUsername } from "./username-DNt5S620.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-CNm3iPda.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var authInput = object({
	username: string().min(1, "Username is required"),
	password: string().min(1, "Password must be at least 1 characters").max(128, "Password is too long")
});
var getCurrentUser_createServerFn_handler = createServerRpc({
	id: "d5e82007b47147f145f963d5be968dacdc8650b94e7b7acbccd798481667f8c2",
	name: "getCurrentUser",
	filename: "src/lib/session.ts"
}, (opts) => getCurrentUser.__executeServer(opts));
var getCurrentUser = createServerFn({ method: "GET" }).handler(getCurrentUser_createServerFn_handler, async () => {
	const { resolveCurrentUserServer } = await import("./session.server-YQm_ac45.mjs");
	return resolveCurrentUserServer();
});
var signIn_createServerFn_handler = createServerRpc({
	id: "a4d3d4730f48f1e2519ac989fac8f688ba4c010085f3723244762dd3de614dca",
	name: "signIn",
	filename: "src/lib/session.ts"
}, (opts) => signIn.__executeServer(opts));
var signIn = createServerFn({ method: "POST" }).validator(authInput).handler(signIn_createServerFn_handler, async ({ data }) => {
	const username = normalizeUsername(data.username);
	const { signInServer } = await import("./session.server-YQm_ac45.mjs");
	return signInServer(username, data.password);
});
var signUp_createServerFn_handler = createServerRpc({
	id: "8fe7bbce9692fe7ceb3a35635e6520a7e1bd465714761009724ddc71260b5add",
	name: "signUp",
	filename: "src/lib/session.ts"
}, (opts) => signUp.__executeServer(opts));
var signUp = createServerFn({ method: "POST" }).validator(authInput).handler(signUp_createServerFn_handler, async ({ data }) => {
	const username = normalizeUsername(data.username);
	const { signUpServer } = await import("./session.server-YQm_ac45.mjs");
	return signUpServer(username, data.password);
});
var logout_createServerFn_handler = createServerRpc({
	id: "1b90f4feb8175e40785b2aba78db201a0b0269327953c16d833808a1166bd7cd",
	name: "logout",
	filename: "src/lib/session.ts"
}, (opts) => logout.__executeServer(opts));
var logout = createServerFn({ method: "POST" }).handler(logout_createServerFn_handler, async () => {
	const { logoutServer } = await import("./session.server-YQm_ac45.mjs");
	return logoutServer();
});
//#endregion
export { getCurrentUser_createServerFn_handler, logout_createServerFn_handler, signIn_createServerFn_handler, signUp_createServerFn_handler };
