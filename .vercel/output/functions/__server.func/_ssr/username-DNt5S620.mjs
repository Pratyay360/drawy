if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
//#region node_modules/.nitro/vite/services/ssr/assets/username-DNt5S620.js
var USERNAME_RE = /^[a-z0-9_-]+$/;
function normalizeUsername(username) {
	return username.trim().toLowerCase();
}
function usernameError(username) {
	const normalized = normalizeUsername(username);
	if (!USERNAME_RE.test(normalized)) return "Username may only contain letters, numbers, underscores, and dashes.";
	return null;
}
//#endregion
export { normalizeUsername, usernameError };
