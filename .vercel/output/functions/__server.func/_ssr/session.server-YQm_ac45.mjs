if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { clearSession$1, getSession$1, updateSession$1 } from "./ssr.mjs";
import { createSupabaseAdminClient } from "./server-supabase-DoqNbnQq.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/session.server-YQm_ac45.js
var SESSION_COOKIE_NAME = "drawy-session";
var SESSION_MAX_AGE = 604800;
var PASSWORD_KEY_LENGTH = 64;
var PASSWORD_SALT_LENGTH = 16;
function getSessionConfig() {
	const password = process.env.SESSION_SECRET;
	if (!password) throw new Error("SESSION_SECRET is not set");
	return {
		name: SESSION_COOKIE_NAME,
		password,
		maxAge: SESSION_MAX_AGE,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/"
		}
	};
}
function hashPassword(password, salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex")) {
	return `scrypt$${salt}$${scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex")}`;
}
function verifyPassword(password, storedHash) {
	const parts = storedHash.split("$");
	if (parts.length !== 3 || parts[0] !== "scrypt") return false;
	const [, salt, keyHex] = parts;
	const derivedKey = scryptSync(password, salt, keyHex.length / 2);
	const expected = Buffer.from(keyHex, "hex");
	if (expected.length !== derivedKey.length) return false;
	return timingSafeEqual(expected, derivedKey);
}
function validateCredentials(username, _password) {
	if (!/^[a-zA-Z0-9_-]+$/.test(username)) throw new Error("Username can only contain letters, numbers, underscores, and hyphens.");
}
async function loadCurrentUser() {
	const username = (await getSession$1(getSessionConfig())).data.username;
	if (!username) return null;
	const { data } = await createSupabaseAdminClient().from("app_users").select("username").eq("username", username).maybeSingle();
	if (!data) return null;
	return { username: data.username };
}
async function resolveCurrentUserServer() {
	return loadCurrentUser();
}
async function signInServer(username, _password) {
	validateCredentials(username, _password);
	const { data: user, error } = await createSupabaseAdminClient().from("app_users").select("username, password_hash").eq("username", username).maybeSingle();
	if (error || !user) throw new Error("Invalid username or password.");
	if (!verifyPassword(_password, user.password_hash)) throw new Error("Invalid username or password.");
	await updateSession$1(getSessionConfig(), { username: user.username });
	return { username: user.username };
}
async function signUpServer(username, password) {
	validateCredentials(username, password);
	const supabase = createSupabaseAdminClient();
	const { data: existing, error: existingError } = await supabase.from("app_users").select("username").eq("username", username).maybeSingle();
	if (existingError) throw new Error("Failed to check username availability.");
	if (existing) throw new Error("Username already exists.");
	const passwordHash = hashPassword(password);
	const { data: created, error } = await supabase.from("app_users").insert({
		username,
		password_hash: passwordHash
	}).select("username").single();
	if (error || !created) throw new Error("Failed to create account.");
	await updateSession$1(getSessionConfig(), { username: created.username });
	return { username: created.username };
}
async function logoutServer() {
	await clearSession$1(getSessionConfig());
	return { ok: true };
}
//#endregion
export { logoutServer, resolveCurrentUserServer, signInServer, signUpServer };
