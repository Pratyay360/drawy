if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __rest } from "tslib";
//#region node_modules/@supabase/auth-js/dist/module/lib/version.js
var version = "2.115.0";
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/constants.js
/** Current session will be checked for refresh at this interval. */
var AUTO_REFRESH_TICK_DURATION_MS = 3e4;
var EXPIRY_MARGIN_MS = 3 * AUTO_REFRESH_TICK_DURATION_MS;
/**
* After a refresh fails, serial callers (including the next auto-refresh
* tick) within this window receive the cached failure instead of firing
* another /token request. Two ticks: each outage burns at most one /token
* call per cooldown window. Cleared on any successful refresh (locally or
* via BroadcastChannel from another tab) and on `_removeSession`.
*/
var REFRESH_FAILURE_COOLDOWN_MS = 2 * AUTO_REFRESH_TICK_DURATION_MS;
var GOTRUE_URL = "http://localhost:9999";
var STORAGE_KEY = "supabase.auth.token";
var DEFAULT_HEADERS = { "X-Client-Info": `gotrue-js/${version}` };
var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
var API_VERSIONS = { "2024-01-01": {
	timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
	name: "2024-01-01"
} };
var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
/**
* Reserved query parameter appended to `redirectTo` URLs (behind
* `experimental.appendPkceFlowIdToRedirects`) that correlates a PKCE callback
* with the code verifier stored when its flow started. It round-trips through
* the auth server untouched and identifies a verifier slot in storage — the
* verifier itself never appears in a URL.
*/
var PKCE_FLOW_ID_PARAM = "sb_flow_id";
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/errors.js
/**
* Base error thrown by Supabase Auth helpers.
*
* @example
* ```ts
* import { AuthError } from '@supabase/auth-js'
*
* throw new AuthError('Unexpected auth error', 500, 'unexpected')
* ```
*/
var AuthError = class extends Error {
	constructor(message, status, code) {
		super(message);
		this.__isAuthError = true;
		this.name = "AuthError";
		this.status = status;
		this.code = code;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			status: this.status,
			code: this.code
		};
	}
};
function isAuthError(error) {
	return typeof error === "object" && error !== null && "__isAuthError" in error;
}
/**
* Error returned directly from the GoTrue REST API.
*
* @example
* ```ts
* import { AuthApiError } from '@supabase/auth-js'
*
* throw new AuthApiError('Invalid credentials', 400, 'invalid_credentials')
* ```
*/
var AuthApiError = class extends AuthError {
	constructor(message, status, code) {
		super(message, status, code);
		this.name = "AuthApiError";
		this.status = status;
		this.code = code;
	}
};
function isAuthApiError(error) {
	return isAuthError(error) && error.name === "AuthApiError";
}
/**
* Wraps non-standard errors so callers can inspect the root cause.
*
* @example
* ```ts
* import { AuthUnknownError } from '@supabase/auth-js'
*
* try {
*   await someAuthCall()
* } catch (err) {
*   throw new AuthUnknownError('Auth failed', err)
* }
* ```
*/
var AuthUnknownError = class extends AuthError {
	constructor(message, originalError) {
		super(message);
		this.name = "AuthUnknownError";
		this.originalError = originalError;
	}
};
/**
* Flexible error class used to create named auth errors at runtime.
*
* @example
* ```ts
* import { CustomAuthError } from '@supabase/auth-js'
*
* throw new CustomAuthError('My custom auth error', 'MyAuthError', 400, 'custom_code')
* ```
*/
var CustomAuthError = class extends AuthError {
	constructor(message, name, status, code) {
		super(message, status, code);
		this.name = name;
		this.status = status;
	}
};
/**
* Error thrown when an operation requires a session but none is present.
*
* @example
* ```ts
* import { AuthSessionMissingError } from '@supabase/auth-js'
*
* throw new AuthSessionMissingError()
* ```
*/
var AuthSessionMissingError = class extends CustomAuthError {
	constructor() {
		super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
	}
};
function isAuthSessionMissingError(error) {
	return isAuthError(error) && error.name === "AuthSessionMissingError";
}
/**
* Error thrown when the token response is malformed.
*
* @example
* ```ts
* import { AuthInvalidTokenResponseError } from '@supabase/auth-js'
*
* throw new AuthInvalidTokenResponseError()
* ```
*/
var AuthInvalidTokenResponseError = class extends CustomAuthError {
	constructor() {
		super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
	}
};
/**
* Error thrown when email/password credentials are invalid.
*
* @example
* ```ts
* import { AuthInvalidCredentialsError } from '@supabase/auth-js'
*
* throw new AuthInvalidCredentialsError('Email or password is incorrect')
* ```
*/
var AuthInvalidCredentialsError = class extends CustomAuthError {
	constructor(message) {
		super(message, "AuthInvalidCredentialsError", 400, void 0);
	}
};
/**
* Error thrown when implicit grant redirects contain an error.
*
* @example
* ```ts
* import { AuthImplicitGrantRedirectError } from '@supabase/auth-js'
*
* throw new AuthImplicitGrantRedirectError('OAuth redirect failed', {
*   error: 'access_denied',
*   code: 'oauth_error',
* })
* ```
*/
var AuthImplicitGrantRedirectError = class extends CustomAuthError {
	constructor(message, details = null) {
		super(message, "AuthImplicitGrantRedirectError", 500, void 0);
		this.details = null;
		this.details = details;
	}
	toJSON() {
		return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
	}
};
function isAuthImplicitGrantRedirectError(error) {
	return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
/**
* Error thrown during PKCE code exchanges.
*
* @example
* ```ts
* import { AuthPKCEGrantCodeExchangeError } from '@supabase/auth-js'
*
* throw new AuthPKCEGrantCodeExchangeError('PKCE exchange failed')
* ```
*/
var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
	constructor(message, details = null) {
		super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
		this.details = null;
		this.details = details;
	}
	toJSON() {
		return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
	}
};
/**
* Error thrown when the PKCE code verifier is not found in storage.
* This typically happens when the auth flow was initiated in a different
* browser, device, or the storage was cleared.
*
* @example
* ```ts
* import { AuthPKCECodeVerifierMissingError } from '@supabase/auth-js'
*
* throw new AuthPKCECodeVerifierMissingError()
* ```
*/
var AuthPKCECodeVerifierMissingError = class extends CustomAuthError {
	constructor() {
		super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
	}
};
/**
* Error thrown when a transient fetch issue occurs.
*
* @example
* ```ts
* import { AuthRetryableFetchError } from '@supabase/auth-js'
*
* throw new AuthRetryableFetchError('Service temporarily unavailable', 503)
* ```
*/
var AuthRetryableFetchError = class extends CustomAuthError {
	constructor(message, status) {
		super(message, "AuthRetryableFetchError", status, void 0);
	}
};
function isAuthRetryableFetchError(error) {
	return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
/**
* Returned when the server rotated a refresh token successfully but the
* client chose not to persist the rotated tokens because the local session
* changed mid-flight. Usually means a concurrent `signOut` cleared storage
* between when the refresh started and when it came back.
*
* Set on the `error` field of the refresh result so callers can tell "we
* got rotated tokens but threw them away" apart from "the refresh failed."
* The rotated session on the server will be picked up on the next refresh
* via GoTrue's parent-of-active path.
*
* @example
* ```ts
* import { isAuthRefreshDiscardedError } from '@supabase/auth-js'
*
* if (isAuthRefreshDiscardedError(error)) {
*   // Concurrent signOut/sign-in raced our refresh. Treat as a no-op.
* }
* ```
*/
var AuthRefreshDiscardedError = class extends CustomAuthError {
	constructor(message = "Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)") {
		super(message, "AuthRefreshDiscardedError", 409, void 0);
	}
};
function isAuthRefreshDiscardedError(error) {
	return isAuthError(error) && error.name === "AuthRefreshDiscardedError";
}
/**
* This error is thrown on certain methods when the password used is deemed
* weak. Inspect the reasons to identify what password strength rules are
* inadequate.
*/
/**
* Error thrown when a supplied password is considered weak.
*
* @example
* ```ts
* import { AuthWeakPasswordError } from '@supabase/auth-js'
*
* throw new AuthWeakPasswordError('Password too short', 400, ['min_length'])
* ```
*/
var AuthWeakPasswordError = class extends CustomAuthError {
	constructor(message, status, reasons) {
		super(message, "AuthWeakPasswordError", status, "weak_password");
		this.reasons = reasons;
	}
	toJSON() {
		return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
	}
};
/**
* Error thrown when a JWT cannot be verified or parsed.
*
* @example
* ```ts
* import { AuthInvalidJwtError } from '@supabase/auth-js'
*
* throw new AuthInvalidJwtError('Token signature is invalid')
* ```
*/
var AuthInvalidJwtError = class extends CustomAuthError {
	constructor(message) {
		super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
	}
};
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/base64url.js
/**
* Avoid modifying this file. It's part of
* https://github.com/supabase-community/base64url-js.  Submit all fixes on
* that repo!
*/
/**
* An array of characters that encode 6 bits into a Base64-URL alphabet
* character.
*/
var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
/**
* An array of characters that can appear in a Base64-URL encoded string but
* should be ignored.
*/
var IGNORE_BASE64URL = " 	\n\r=".split("");
/**
* An array of 128 numbers that map a Base64-URL character to 6 bits, or if -2
* used to skip the character, or if -1 used to error out.
*/
var FROM_BASE64URL = (() => {
	const charMap = new Array(128);
	for (let i = 0; i < charMap.length; i += 1) charMap[i] = -1;
	for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
	for (let i = 0; i < TO_BASE64URL.length; i += 1) charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
	return charMap;
})();
/**
* Converts a byte to a Base64-URL string.
*
* @param byte The byte to convert, or null to flush at the end of the byte sequence.
* @param state The Base64 conversion state. Pass an initial value of `{ queue: 0, queuedBits: 0 }`.
* @param emit A function called with the next Base64 character when ready.
*/
function byteToBase64URL(byte, state, emit) {
	if (byte !== null) {
		state.queue = state.queue << 8 | byte;
		state.queuedBits += 8;
		while (state.queuedBits >= 6) {
			emit(TO_BASE64URL[state.queue >> state.queuedBits - 6 & 63]);
			state.queuedBits -= 6;
		}
	} else if (state.queuedBits > 0) {
		state.queue = state.queue << 6 - state.queuedBits;
		state.queuedBits = 6;
		while (state.queuedBits >= 6) {
			emit(TO_BASE64URL[state.queue >> state.queuedBits - 6 & 63]);
			state.queuedBits -= 6;
		}
	}
}
/**
* Converts a String char code (extracted using `string.charCodeAt(position)`) to a sequence of Base64-URL characters.
*
* @param charCode The char code of the JavaScript string.
* @param state The Base64 state. Pass an initial value of `{ queue: 0, queuedBits: 0 }`.
* @param emit A function called with the next byte.
*/
function byteFromBase64URL(charCode, state, emit) {
	const bits = FROM_BASE64URL[charCode];
	if (bits > -1) {
		state.queue = state.queue << 6 | bits;
		state.queuedBits += 6;
		while (state.queuedBits >= 8) {
			emit(state.queue >> state.queuedBits - 8 & 255);
			state.queuedBits -= 8;
		}
	} else if (bits === -2) return;
	else throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
}
/**
* Converts a Base64-URL encoded string into a JavaScript string. It is assumed
* that the underlying string has been encoded as UTF-8.
*
* @param str The Base64-URL encoded string.
*/
function stringFromBase64URL(str) {
	const conv = [];
	const utf8Emit = (codepoint) => {
		conv.push(String.fromCodePoint(codepoint));
	};
	const utf8State = {
		utf8seq: 0,
		codepoint: 0
	};
	const b64State = {
		queue: 0,
		queuedBits: 0
	};
	const byteEmit = (byte) => {
		stringFromUTF8(byte, utf8State, utf8Emit);
	};
	for (let i = 0; i < str.length; i += 1) byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
	return conv.join("");
}
/**
* Converts a Unicode codepoint to a multi-byte UTF-8 sequence.
*
* @param codepoint The Unicode codepoint.
* @param emit      Function which will be called for each UTF-8 byte that represents the codepoint.
*/
function codepointToUTF8(codepoint, emit) {
	if (codepoint <= 127) {
		emit(codepoint);
		return;
	} else if (codepoint <= 2047) {
		emit(192 | codepoint >> 6);
		emit(128 | codepoint & 63);
		return;
	} else if (codepoint <= 65535) {
		emit(224 | codepoint >> 12);
		emit(128 | codepoint >> 6 & 63);
		emit(128 | codepoint & 63);
		return;
	} else if (codepoint <= 1114111) {
		emit(240 | codepoint >> 18);
		emit(128 | codepoint >> 12 & 63);
		emit(128 | codepoint >> 6 & 63);
		emit(128 | codepoint & 63);
		return;
	}
	throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
/**
* Converts a JavaScript string to a sequence of UTF-8 bytes.
*
* @param str  The string to convert to UTF-8.
* @param emit Function which will be called for each UTF-8 byte of the string.
*/
function stringToUTF8(str, emit) {
	for (let i = 0; i < str.length; i += 1) {
		let codepoint = str.charCodeAt(i);
		if (codepoint > 55295 && codepoint <= 56319) {
			const highSurrogate = (codepoint - 55296) * 1024 & 65535;
			codepoint = (str.charCodeAt(i + 1) - 56320 & 65535 | highSurrogate) + 65536;
			i += 1;
		}
		codepointToUTF8(codepoint, emit);
	}
}
/**
* Converts a UTF-8 byte to a Unicode codepoint.
*
* @param byte  The UTF-8 byte next in the sequence.
* @param state The shared state between consecutive UTF-8 bytes in the
*              sequence, an object with the shape `{ utf8seq: 0, codepoint: 0 }`.
* @param emit  Function which will be called for each codepoint.
*/
function stringFromUTF8(byte, state, emit) {
	if (state.utf8seq === 0) {
		if (byte <= 127) {
			emit(byte);
			return;
		}
		for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) if ((byte >> 7 - leadingBit & 1) === 0) {
			state.utf8seq = leadingBit;
			break;
		}
		if (state.utf8seq === 2) state.codepoint = byte & 31;
		else if (state.utf8seq === 3) state.codepoint = byte & 15;
		else if (state.utf8seq === 4) state.codepoint = byte & 7;
		else throw new Error("Invalid UTF-8 sequence");
		state.utf8seq -= 1;
	} else if (state.utf8seq > 0) {
		if (byte <= 127) throw new Error("Invalid UTF-8 sequence");
		state.codepoint = state.codepoint << 6 | byte & 63;
		state.utf8seq -= 1;
		if (state.utf8seq === 0) emit(state.codepoint);
	}
}
/**
* Helper functions to convert different types of strings to Uint8Array
*/
function base64UrlToUint8Array(str) {
	const result = [];
	const state = {
		queue: 0,
		queuedBits: 0
	};
	const onByte = (byte) => {
		result.push(byte);
	};
	for (let i = 0; i < str.length; i += 1) byteFromBase64URL(str.charCodeAt(i), state, onByte);
	return new Uint8Array(result);
}
function stringToUint8Array(str) {
	const result = [];
	stringToUTF8(str, (byte) => result.push(byte));
	return new Uint8Array(result);
}
function bytesToBase64URL(bytes) {
	const result = [];
	const state = {
		queue: 0,
		queuedBits: 0
	};
	const onChar = (char) => {
		result.push(char);
	};
	bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
	byteToBase64URL(null, state, onChar);
	return result.join("");
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/helpers.js
function expiresAt(expiresIn) {
	return Math.round(Date.now() / 1e3) + expiresIn;
}
/**
* Generates a unique identifier for internal callback subscriptions.
*
* This function uses JavaScript Symbols to create guaranteed-unique identifiers
* for auth state change callbacks. Symbols are ideal for this use case because:
* - They are guaranteed unique by the JavaScript runtime
* - They work in all environments (browser, SSR, Node.js)
* - They avoid issues with Next.js 16 deterministic rendering requirements
* - They are perfect for internal, non-serializable identifiers
*
* Note: This function is only used for internal subscription management,
* not for security-critical operations like session tokens.
*/
function generateCallbackId() {
	return Symbol("auth-callback");
}
var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
var localStorageWriteTests = {
	tested: false,
	writable: false
};
/**
* Checks whether localStorage is supported on this browser.
*/
var supportsLocalStorage = () => {
	if (!isBrowser()) return false;
	try {
		if (typeof globalThis.localStorage !== "object") return false;
	} catch (e) {
		return false;
	}
	if (localStorageWriteTests.tested) return localStorageWriteTests.writable;
	const randomKey = `lswt-${Math.random()}${Math.random()}`;
	try {
		globalThis.localStorage.setItem(randomKey, randomKey);
		globalThis.localStorage.removeItem(randomKey);
		localStorageWriteTests.tested = true;
		localStorageWriteTests.writable = true;
	} catch (e) {
		localStorageWriteTests.tested = true;
		localStorageWriteTests.writable = false;
	}
	return localStorageWriteTests.writable;
};
/**
* Extracts parameters encoded in the URL both in the query and fragment.
*/
function parseParametersFromURL(href) {
	const result = {};
	const url = new URL(href);
	if (url.hash && url.hash[0] === "#") try {
		new URLSearchParams(url.hash.substring(1)).forEach((value, key) => {
			result[key] = value;
		});
	} catch (_e) {}
	url.searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
var resolveFetch = (customFetch) => {
	if (customFetch) return (...args) => customFetch(...args);
	return (...args) => fetch(...args);
};
var looksLikeFetchResponse = (maybeResponse) => {
	return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
var setItemAsync = async (storage, key, data) => {
	await storage.setItem(key, JSON.stringify(data));
};
var getItemAsync = async (storage, key) => {
	const value = await storage.getItem(key);
	if (!value) return null;
	try {
		return JSON.parse(value);
	} catch (_a) {
		return null;
	}
};
var removeItemAsync = async (storage, key) => {
	await storage.removeItem(key);
};
/**
* A deferred represents some asynchronous work that is not yet finished, which
* may or may not culminate in a value.
* Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
*/
var Deferred = class Deferred {
	constructor() {
		this.promise = new Deferred.promiseConstructor((res, rej) => {
			this.resolve = res;
			this.reject = rej;
		});
	}
};
Deferred.promiseConstructor = Promise;
function decodeJWT(token) {
	const parts = token.split(".");
	if (parts.length !== 3) throw new AuthInvalidJwtError("Invalid JWT structure");
	for (let i = 0; i < parts.length; i++) if (!BASE64URL_REGEX.test(parts[i])) throw new AuthInvalidJwtError("JWT not in base64url format");
	return {
		header: JSON.parse(stringFromBase64URL(parts[0])),
		payload: JSON.parse(stringFromBase64URL(parts[1])),
		signature: base64UrlToUint8Array(parts[2]),
		raw: {
			header: parts[0],
			payload: parts[1]
		}
	};
}
/**
* Creates a promise that resolves to null after some time.
*/
async function sleep(time) {
	return await new Promise((accept) => {
		setTimeout(() => accept(null), time);
	});
}
/**
* Converts the provided async function into a retryable function. Each result
* or thrown error is sent to the isRetryable function which should return true
* if the function should run again.
*/
function retryable(fn, isRetryable) {
	return new Promise((accept, reject) => {
		(async () => {
			for (let attempt = 0; attempt < Infinity; attempt++) try {
				const result = await fn(attempt);
				if (!isRetryable(attempt, null, result)) {
					accept(result);
					return;
				}
			} catch (e) {
				if (!isRetryable(attempt, e)) {
					reject(e);
					return;
				}
			}
		})();
	});
}
function dec2hex(dec) {
	return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
	const verifierLength = 56;
	const array = new Uint32Array(verifierLength);
	if (typeof crypto === "undefined") {
		const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
		const charSetLen = 66;
		let verifier = "";
		for (let i = 0; i < verifierLength; i++) verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
		return verifier;
	}
	crypto.getRandomValues(array);
	return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
	const encodedData = new TextEncoder().encode(randomString);
	const hash = await crypto.subtle.digest("SHA-256", encodedData);
	const bytes = new Uint8Array(hash);
	return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
async function generatePKCEChallenge(verifier) {
	if (!(typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined")) {
		console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
		return verifier;
	}
	const hashed = await sha256(verifier);
	return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var PKCE_FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;
/**
* Returns the flow id if it is a plausible flow id, `null` otherwise. Flow
* ids can arrive via URL parameters, so anything outside the expected shape
* is discarded before it is used to build a storage key.
*/
function validatePKCEFlowId(flowId) {
	return typeof flowId === "string" && PKCE_FLOW_ID_PATTERN.test(flowId) ? flowId : null;
}
function generatePKCEFlowId() {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const bytes = /* @__PURE__ */ new Uint8Array(16);
		crypto.getRandomValues(bytes);
		return Array.from(bytes, dec2hex).join("");
	}
	let flowId = "";
	for (let i = 0; i < 32; i++) flowId += Math.floor(Math.random() * 16).toString(16);
	return flowId;
}
var pkceVerifierSlotKey = (storageKey, flowId) => `${storageKey}-flow-${flowId}-code-verifier`;
var pkceFlowIndexKey = (storageKey) => `${storageKey}-flows-code-verifier`;
/**
* Storage adapters cannot enumerate keys, so the ids of pending verifier
* slots are tracked in an index entry, oldest first. Index entries pass
* through the same validation as URL-provided flow ids: with cookie-based
* storage the index contents are no more trustworthy than a URL parameter.
*/
async function getPKCEFlowIndex(storage, storageKey) {
	const index = await getItemAsync(storage, pkceFlowIndexKey(storageKey));
	return Array.isArray(index) ? index.filter((id) => validatePKCEFlowId(id) !== null) : [];
}
/**
* The index is read-modify-write without a lock: two concurrent starts (e.g.
* two tabs) can lose one index update. The losing flow still works — its slot
* is addressed directly by key — but its entry is missing from the index, so
* it escapes both ring eviction and removeAllPKCEVerifiers: the orphaned slot
* persists for the storage medium's lifetime (up to the cookie max age in
* cookie storage) and repeated races accumulate one orphan each. Accepted
* trade-off: locking every flow start is far more intrusive than the leak.
*/
async function storePKCEVerifier(storage, storageKey, flowId, verifier, onEvictFlow) {
	await setItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId), verifier);
	const index = (await getPKCEFlowIndex(storage, storageKey)).filter((id) => id !== flowId);
	index.push(flowId);
	while (index.length > 5) {
		const evicted = index.shift();
		await removeItemAsync(storage, pkceVerifierSlotKey(storageKey, evicted));
		onEvictFlow === null || onEvictFlow === void 0 || onEvictFlow(evicted);
	}
	await setItemAsync(storage, pkceFlowIndexKey(storageKey), index);
	await setItemAsync(storage, `${storageKey}-code-verifier`, verifier);
}
/**
* Looks up the verifier for `flowId`. When a flow id is given, only that slot
* is consulted — deliberately no fallback to the fixed legacy key: submitting
* another flow's verifier would burn the single-use auth code, and the
* subsequent cleanup would delete a pending flow's only fallback. The legacy
* key is read only when no flow id is available at all.
*/
async function retrievePKCEVerifier(storage, storageKey, flowId) {
	if (flowId) {
		const verifier = await getItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId));
		return {
			verifier: typeof verifier === "string" ? verifier : null,
			flowId
		};
	}
	const verifier = await getItemAsync(storage, `${storageKey}-code-verifier`);
	return {
		verifier: typeof verifier === "string" ? verifier : null,
		flowId: null
	};
}
/**
* Removes a single flow's verifier. Never clears other flows' slots: with a
* `flowId` only that slot is deleted (plus the legacy fixed key when it holds
* the same verifier); without one, only the legacy fixed key is deleted.
*/
async function removePKCEVerifier(storage, storageKey, flowId) {
	const legacyKey = `${storageKey}-code-verifier`;
	if (!flowId) {
		await removeItemAsync(storage, legacyKey);
		return;
	}
	const slotKey = pkceVerifierSlotKey(storageKey, flowId);
	const slotValue = await getItemAsync(storage, slotKey);
	await removeItemAsync(storage, slotKey);
	const index = await getPKCEFlowIndex(storage, storageKey);
	const remaining = index.filter((id) => id !== flowId);
	if (remaining.length !== index.length) {
		if (remaining.length > 0) await setItemAsync(storage, pkceFlowIndexKey(storageKey), remaining);
		else await removeItemAsync(storage, pkceFlowIndexKey(storageKey));
	}
	if (slotValue != null && slotValue === await getItemAsync(storage, legacyKey)) await removeItemAsync(storage, legacyKey);
}
/**
* Removes every pending verifier: all slots in the index, the index itself
* and the fixed legacy key. Used on session teardown (sign-out, invalid
* session) — matches the pre-slot behavior where tearing down the session
* deleted the only verifier, and prevents long-lived stale verifier cookies.
*/
async function removeAllPKCEVerifiers(storage, storageKey) {
	const index = await getPKCEFlowIndex(storage, storageKey);
	for (const flowId of index) await removeItemAsync(storage, pkceVerifierSlotKey(storageKey, flowId));
	await removeItemAsync(storage, pkceFlowIndexKey(storageKey));
	await removeItemAsync(storage, `${storageKey}-code-verifier`);
}
/**
* Appends the reserved flow id parameter to a `redirectTo` URL, replacing any
* existing occurrence. String-based (no URL round-trip) so custom schemes
* (native deep links) and the exact encoding of the app's own parameters
* survive untouched; an existing fragment stays at the end of the URL.
*/
function appendFlowIdToRedirectTo(redirectTo, flowId) {
	const hashIndex = redirectTo.indexOf("#");
	let base = hashIndex === -1 ? redirectTo : redirectTo.slice(0, hashIndex);
	const fragment = hashIndex === -1 ? "" : redirectTo.slice(hashIndex);
	const queryIndex = base.indexOf("?");
	if (queryIndex !== -1) {
		const path = base.slice(0, queryIndex);
		const remaining = base.slice(queryIndex + 1).split("&").filter((pair) => pair !== "" && pair !== "sb_flow_id" && !pair.startsWith(`sb_flow_id=`));
		base = remaining.length > 0 ? `${path}?${remaining.join("&")}` : path;
	}
	const separator = base.includes("?") ? "&" : "?";
	return `${base}${separator}${PKCE_FLOW_ID_PARAM}=${encodeURIComponent(flowId)}${fragment}`;
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false, onEvictFlow) {
	const codeVerifier = generatePKCEVerifier();
	let storedCodeVerifier = codeVerifier;
	if (isPasswordRecovery) storedCodeVerifier += "/recovery";
	const flowId = generatePKCEFlowId();
	await storePKCEVerifier(storage, storageKey, flowId, storedCodeVerifier, onEvictFlow);
	const codeChallenge = await generatePKCEChallenge(codeVerifier);
	return [
		codeChallenge,
		codeVerifier === codeChallenge ? "plain" : "s256",
		flowId
	];
}
/** Parses the API version which is 2YYY-MM-DD. */
var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
	const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
	if (!apiVersion) return null;
	if (!apiVersion.match(API_VERSION_REGEX)) return null;
	try {
		return /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
	} catch (_e) {
		return null;
	}
}
function validateExp(exp) {
	if (!exp) throw new Error("Missing exp claim");
	if (exp <= Math.floor(Date.now() / 1e3)) throw new Error("JWT has expired");
}
function getAlgorithm(alg) {
	switch (alg) {
		case "RS256": return {
			name: "RSASSA-PKCS1-v1_5",
			hash: { name: "SHA-256" }
		};
		case "ES256": return {
			name: "ECDSA",
			namedCurve: "P-256",
			hash: { name: "SHA-256" }
		};
		default: throw new Error("Invalid alg claim");
	}
}
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validateUUID(str) {
	if (!UUID_REGEX.test(str)) throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
}
function assertPasskeyExperimentalEnabled(experimental) {
	if (!experimental.passkey) throw new Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).");
}
function userNotAvailableProxy() {
	return new Proxy({}, {
		get: (target, prop) => {
			if (prop === "__isUserNotAvailableProxy") return true;
			if (typeof prop === "symbol") {
				const sProp = prop.toString();
				if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") return;
			}
			throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
		},
		set: (_target, prop) => {
			throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
		},
		deleteProperty: (_target, prop) => {
			throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
		}
	});
}
/**
* Creates a proxy around a user object that warns when properties are accessed on the server.
* This is used to alert developers that using user data from getSession() on the server is insecure.
*
* @param user The actual user object to wrap
* @param suppressWarningRef An object with a 'value' property that controls warning suppression
* @returns A proxied user object that warns on property access
*/
function insecureUserWarningProxy(user, suppressWarningRef) {
	return new Proxy(user, { get: (target, prop, receiver) => {
		if (prop === "__isInsecureUserWarningProxy") return true;
		if (typeof prop === "symbol") {
			const sProp = prop.toString();
			if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)" || sProp === "Symbol(nodejs.util.inspect.custom)") return Reflect.get(target, prop, receiver);
		}
		if (!suppressWarningRef.value && typeof prop === "string") {
			console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
			suppressWarningRef.value = true;
		}
		return Reflect.get(target, prop, receiver);
	} });
}
/**
* Deep clones a JSON-serializable object using JSON.parse(JSON.stringify(obj)).
* Note: Only works for JSON-safe data.
*/
function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/fetch.js
var _getErrorMessage = (err) => {
	if (typeof err === "object" && err !== null) {
		const e = err;
		if (typeof e.msg === "string") return e.msg;
		if (typeof e.message === "string") return e.message;
		if (typeof e.error_description === "string") return e.error_description;
		if (typeof e.error === "string") return e.error;
	}
	return JSON.stringify(err);
};
var NETWORK_ERROR_CODES = [
	500,
	501,
	502,
	503,
	504,
	520,
	521,
	522,
	523,
	524,
	525,
	526,
	527,
	528,
	529,
	530
];
async function handleError(error) {
	var _a;
	if (!looksLikeFetchResponse(error)) throw new AuthRetryableFetchError(_getErrorMessage(error), 0);
	let data;
	try {
		data = await error.json();
	} catch (e) {
		if (NETWORK_ERROR_CODES.includes(error.status)) throw new AuthRetryableFetchError(error.statusText || `HTTP ${error.status}`, error.status);
		throw new AuthUnknownError(_getErrorMessage(e), e);
	}
	if (NETWORK_ERROR_CODES.includes(error.status)) throw new AuthRetryableFetchError(_getErrorMessage(data), error.status);
	let errorCode = void 0;
	const responseAPIVersion = parseResponseAPIVersion(error);
	if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") errorCode = data.code;
	else if (typeof data === "object" && data && typeof data.error_code === "string") errorCode = data.error_code;
	if (!errorCode) {
		if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) throw new AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
	} else if (errorCode === "weak_password") throw new AuthWeakPasswordError(_getErrorMessage(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
	else if (errorCode === "session_not_found") throw new AuthSessionMissingError();
	throw new AuthApiError(_getErrorMessage(data), error.status || 500, errorCode);
}
var _getRequestParams = (method, options, parameters, body) => {
	const params = {
		method,
		headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
	};
	if (method === "GET") return params;
	params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
	params.body = JSON.stringify(body);
	return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
	var _a;
	const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
	if (!headers["X-Supabase-Api-Version"]) headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
	if (options === null || options === void 0 ? void 0 : options.jwt) headers["Authorization"] = `Bearer ${options.jwt}`;
	const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
	if (options === null || options === void 0 ? void 0 : options.redirectTo) qs["redirect_to"] = options.redirectTo;
	const data = await _handleRequest(fetcher, method, url + (Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : ""), {
		headers,
		noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
	}, {}, options === null || options === void 0 ? void 0 : options.body);
	return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : {
		data: Object.assign({}, data),
		error: null
	};
}
async function _handleRequest(fetcher, method, url, options, parameters, body) {
	const requestParams = _getRequestParams(method, options, parameters, body);
	let result;
	try {
		result = await fetcher(url, Object.assign({}, requestParams));
	} catch (e) {
		throw new AuthRetryableFetchError(_getErrorMessage(e), 0);
	}
	if (!result.ok) await handleError(result);
	if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
	try {
		return await result.json();
	} catch (e) {
		await handleError(e);
	}
}
function _sessionResponse(data) {
	var _a;
	let session = null;
	if (hasSession(data)) {
		session = Object.assign({}, data);
		if (!data.expires_at) session.expires_at = expiresAt(data.expires_in);
	}
	const user = (_a = data.user) !== null && _a !== void 0 ? _a : typeof (data === null || data === void 0 ? void 0 : data.id) === "string" ? data : null;
	return {
		data: {
			session,
			user
		},
		error: null
	};
}
function _sessionResponsePassword(data) {
	const response = _sessionResponse(data);
	if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) response.data.weak_password = data.weak_password;
	return response;
}
function _userResponse(data) {
	var _a;
	return {
		data: { user: (_a = data.user) !== null && _a !== void 0 ? _a : data },
		error: null
	};
}
function _ssoResponse(data) {
	return {
		data,
		error: null
	};
}
function _generateLinkResponse(data) {
	const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, [
		"action_link",
		"email_otp",
		"hashed_token",
		"redirect_to",
		"verification_type"
	]);
	return {
		data: {
			properties: {
				action_link,
				email_otp,
				hashed_token,
				redirect_to,
				verification_type
			},
			user: Object.assign({}, rest)
		},
		error: null
	};
}
function _noResolveJsonResponse(data) {
	return data;
}
/**
* hasSession checks if the response object contains a valid session
* @param data A response object
* @returns true if a session is in the response
*/
function hasSession(data) {
	return !!data.access_token && !!data.refresh_token && !!data.expires_in;
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/types.js
var SIGN_OUT_SCOPES = [
	"global",
	"local",
	"others"
];
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
var GoTrueAdminApi = class {
	/**
	* Creates an admin API client that can be used to manage users and OAuth clients.
	*
	* @example Using supabase-js (recommended)
	* ```ts
	* import { createClient } from '@supabase/supabase-js'
	*
	* const supabase = createClient('https://xyzcompany.supabase.co', 'your-secret-key')
	* const { data, error } = await supabase.auth.admin.listUsers()
	* ```
	*
	* @example Standalone import for bundle-sensitive environments
	* ```ts
	* import { GoTrueAdminApi } from '@supabase/auth-js'
	*
	* const admin = new GoTrueAdminApi({
	*   url: 'https://xyzcompany.supabase.co/auth/v1',
	*   headers: { Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}` },
	* })
	* ```
	*/
	constructor({ url = "", headers = {}, fetch, experimental }) {
		this.url = url;
		this.headers = headers;
		this.fetch = resolveFetch(fetch);
		this.experimental = experimental !== null && experimental !== void 0 ? experimental : {};
		this.mfa = {
			listFactors: this._listFactors.bind(this),
			deleteFactor: this._deleteFactor.bind(this)
		};
		this.oauth = {
			listClients: this._listOAuthClients.bind(this),
			createClient: this._createOAuthClient.bind(this),
			getClient: this._getOAuthClient.bind(this),
			updateClient: this._updateOAuthClient.bind(this),
			deleteClient: this._deleteOAuthClient.bind(this),
			regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
		};
		this.customProviders = {
			listProviders: this._listCustomProviders.bind(this),
			createProvider: this._createCustomProvider.bind(this),
			getProvider: this._getCustomProvider.bind(this),
			updateProvider: this._updateCustomProvider.bind(this),
			deleteProvider: this._deleteCustomProvider.bind(this)
		};
		this.passkey = {
			listPasskeys: this._adminListPasskeys.bind(this),
			deletePasskey: this._adminDeletePasskey.bind(this)
		};
	}
	/**
	* Removes a logged-in session.
	* @param jwt A valid, logged-in JWT.
	* @param scope The logout sope.
	*
	* @category Auth
	* @subcategory Auth Admin
	*/
	async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
		if (SIGN_OUT_SCOPES.indexOf(scope) < 0) throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
		try {
			await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
				headers: this.headers,
				jwt,
				noResolveJson: true
			});
			return {
				data: null,
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Sends an invite link to an email address.
	* @param email The email address of the user.
	* @param options Additional options to be included when inviting.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - Sends an invite link to the user's email address.
	* - The `inviteUserByEmail()` method is typically used by administrators to invite users to join the application.
	* - Note that PKCE is not supported when using `inviteUserByEmail`. This is because the browser initiating the invite is often different from the browser accepting the invite which makes it difficult to provide the security guarantees required of the PKCE flow.
	*
	* @example Invite a user
	* ```js
	* const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')
	* ```
	*
	* @exampleResponse Invite a user
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "invited_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmation_sent_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {},
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*/
	async inviteUserByEmail(email, options = {}) {
		try {
			return await _request(this.fetch, "POST", `${this.url}/invite`, {
				body: {
					email,
					data: options.data
				},
				headers: this.headers,
				redirectTo: options.redirectTo,
				xform: _userResponse
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { user: null },
				error
			};
			throw error;
		}
	}
	/**
	* Generates email links and OTPs to be sent via a custom email provider.
	* @param params The parameters for generating the link, including the link `type`, the user's `email`, and type-specific options such as `password`, `data`, and `redirectTo`.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - The following types can be passed into `generateLink()`: `signup`, `magiclink`, `invite`, `recovery`, `email_change_current`, `email_change_new`, `phone_change`.
	* - `generateLink()` only generates the email link for `email_change_email` if the **Secure email change** is enabled in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
	* - `generateLink()` handles the creation of the user for `signup`, `invite` and `magiclink`.
	*
	* @example Generate a signup link
	* ```js
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'signup',
	*   email: 'email@example.com',
	*   password: 'secret'
	* })
	* ```
	*
	* @exampleResponse Generate a signup link
	* ```json
	* {
	*   "data": {
	*     "properties": {
	*       "action_link": "<LINK_TO_SEND_TO_USER>",
	*       "email_otp": "999999",
	*       "hashed_token": "<HASHED_TOKEN",
	*       "redirect_to": "<REDIRECT_URL>",
	*       "verification_type": "signup"
	*     },
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "email@example.com",
	*       "phone": "",
	*       "confirmation_sent_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {},
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "email@example.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "email@example.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Generate an invite link
	* ```js
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'invite',
	*   email: 'email@example.com'
	* })
	* ```
	*
	* @example Generate a magic link
	* ```js
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'magiclink',
	*   email: 'email@example.com'
	* })
	* ```
	*
	* @example Generate a recovery link
	* ```js
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'recovery',
	*   email: 'email@example.com'
	* })
	* ```
	*
	* @example Generate links to change current email address
	* ```js
	* // generate an email change link to be sent to the current email address
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'email_change_current',
	*   email: 'current.email@example.com',
	*   newEmail: 'new.email@example.com'
	* })
	*
	* // generate an email change link to be sent to the new email address
	* const { data, error } = await supabase.auth.admin.generateLink({
	*   type: 'email_change_new',
	*   email: 'current.email@example.com',
	*   newEmail: 'new.email@example.com'
	* })
	* ```
	*/
	async generateLink(params) {
		try {
			const { options } = params, rest = __rest(params, ["options"]);
			const body = Object.assign(Object.assign({}, rest), options);
			if ("newEmail" in rest) {
				body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
				delete body["newEmail"];
			}
			return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
				body,
				headers: this.headers,
				xform: _generateLinkResponse,
				redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: {
					properties: null,
					user: null
				},
				error
			};
			throw error;
		}
	}
	/**
	* Creates a new user.
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - To confirm the user's email address or phone number, set `email_confirm` or `phone_confirm` to true. Both arguments default to false.
	* - `createUser()` will not send a confirmation email to the user. You can use [`inviteUserByEmail()`](/docs/reference/javascript/auth-admin-inviteuserbyemail) if you want to send them an email invite instead.
	* - If you are sure that the created user's email or phone number is legitimate and verified, you can set the `email_confirm` or `phone_confirm` param to `true`.
	*
	* @example With custom user metadata
	* ```js
	* const { data, error } = await supabase.auth.admin.createUser({
	*   email: 'user@email.com',
	*   password: 'password',
	*   user_metadata: { name: 'Yoda' }
	* })
	* ```
	*
	* @exampleResponse With custom user metadata
	* ```json
	* {
	*   data: {
	*     user: {
	*       id: '1',
	*       aud: 'authenticated',
	*       role: 'authenticated',
	*       email: 'example@email.com',
	*       email_confirmed_at: '2024-01-01T00:00:00Z',
	*       phone: '',
	*       confirmation_sent_at: '2024-01-01T00:00:00Z',
	*       confirmed_at: '2024-01-01T00:00:00Z',
	*       last_sign_in_at: '2024-01-01T00:00:00Z',
	*       app_metadata: {},
	*       user_metadata: {},
	*       identities: [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "1",
	*           "user_id": "1",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": true,
	*             "phone_verified": false,
	*             "sub": "1"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "email@example.com"
	*         },
	*       ],
	*       created_at: '2024-01-01T00:00:00Z',
	*       updated_at: '2024-01-01T00:00:00Z',
	*       is_anonymous: false,
	*     }
	*   }
	*   error: null
	* }
	* ```
	*
	* @example Auto-confirm the user's email
	* ```js
	* const { data, error } = await supabase.auth.admin.createUser({
	*   email: 'user@email.com',
	*   email_confirm: true
	* })
	* ```
	*
	* @example Auto-confirm the user's phone number
	* ```js
	* const { data, error } = await supabase.auth.admin.createUser({
	*   phone: '1234567890',
	*   phone_confirm: true
	* })
	* ```
	*/
	async createUser(attributes) {
		try {
			return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
				body: attributes,
				headers: this.headers,
				xform: _userResponse
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { user: null },
				error
			};
			throw error;
		}
	}
	/**
	* Get a list of users.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	* @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - Defaults to return 50 users per page.
	*
	* @example Get a page of users
	* ```js
	* const { data: { users }, error } = await supabase.auth.admin.listUsers()
	* ```
	*
	* @example Paginated list of users
	* ```js
	* const { data: { users }, error } = await supabase.auth.admin.listUsers({
	*   page: 1,
	*   perPage: 1000
	* })
	* ```
	*/
	async listUsers(params) {
		var _a, _b, _c, _d, _e, _f, _g;
		try {
			const pagination = {
				nextPage: null,
				lastPage: 0,
				total: 0
			};
			const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
				headers: this.headers,
				noResolveJson: true,
				query: {
					page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
					per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
				},
				xform: _noResolveJsonResponse
			});
			if (response.error) throw response.error;
			const users = await response.json();
			const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
			const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
			if (links.length > 0) {
				links.forEach((link) => {
					const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
					const rel = JSON.parse(link.split(";")[1].split("=")[1]);
					pagination[`${rel}Page`] = page;
				});
				pagination.total = parseInt(total);
			}
			return {
				data: Object.assign(Object.assign({}, users), pagination),
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: { users: [] },
				error
			};
			throw error;
		}
	}
	/**
	* Get user by id.
	*
	* @param uid The user's unique identifier
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - Fetches the user object from the database based on the user's id.
	* - The `getUserById()` method requires the user's id which maps to the `auth.users.id` column.
	*
	* @example Fetch the user object using the access_token jwt
	* ```js
	* const { data, error } = await supabase.auth.admin.getUserById(1)
	* ```
	*
	* @exampleResponse Fetch the user object using the access_token jwt
	* ```json
	* {
	*   data: {
	*     user: {
	*       id: '1',
	*       aud: 'authenticated',
	*       role: 'authenticated',
	*       email: 'example@email.com',
	*       email_confirmed_at: '2024-01-01T00:00:00Z',
	*       phone: '',
	*       confirmation_sent_at: '2024-01-01T00:00:00Z',
	*       confirmed_at: '2024-01-01T00:00:00Z',
	*       last_sign_in_at: '2024-01-01T00:00:00Z',
	*       app_metadata: {},
	*       user_metadata: {},
	*       identities: [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "1",
	*           "user_id": "1",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": true,
	*             "phone_verified": false,
	*             "sub": "1"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "email@example.com"
	*         },
	*       ],
	*       created_at: '2024-01-01T00:00:00Z',
	*       updated_at: '2024-01-01T00:00:00Z',
	*       is_anonymous: false,
	*     }
	*   }
	*   error: null
	* }
	* ```
	*/
	async getUserById(uid) {
		validateUUID(uid);
		try {
			return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
				headers: this.headers,
				xform: _userResponse
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { user: null },
				error
			};
			throw error;
		}
	}
	/**
	* Updates the user data. Changes are applied directly without confirmation flows.
	*
	* @param uid The user's unique identifier
	* @param attributes The data you want to update.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*
	* @remarks
	* **Important:** This is a server-side operation and does **not** trigger client-side
	* `onAuthStateChange` listeners. The admin API has no connection to client state.
	*
	* To sync changes to the client after calling this method:
	* 1. On the client, call `supabase.auth.refreshSession()` to fetch the updated user data
	* 2. This will trigger the `TOKEN_REFRESHED` event and notify all listeners
	*
	* @example
	* ```typescript
	* // Server-side (Edge Function)
	* const { data, error } = await supabase.auth.admin.updateUserById(
	*   userId,
	*   { user_metadata: { preferences: { theme: 'dark' } } }
	* )
	*
	* // Client-side (to sync the changes)
	* const { data, error } = await supabase.auth.refreshSession()
	* // onAuthStateChange listeners will now be notified with updated user
	* ```
	*
	* @see {@link GoTrueClient.refreshSession} for syncing admin changes to the client
	* @see {@link GoTrueClient.updateUser} for client-side user updates (triggers listeners automatically)
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @example Updates a user's email
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '11111111-1111-1111-1111-111111111111',
	*   { email: 'new@email.com' }
	* )
	* ```
	*
	* @exampleResponse Updates a user's email
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "new@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "recovery_sent_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Updates a user's password
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { password: 'new_password' }
	* )
	* ```
	*
	* @example Updates a user's metadata
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { user_metadata: { hello: 'world' } }
	* )
	* ```
	*
	* @example Updates a user's app_metadata
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { app_metadata: { plan: 'trial' } }
	* )
	* ```
	*
	* @example Confirms a user's email address
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { email_confirm: true }
	* )
	* ```
	*
	* @example Confirms a user's phone number
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { phone_confirm: true }
	* )
	* ```
	*
	* @example Ban a user for 100 years
	* ```js
	* const { data: user, error } = await supabase.auth.admin.updateUserById(
	*   '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
	*   { ban_duration: '876000h' }
	* )
	* ```
	*/
	async updateUserById(uid, attributes) {
		validateUUID(uid);
		try {
			return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
				body: attributes,
				headers: this.headers,
				xform: _userResponse
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { user: null },
				error
			};
			throw error;
		}
	}
	/**
	* Delete a user. Requires a `service_role` key.
	*
	* @param id The user id you want to remove.
	* @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
	* Defaults to false for backward compatibility.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*
	* @category Auth
	* @subcategory Auth Admin
	*
	* @remarks
	* - The `deleteUser()` method requires the user's ID, which maps to the `auth.users.id` column.
	*
	* @example Removes a user
	* ```js
	* const { data, error } = await supabase.auth.admin.deleteUser(
	*   '715ed5db-f090-4b8c-a067-640ecee36aa0'
	* )
	* ```
	*
	* @exampleResponse Removes a user
	* ```json
	* {
	*   "data": {
	*     "user": {}
	*   },
	*   "error": null
	* }
	* ```
	*/
	async deleteUser(id, shouldSoftDelete = false) {
		validateUUID(id);
		try {
			return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
				headers: this.headers,
				body: { should_soft_delete: shouldSoftDelete },
				xform: _userResponse
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { user: null },
				error
			};
			throw error;
		}
	}
	async _listFactors(params) {
		validateUUID(params.userId);
		try {
			const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
				headers: this.headers,
				xform: (factors) => {
					return {
						data: { factors },
						error: null
					};
				}
			});
			return {
				data,
				error
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	async _deleteFactor(params) {
		validateUUID(params.userId);
		validateUUID(params.id);
		try {
			return {
				data: await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, { headers: this.headers }),
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Lists all OAuth clients with optional pagination.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _listOAuthClients(params) {
		var _a, _b, _c, _d, _e, _f, _g;
		try {
			const pagination = {
				nextPage: null,
				lastPage: 0,
				total: 0
			};
			const response = await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
				headers: this.headers,
				noResolveJson: true,
				query: {
					page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
					per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
				},
				xform: _noResolveJsonResponse
			});
			if (response.error) throw response.error;
			const clients = await response.json();
			const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
			const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
			if (links.length > 0) {
				links.forEach((link) => {
					const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
					const rel = JSON.parse(link.split(";")[1].split("=")[1]);
					pagination[`${rel}Page`] = page;
				});
				pagination.total = parseInt(total);
			}
			return {
				data: Object.assign(Object.assign({}, clients), pagination),
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: { clients: [] },
				error
			};
			throw error;
		}
	}
	/**
	* Creates a new OAuth client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _createOAuthClient(params) {
		try {
			return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
				body: params,
				headers: this.headers,
				xform: (client) => {
					return {
						data: client,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Gets details of a specific OAuth client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _getOAuthClient(clientId) {
		try {
			return await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients/${clientId}`, {
				headers: this.headers,
				xform: (client) => {
					return {
						data: client,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Updates an existing OAuth client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _updateOAuthClient(clientId, params) {
		try {
			return await _request(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${clientId}`, {
				body: params,
				headers: this.headers,
				xform: (client) => {
					return {
						data: client,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Deletes an OAuth client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _deleteOAuthClient(clientId) {
		try {
			await _request(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${clientId}`, {
				headers: this.headers,
				noResolveJson: true
			});
			return {
				data: null,
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Regenerates the secret for an OAuth client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _regenerateOAuthClientSecret(clientId) {
		try {
			return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients/${clientId}/regenerate_secret`, {
				headers: this.headers,
				xform: (client) => {
					return {
						data: client,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Lists all custom providers with optional type filter.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _listCustomProviders(params) {
		try {
			const query = {};
			if (params === null || params === void 0 ? void 0 : params.type) query.type = params.type;
			return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers`, {
				headers: this.headers,
				query,
				xform: (data) => {
					var _a;
					return {
						data: { providers: (_a = data === null || data === void 0 ? void 0 : data.providers) !== null && _a !== void 0 ? _a : [] },
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: { providers: [] },
				error
			};
			throw error;
		}
	}
	/**
	* Creates a new custom OIDC/OAuth provider.
	*
	* For OIDC providers, the server fetches and validates the OpenID Connect discovery document
	* from the issuer's well-known endpoint (or the provided `discovery_url`) at creation time.
	* This may return a validation error (`error_code: "validation_failed"`) if the discovery
	* document is unreachable, not valid JSON, missing required fields, or if the issuer
	* in the document does not match the expected issuer.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _createCustomProvider(params) {
		try {
			return await _request(this.fetch, "POST", `${this.url}/admin/custom-providers`, {
				body: params,
				headers: this.headers,
				xform: (provider) => {
					return {
						data: provider,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Gets details of a specific custom provider by identifier.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _getCustomProvider(identifier) {
		try {
			return await _request(this.fetch, "GET", `${this.url}/admin/custom-providers/${identifier}`, {
				headers: this.headers,
				xform: (provider) => {
					return {
						data: provider,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Updates an existing custom provider.
	*
	* When `issuer` or `discovery_url` is changed on an OIDC provider, the server re-fetches and
	* validates the discovery document before persisting. This may return a validation error
	* (`error_code: "validation_failed"`) if the discovery document is unreachable, invalid, or
	* the issuer does not match.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _updateCustomProvider(identifier, params) {
		try {
			return await _request(this.fetch, "PUT", `${this.url}/admin/custom-providers/${identifier}`, {
				body: params,
				headers: this.headers,
				xform: (provider) => {
					return {
						data: provider,
						error: null
					};
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Deletes a custom provider.
	*
	* This function should only be called on a server. Never expose your `service_role` key in the browser.
	*/
	async _deleteCustomProvider(identifier) {
		try {
			await _request(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${identifier}`, {
				headers: this.headers,
				noResolveJson: true
			});
			return {
				data: null,
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Lists all passkeys for a user.
	*
	* This function should only be called on a server. Never expose your secret key in the browser.
	*
	* Requires `auth.experimental.passkey: true`.
	*/
	async _adminListPasskeys(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		validateUUID(params.userId);
		try {
			return await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/passkeys`, {
				headers: this.headers,
				xform: (data) => ({
					data,
					error: null
				})
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
	/**
	* Deletes a user's passkey.
	*
	* This function should only be called on a server. Never expose your secret key in the browser.
	*
	* Requires `auth.experimental.passkey: true`.
	*/
	async _adminDeletePasskey(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		validateUUID(params.userId);
		validateUUID(params.passkeyId);
		try {
			await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/passkeys/${params.passkeyId}`, {
				headers: this.headers,
				noResolveJson: true
			});
			return {
				data: null,
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			throw error;
		}
	}
};
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
/**
* Returns a localStorage-like object that stores the key-value pairs in
* memory.
*/
function memoryLocalStorageAdapter(store = {}) {
	return {
		getItem: (key) => {
			return store[key] || null;
		},
		setItem: (key, value) => {
			store[key] = value;
		},
		removeItem: (key) => {
			delete store[key];
		}
	};
}
globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug");
/**
* An error thrown when a lock cannot be acquired after some amount of time.
*
* @deprecated The auth client doesn't acquire locks around auth operations,
* so this error never originates from `supabase.auth.*` calls. Direct callers
* of `navigatorLock` / `processLock` still receive it on acquire timeout.
*/
var LockAcquireTimeoutError = class extends Error {
	constructor(message) {
		super(message);
		this.isAcquireTimeout = true;
	}
};
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
/**
* https://mathiasbynens.be/notes/globalthis
*/
function polyfillGlobalThis() {
	if (typeof globalThis === "object") return;
	try {
		Object.defineProperty(Object.prototype, "__magic__", {
			get: function() {
				return this;
			},
			configurable: true
		});
		__magic__.globalThis = __magic__;
		delete Object.prototype.__magic__;
	} catch (e) {
		if (typeof self !== "undefined") self.globalThis = self;
	}
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/web3/ethereum.js
function getAddress(address) {
	if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
	return address.toLowerCase();
}
function fromHex(hex) {
	return parseInt(hex, 16);
}
function toHex(value) {
	const bytes = new TextEncoder().encode(value);
	return "0x" + Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
/**
* Creates EIP-4361 formatted message.
*/
function createSiweMessage(parameters) {
	var _a;
	const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version } = parameters;
	if (!Number.isInteger(chainId)) throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
	if (!domain) throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
	if (nonce && nonce.length < 8) throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
	if (!uri) throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
	if (version !== "1") throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version}`);
	if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n")) throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
	const address = getAddress(parameters.address);
	const prefix = `${scheme ? `${scheme}://${domain}` : domain} wants you to sign in with your Ethereum account:\n${address}\n\n${parameters.statement ? `${parameters.statement}\n` : ""}`;
	let suffix = `URI: ${uri}\nVersion: ${version}\nChain ID: ${chainId}${nonce ? `\nNonce: ${nonce}` : ""}\nIssued At: ${issuedAt.toISOString()}`;
	if (expirationTime) suffix += `\nExpiration Time: ${expirationTime.toISOString()}`;
	if (notBefore) suffix += `\nNot Before: ${notBefore.toISOString()}`;
	if (requestId) suffix += `\nRequest ID: ${requestId}`;
	if (resources) {
		let content = "\nResources:";
		for (const resource of resources) {
			if (!resource || typeof resource !== "string") throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
			content += `\n- ${resource}`;
		}
		suffix += content;
	}
	return `${prefix}\n${suffix}`;
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/webauthn.errors.js
/**
* A custom Error used to return a more nuanced error detailing _why_ one of the eight documented
* errors in the spec was raised after calling `navigator.credentials.create()` or
* `navigator.credentials.get()`:
*
* - `AbortError`
* - `ConstraintError`
* - `InvalidStateError`
* - `NotAllowedError`
* - `NotSupportedError`
* - `SecurityError`
* - `TypeError`
* - `UnknownError`
*
* Error messages were determined through investigation of the spec to determine under which
* scenarios a given error would be raised.
*/
var WebAuthnError = class extends Error {
	constructor({ message, code, cause, name }) {
		var _a;
		super(message, { cause });
		this.__isWebAuthnError = true;
		this.name = (_a = name !== null && name !== void 0 ? name : cause instanceof Error ? cause.name : void 0) !== null && _a !== void 0 ? _a : "Unknown Error";
		this.code = code;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code
		};
	}
};
/**
* Error class for unknown WebAuthn errors.
* Wraps unexpected errors that don't match known WebAuthn error conditions.
*/
var WebAuthnUnknownError = class extends WebAuthnError {
	constructor(message, originalError) {
		super({
			code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
			cause: originalError,
			message
		});
		this.name = "WebAuthnUnknownError";
		this.originalError = originalError;
	}
};
/**
* Attempt to intuit _why_ an error was raised after calling `navigator.credentials.create()`.
* Maps browser errors to specific WebAuthn error codes for better debugging.
* @param {Object} params - Error identification parameters
* @param {Error} params.error - The error thrown by the browser
* @param {CredentialCreationOptions} params.options - The options passed to credentials.create()
* @returns {WebAuthnError} A WebAuthnError with a specific error code
* @see {@link https://w3c.github.io/webauthn/#sctn-createCredential W3C WebAuthn Spec - Create Credential}
*/
function identifyRegistrationError({ error, options }) {
	var _a, _b, _c;
	const { publicKey } = options;
	if (!publicKey) throw Error("options was missing required publicKey property");
	if (error.name === "AbortError") {
		if (options.signal instanceof AbortSignal) return new WebAuthnError({
			message: "Registration ceremony was sent an abort signal",
			code: "ERROR_CEREMONY_ABORTED",
			cause: error
		});
	} else if (error.name === "ConstraintError") {
		if (((_a = publicKey.authenticatorSelection) === null || _a === void 0 ? void 0 : _a.requireResidentKey) === true) return new WebAuthnError({
			message: "Discoverable credentials were required but no available authenticator supported it",
			code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
			cause: error
		});
		else if (options.mediation === "conditional" && ((_b = publicKey.authenticatorSelection) === null || _b === void 0 ? void 0 : _b.userVerification) === "required") return new WebAuthnError({
			message: "User verification was required during automatic registration but it could not be performed",
			code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
			cause: error
		});
		else if (((_c = publicKey.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.userVerification) === "required") return new WebAuthnError({
			message: "User verification was required but no available authenticator supported it",
			code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
			cause: error
		});
	} else if (error.name === "InvalidStateError") return new WebAuthnError({
		message: "The authenticator was previously registered",
		code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
		cause: error
	});
	else if (error.name === "NotAllowedError")
 /**
	* Pass the error directly through. Platforms are overloading this error beyond what the spec
	* defines and we don't want to overwrite potentially useful error messages.
	*/
	return new WebAuthnError({
		message: error.message,
		code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
		cause: error
	});
	else if (error.name === "NotSupportedError") {
		if (publicKey.pubKeyCredParams.filter((param) => param.type === "public-key").length === 0) return new WebAuthnError({
			message: "No entry in pubKeyCredParams was of type \"public-key\"",
			code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
			cause: error
		});
		return new WebAuthnError({
			message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
			code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
			cause: error
		});
	} else if (error.name === "SecurityError") {
		const effectiveDomain = window.location.hostname;
		if (!isValidDomain(effectiveDomain)) return new WebAuthnError({
			message: `${window.location.hostname} is an invalid domain`,
			code: "ERROR_INVALID_DOMAIN",
			cause: error
		});
		else if (publicKey.rp.id !== effectiveDomain) return new WebAuthnError({
			message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
			code: "ERROR_INVALID_RP_ID",
			cause: error
		});
	} else if (error.name === "TypeError") {
		if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) return new WebAuthnError({
			message: "User ID was not between 1 and 64 characters",
			code: "ERROR_INVALID_USER_ID_LENGTH",
			cause: error
		});
	} else if (error.name === "UnknownError") return new WebAuthnError({
		message: "The authenticator was unable to process the specified options, or could not create a new credential",
		code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
		cause: error
	});
	return new WebAuthnError({
		message: "a Non-Webauthn related error has occurred",
		code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
		cause: error
	});
}
/**
* Attempt to intuit _why_ an error was raised after calling `navigator.credentials.get()`.
* Maps browser errors to specific WebAuthn error codes for better debugging.
* @param {Object} params - Error identification parameters
* @param {Error} params.error - The error thrown by the browser
* @param {CredentialRequestOptions} params.options - The options passed to credentials.get()
* @returns {WebAuthnError} A WebAuthnError with a specific error code
* @see {@link https://w3c.github.io/webauthn/#sctn-getAssertion W3C WebAuthn Spec - Get Assertion}
*/
function identifyAuthenticationError({ error, options }) {
	const { publicKey } = options;
	if (!publicKey) throw Error("options was missing required publicKey property");
	if (error.name === "AbortError") {
		if (options.signal instanceof AbortSignal) return new WebAuthnError({
			message: "Authentication ceremony was sent an abort signal",
			code: "ERROR_CEREMONY_ABORTED",
			cause: error
		});
	} else if (error.name === "NotAllowedError")
 /**
	* Pass the error directly through. Platforms are overloading this error beyond what the spec
	* defines and we don't want to overwrite potentially useful error messages.
	*/
	return new WebAuthnError({
		message: error.message,
		code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
		cause: error
	});
	else if (error.name === "SecurityError") {
		const effectiveDomain = window.location.hostname;
		if (!isValidDomain(effectiveDomain)) return new WebAuthnError({
			message: `${window.location.hostname} is an invalid domain`,
			code: "ERROR_INVALID_DOMAIN",
			cause: error
		});
		else if (publicKey.rpId !== effectiveDomain) return new WebAuthnError({
			message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
			code: "ERROR_INVALID_RP_ID",
			cause: error
		});
	} else if (error.name === "UnknownError") return new WebAuthnError({
		message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
		code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
		cause: error
	});
	return new WebAuthnError({
		message: "a Non-Webauthn related error has occurred",
		code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
		cause: error
	});
}
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/lib/webauthn.js
/**
* WebAuthn abort service to manage ceremony cancellation.
* Ensures only one WebAuthn ceremony is active at a time to prevent "operation already in progress" errors.
*
* @experimental This class is experimental and may change in future releases
* @see {@link https://w3c.github.io/webauthn/#sctn-automation-webdriver-capability W3C WebAuthn Spec - Aborting Ceremonies}
*/
var WebAuthnAbortService = class {
	/**
	* Create an abort signal for a new WebAuthn operation.
	* Automatically cancels any existing operation.
	*
	* @returns {AbortSignal} Signal to pass to navigator.credentials.create() or .get()
	* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal MDN - AbortSignal}
	*/
	createNewAbortSignal() {
		if (this.controller) {
			const abortError = /* @__PURE__ */ new Error("Cancelling existing WebAuthn API call for new one");
			abortError.name = "AbortError";
			this.controller.abort(abortError);
		}
		const newController = new AbortController();
		this.controller = newController;
		return newController.signal;
	}
	/**
	* Manually cancel the current WebAuthn operation.
	* Useful for cleaning up when user cancels or navigates away.
	*
	* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort MDN - AbortController.abort}
	*/
	cancelCeremony() {
		if (this.controller) {
			const abortError = /* @__PURE__ */ new Error("Manually cancelling existing WebAuthn API call");
			abortError.name = "AbortError";
			this.controller.abort(abortError);
			this.controller = void 0;
		}
	}
};
/**
* Singleton instance to ensure only one WebAuthn ceremony is active at a time.
* This prevents "operation already in progress" errors when retrying WebAuthn operations.
*
* @experimental This instance is experimental and may change in future releases
*/
var webAuthnAbortService = new WebAuthnAbortService();
/**
* Convert base64url encoded strings in WebAuthn credential creation options to ArrayBuffers
* as required by the WebAuthn browser API.
* Supports both native WebAuthn Level 3 parseCreationOptionsFromJSON and manual fallback.
*
* @param {ServerCredentialCreationOptions} options - JSON options from server with base64url encoded fields
* @returns {PublicKeyCredentialCreationOptionsFuture} Options ready for navigator.credentials.create()
* @see {@link https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON W3C WebAuthn Spec - parseCreationOptionsFromJSON}
*/
function deserializeCredentialCreationOptions(options) {
	if (!options) throw new Error("Credential creation options are required");
	if (typeof PublicKeyCredential !== "undefined" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function") return PublicKeyCredential.parseCreationOptionsFromJSON(
		/** we assert the options here as typescript still doesn't know about future webauthn types */
		options
	);
	const { challenge: challengeStr, user: userOpts, excludeCredentials } = options, restOptions = __rest(options, [
		"challenge",
		"user",
		"excludeCredentials"
	]);
	const challenge = base64UrlToUint8Array(challengeStr).buffer;
	const user = Object.assign(Object.assign({}, userOpts), { id: base64UrlToUint8Array(userOpts.id).buffer });
	const result = Object.assign(Object.assign({}, restOptions), {
		challenge,
		user
	});
	if (excludeCredentials && excludeCredentials.length > 0) {
		result.excludeCredentials = new Array(excludeCredentials.length);
		for (let i = 0; i < excludeCredentials.length; i++) {
			const cred = excludeCredentials[i];
			result.excludeCredentials[i] = Object.assign(Object.assign({}, cred), {
				id: base64UrlToUint8Array(cred.id).buffer,
				type: cred.type || "public-key",
				transports: cred.transports
			});
		}
	}
	return result;
}
/**
* Convert base64url encoded strings in WebAuthn credential request options to ArrayBuffers
* as required by the WebAuthn browser API.
* Supports both native WebAuthn Level 3 parseRequestOptionsFromJSON and manual fallback.
*
* @param {ServerCredentialRequestOptions} options - JSON options from server with base64url encoded fields
* @returns {PublicKeyCredentialRequestOptionsFuture} Options ready for navigator.credentials.get()
* @see {@link https://w3c.github.io/webauthn/#sctn-parseRequestOptionsFromJSON W3C WebAuthn Spec - parseRequestOptionsFromJSON}
*/
function deserializeCredentialRequestOptions(options) {
	if (!options) throw new Error("Credential request options are required");
	if (typeof PublicKeyCredential !== "undefined" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON === "function") return PublicKeyCredential.parseRequestOptionsFromJSON(options);
	const { challenge: challengeStr, allowCredentials } = options, restOptions = __rest(options, ["challenge", "allowCredentials"]);
	const challenge = base64UrlToUint8Array(challengeStr).buffer;
	const result = Object.assign(Object.assign({}, restOptions), { challenge });
	if (allowCredentials && allowCredentials.length > 0) {
		result.allowCredentials = new Array(allowCredentials.length);
		for (let i = 0; i < allowCredentials.length; i++) {
			const cred = allowCredentials[i];
			result.allowCredentials[i] = Object.assign(Object.assign({}, cred), {
				id: base64UrlToUint8Array(cred.id).buffer,
				type: cred.type || "public-key",
				transports: cred.transports
			});
		}
	}
	return result;
}
/**
* Convert a registration/enrollment credential response to server format.
* Serializes binary fields to base64url for JSON transmission.
* Supports both native WebAuthn Level 3 toJSON and manual fallback.
*
* @param {RegistrationCredential} credential - Credential from navigator.credentials.create()
* @returns {RegistrationResponseJSON} JSON-serializable credential for server
* @see {@link https://w3c.github.io/webauthn/#dom-publickeycredential-tojson W3C WebAuthn Spec - toJSON}
*/
function serializeCredentialCreationResponse(credential) {
	var _a;
	if ("toJSON" in credential && typeof credential.toJSON === "function") return credential.toJSON();
	const credentialWithAttachment = credential;
	return {
		id: credential.id,
		rawId: credential.id,
		response: {
			attestationObject: bytesToBase64URL(new Uint8Array(credential.response.attestationObject)),
			clientDataJSON: bytesToBase64URL(new Uint8Array(credential.response.clientDataJSON))
		},
		type: "public-key",
		clientExtensionResults: credential.getClientExtensionResults(),
		authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
	};
}
/**
* Convert an authentication/verification credential response to server format.
* Serializes binary fields to base64url for JSON transmission.
* Supports both native WebAuthn Level 3 toJSON and manual fallback.
*
* @param {AuthenticationCredential} credential - Credential from navigator.credentials.get()
* @returns {AuthenticationResponseJSON} JSON-serializable credential for server
* @see {@link https://w3c.github.io/webauthn/#dom-publickeycredential-tojson W3C WebAuthn Spec - toJSON}
*/
function serializeCredentialRequestResponse(credential) {
	var _a;
	if ("toJSON" in credential && typeof credential.toJSON === "function") return credential.toJSON();
	const credentialWithAttachment = credential;
	const clientExtensionResults = credential.getClientExtensionResults();
	const assertionResponse = credential.response;
	return {
		id: credential.id,
		rawId: credential.id,
		response: {
			authenticatorData: bytesToBase64URL(new Uint8Array(assertionResponse.authenticatorData)),
			clientDataJSON: bytesToBase64URL(new Uint8Array(assertionResponse.clientDataJSON)),
			signature: bytesToBase64URL(new Uint8Array(assertionResponse.signature)),
			userHandle: assertionResponse.userHandle ? bytesToBase64URL(new Uint8Array(assertionResponse.userHandle)) : void 0
		},
		type: "public-key",
		clientExtensionResults,
		authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
	};
}
/**
* A simple test to determine if a hostname is a properly-formatted domain name.
* Considers localhost valid for development environments.
*
* A "valid domain" is defined here: https://url.spec.whatwg.org/#valid-domain
*
* Regex sourced from here:
* https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
*
* @param {string} hostname - The hostname to validate
* @returns {boolean} True if valid domain or localhost
* @see {@link https://url.spec.whatwg.org/#valid-domain WHATWG URL Spec - Valid Domain}
*/
function isValidDomain(hostname) {
	return hostname === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname);
}
/**
* Determine if the browser is capable of WebAuthn.
* Checks for necessary Web APIs: PublicKeyCredential and Credential Management.
*
* @returns {boolean} True if browser supports WebAuthn
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#browser_compatibility MDN - PublicKeyCredential Browser Compatibility}
*/
function browserSupportsWebAuthn() {
	var _a, _b;
	return !!(isBrowser() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _a === void 0 ? void 0 : _a.create) === "function" && typeof ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _b === void 0 ? void 0 : _b.get) === "function");
}
/**
* Create a WebAuthn credential using the browser's credentials API.
* Wraps navigator.credentials.create() with error handling.
*
* @param {CredentialCreationOptions} options - Options including publicKey parameters
* @returns {Promise<RequestResult<RegistrationCredential, WebAuthnError>>} Created credential or error
* @see {@link https://w3c.github.io/webauthn/#sctn-createCredential W3C WebAuthn Spec - Create Credential}
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create MDN - credentials.create}
*/
async function createCredential(options) {
	try {
		const response = await navigator.credentials.create(
			/** we assert the type here until typescript types are updated */
			options
		);
		if (!response) return {
			data: null,
			error: new WebAuthnUnknownError("Empty credential response", response)
		};
		if (!(response instanceof PublicKeyCredential)) return {
			data: null,
			error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
		};
		return {
			data: response,
			error: null
		};
	} catch (err) {
		return {
			data: null,
			error: identifyRegistrationError({
				error: err,
				options
			})
		};
	}
}
/**
* Get a WebAuthn credential using the browser's credentials API.
* Wraps navigator.credentials.get() with error handling.
*
* @param {CredentialRequestOptions} options - Options including publicKey parameters
* @returns {Promise<RequestResult<AuthenticationCredential, WebAuthnError>>} Retrieved credential or error
* @see {@link https://w3c.github.io/webauthn/#sctn-getAssertion W3C WebAuthn Spec - Get Assertion}
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get MDN - credentials.get}
*/
async function getCredential(options) {
	try {
		const response = await navigator.credentials.get(
			/** we assert the type here until typescript types are updated */
			options
		);
		if (!response) return {
			data: null,
			error: new WebAuthnUnknownError("Empty credential response", response)
		};
		if (!(response instanceof PublicKeyCredential)) return {
			data: null,
			error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
		};
		return {
			data: response,
			error: null
		};
	} catch (err) {
		return {
			data: null,
			error: identifyAuthenticationError({
				error: err,
				options
			})
		};
	}
}
var DEFAULT_CREATION_OPTIONS = {
	hints: ["security-key"],
	authenticatorSelection: {
		authenticatorAttachment: "cross-platform",
		requireResidentKey: false,
		/** set to preferred because older yubikeys don't have PIN/Biometric */
		userVerification: "preferred",
		residentKey: "discouraged"
	},
	attestation: "direct"
};
var DEFAULT_REQUEST_OPTIONS = {
	/** set to preferred because older yubikeys don't have PIN/Biometric */
	userVerification: "preferred",
	hints: ["security-key"],
	attestation: "direct"
};
function deepMerge(...sources) {
	const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	const isArrayBufferLike = (val) => val instanceof ArrayBuffer || ArrayBuffer.isView(val);
	const result = {};
	for (const source of sources) {
		if (!source) continue;
		for (const key in source) {
			const value = source[key];
			if (value === void 0) continue;
			if (Array.isArray(value)) result[key] = value;
			else if (isArrayBufferLike(value)) result[key] = value;
			else if (isObject(value)) {
				const existing = result[key];
				if (isObject(existing)) result[key] = deepMerge(existing, value);
				else result[key] = deepMerge(value);
			} else result[key] = value;
		}
	}
	return result;
}
/**
* Merges WebAuthn credential creation options with overrides.
* Sets sensible defaults for authenticator selection and extensions.
*
* @param {PublicKeyCredentialCreationOptionsFuture} baseOptions - The base options from the server
* @param {PublicKeyCredentialCreationOptionsFuture} overrides - Optional overrides to apply
* @param {string} friendlyName - Optional friendly name for the credential
* @returns {PublicKeyCredentialCreationOptionsFuture} Merged credential creation options
* @see {@link https://w3c.github.io/webauthn/#dictdef-authenticatorselectioncriteria W3C WebAuthn Spec - AuthenticatorSelectionCriteria}
*/
function mergeCredentialCreationOptions(baseOptions, overrides) {
	return deepMerge(DEFAULT_CREATION_OPTIONS, baseOptions, overrides || {});
}
/**
* Merges WebAuthn credential request options with overrides.
* Sets sensible defaults for user verification and hints.
*
* @param {PublicKeyCredentialRequestOptionsFuture} baseOptions - The base options from the server
* @param {PublicKeyCredentialRequestOptionsFuture} overrides - Optional overrides to apply
* @returns {PublicKeyCredentialRequestOptionsFuture} Merged credential request options
* @see {@link https://w3c.github.io/webauthn/#dictdef-publickeycredentialrequestoptions W3C WebAuthn Spec - PublicKeyCredentialRequestOptions}
*/
function mergeCredentialRequestOptions(baseOptions, overrides) {
	return deepMerge(DEFAULT_REQUEST_OPTIONS, baseOptions, overrides || {});
}
/**
* WebAuthn API wrapper for Supabase Auth.
* Provides methods for enrolling, challenging, verifying, authenticating, and registering WebAuthn credentials.
*
* @experimental This API is experimental and may change in future releases
* @see {@link https://w3c.github.io/webauthn/ W3C WebAuthn Specification}
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API MDN - Web Authentication API}
*/
var WebAuthnApi = class {
	constructor(client) {
		this.client = client;
		this.enroll = this._enroll.bind(this);
		this.challenge = this._challenge.bind(this);
		this.verify = this._verify.bind(this);
		this.authenticate = this._authenticate.bind(this);
		this.register = this._register.bind(this);
	}
	/**
	* Enroll a new WebAuthn factor.
	* Creates an unverified WebAuthn factor that must be verified with a credential.
	*
	* @experimental This method is experimental and may change in future releases
	* @param {Omit<MFAEnrollWebauthnParams, 'factorType'>} params - Enrollment parameters (friendlyName required)
	* @returns {Promise<AuthMFAEnrollWebauthnResponse>} Enrolled factor details or error
	* @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registering a New Credential}
	*/
	async _enroll(params) {
		return this.client.mfa.enroll(Object.assign(Object.assign({}, params), { factorType: "webauthn" }));
	}
	/**
	* Challenge for WebAuthn credential creation or authentication.
	* Combines server challenge with browser credential operations.
	* Handles both registration (create) and authentication (request) flows.
	*
	* @experimental This method is experimental and may change in future releases
	* @param {MFAChallengeWebauthnParams & { friendlyName?: string; signal?: AbortSignal }} params - Challenge parameters including factorId
	* @param {Object} overrides - Allows you to override the parameters passed to navigator.credentials
	* @param {PublicKeyCredentialCreationOptionsFuture} overrides.create - Override options for credential creation
	* @param {PublicKeyCredentialRequestOptionsFuture} overrides.request - Override options for credential request
	* @returns {Promise<RequestResult>} Challenge response with credential or error
	* @see {@link https://w3c.github.io/webauthn/#sctn-credential-creation W3C WebAuthn Spec - Credential Creation}
	* @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying Assertion}
	*/
	async _challenge({ factorId, webauthn, friendlyName, signal }, overrides) {
		var _a;
		try {
			const { data: challengeResponse, error: challengeError } = await this.client.mfa.challenge({
				factorId,
				webauthn
			});
			if (!challengeResponse) return {
				data: null,
				error: challengeError
			};
			const abortSignal = signal !== null && signal !== void 0 ? signal : webAuthnAbortService.createNewAbortSignal();
			/** webauthn will fail if either of the name/displayname are blank */
			if (challengeResponse.webauthn.type === "create") {
				const { user } = challengeResponse.webauthn.credential_options.publicKey;
				if (!user.name) {
					const nameToUse = friendlyName;
					if (!nameToUse) {
						const userData = (await this.client.getUser()).data.user;
						const fallbackName = ((_a = userData === null || userData === void 0 ? void 0 : userData.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || (userData === null || userData === void 0 ? void 0 : userData.email) || (userData === null || userData === void 0 ? void 0 : userData.id) || "User";
						user.name = `${user.id}:${fallbackName}`;
					} else user.name = `${user.id}:${nameToUse}`;
				}
				if (!user.displayName) user.displayName = user.name;
			}
			switch (challengeResponse.webauthn.type) {
				case "create": {
					const { data, error } = await createCredential({
						publicKey: mergeCredentialCreationOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.create),
						signal: abortSignal
					});
					if (data) return {
						data: {
							factorId,
							challengeId: challengeResponse.id,
							webauthn: {
								type: challengeResponse.webauthn.type,
								credential_response: data
							}
						},
						error: null
					};
					return {
						data: null,
						error
					};
				}
				case "request": {
					const options = mergeCredentialRequestOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.request);
					const { data, error } = await getCredential(Object.assign(Object.assign({}, challengeResponse.webauthn.credential_options), {
						publicKey: options,
						signal: abortSignal
					}));
					if (data) return {
						data: {
							factorId,
							challengeId: challengeResponse.id,
							webauthn: {
								type: challengeResponse.webauthn.type,
								credential_response: data
							}
						},
						error: null
					};
					return {
						data: null,
						error
					};
				}
			}
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			return {
				data: null,
				error: new AuthUnknownError("Unexpected error in challenge", error)
			};
		}
	}
	/**
	* Verify a WebAuthn credential with the server.
	* Completes the WebAuthn ceremony by sending the credential to the server for verification.
	*
	* @experimental This method is experimental and may change in future releases
	* @param {Object} params - Verification parameters
	* @param {string} params.challengeId - ID of the challenge being verified
	* @param {string} params.factorId - ID of the WebAuthn factor
	* @param {MFAVerifyWebauthnParams<T>['webauthn']} params.webauthn - WebAuthn credential response
	* @returns {Promise<AuthMFAVerifyResponse>} Verification result with session or error
	* @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying an Authentication Assertion}
	* */
	async _verify({ challengeId, factorId, webauthn }) {
		return this.client.mfa.verify({
			factorId,
			challengeId,
			webauthn
		});
	}
	/**
	* Complete WebAuthn authentication flow.
	* Performs challenge and verification in a single operation for existing credentials.
	*
	* @experimental This method is experimental and may change in future releases
	* @param {Object} params - Authentication parameters
	* @param {string} params.factorId - ID of the WebAuthn factor to authenticate with
	* @param {Object} params.webauthn - WebAuthn configuration
	* @param {string} params.webauthn.rpId - Relying Party ID (defaults to current hostname)
	* @param {string[]} params.webauthn.rpOrigins - Allowed origins (defaults to current origin)
	* @param {AbortSignal} params.webauthn.signal - Optional abort signal
	* @param {PublicKeyCredentialRequestOptionsFuture} overrides - Override options for navigator.credentials.get
	* @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Authentication result
	* @see {@link https://w3c.github.io/webauthn/#sctn-authentication W3C WebAuthn Spec - Authentication Ceremony}
	* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions MDN - PublicKeyCredentialRequestOptions}
	*/
	async _authenticate({ factorId, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
		if (!rpId) return {
			data: null,
			error: new AuthError("rpId is required for WebAuthn authentication")
		};
		try {
			if (!browserSupportsWebAuthn()) return {
				data: null,
				error: new AuthUnknownError("Browser does not support WebAuthn", null)
			};
			const { data: challengeResponse, error: challengeError } = await this.challenge({
				factorId,
				webauthn: {
					rpId,
					rpOrigins
				},
				signal
			}, { request: overrides });
			if (!challengeResponse) return {
				data: null,
				error: challengeError
			};
			const { webauthn } = challengeResponse;
			return this._verify({
				factorId,
				challengeId: challengeResponse.challengeId,
				webauthn: {
					type: webauthn.type,
					rpId,
					rpOrigins,
					credential_response: webauthn.credential_response
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			return {
				data: null,
				error: new AuthUnknownError("Unexpected error in authenticate", error)
			};
		}
	}
	/**
	* Complete WebAuthn registration flow.
	* Performs enrollment, challenge, and verification in a single operation for new credentials.
	*
	* @experimental This method is experimental and may change in future releases
	* @param {Object} params - Registration parameters
	* @param {string} params.friendlyName - User-friendly name for the credential
	* @param {string} params.rpId - Relying Party ID (defaults to current hostname)
	* @param {string[]} params.rpOrigins - Allowed origins (defaults to current origin)
	* @param {AbortSignal} params.signal - Optional abort signal
	* @param {PublicKeyCredentialCreationOptionsFuture} overrides - Override options for navigator.credentials.create
	* @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Registration result
	* @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registration Ceremony}
	* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions MDN - PublicKeyCredentialCreationOptions}
	*/
	async _register({ friendlyName, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
		if (!rpId) return {
			data: null,
			error: new AuthError("rpId is required for WebAuthn registration")
		};
		try {
			if (!browserSupportsWebAuthn()) return {
				data: null,
				error: new AuthUnknownError("Browser does not support WebAuthn", null)
			};
			const { data: factor, error: enrollError } = await this._enroll({ friendlyName });
			if (!factor) {
				await this.client.mfa.listFactors().then((factors) => {
					var _a;
					return (_a = factors.data) === null || _a === void 0 ? void 0 : _a.all.find((v) => v.factor_type === "webauthn" && v.friendly_name === friendlyName && v.status === "unverified");
				}).then((factor) => factor ? this.client.mfa.unenroll({ factorId: factor === null || factor === void 0 ? void 0 : factor.id }) : void 0);
				return {
					data: null,
					error: enrollError
				};
			}
			const { data: challengeResponse, error: challengeError } = await this._challenge({
				factorId: factor.id,
				friendlyName: factor.friendly_name,
				webauthn: {
					rpId,
					rpOrigins
				},
				signal
			}, { create: overrides });
			if (!challengeResponse) return {
				data: null,
				error: challengeError
			};
			return this._verify({
				factorId: factor.id,
				challengeId: challengeResponse.challengeId,
				webauthn: {
					rpId,
					rpOrigins,
					type: challengeResponse.webauthn.type,
					credential_response: challengeResponse.webauthn.credential_response
				}
			});
		} catch (error) {
			if (isAuthError(error)) return {
				data: null,
				error
			};
			return {
				data: null,
				error: new AuthUnknownError("Unexpected error in register", error)
			};
		}
	}
};
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
polyfillGlobalThis();
var DEFAULT_OPTIONS = {
	url: GOTRUE_URL,
	storageKey: STORAGE_KEY,
	autoRefreshToken: true,
	persistSession: true,
	detectSessionInUrl: true,
	headers: DEFAULT_HEADERS,
	flowType: "implicit",
	debug: false,
	hasCustomAuthorizationHeader: false,
	throwOnError: false,
	lockAcquireTimeout: 5e3,
	skipAutoInitialize: false,
	experimental: {}
};
/**
* Caches JWKS values for all clients created in the same environment. This is
* especially useful for shared-memory execution environments such as Vercel's
* Fluid Compute, AWS Lambda or Supabase's Edge Functions. Regardless of how
* many clients are created, if they share the same storage key they will use
* the same JWKS cache, significantly speeding up getClaims() with asymmetric
* JWTs.
*/
var GLOBAL_JWKS = {};
var deprecatedLockWarned = false;
var GoTrueClient = class GoTrueClient {
	/**
	* The JWKS used for verifying asymmetric JWTs
	*/
	get jwks() {
		var _a, _b;
		return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
	}
	set jwks(value) {
		GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
	}
	get jwks_cached_at() {
		var _a, _b;
		return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
	}
	set jwks_cached_at(value) {
		GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
	}
	/**
	* Create a new client for use in the browser.
	*
	* @example Using supabase-js (recommended)
	* ```ts
	* import { createClient } from '@supabase/supabase-js'
	*
	* const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
	* const { data, error } = await supabase.auth.getUser()
	* ```
	*
	* @example Standalone import for bundle-sensitive environments
	* ```ts
	* import { GoTrueClient } from '@supabase/auth-js'
	*
	* const auth = new GoTrueClient({
	*   url: 'https://xyzcompany.supabase.co/auth/v1',
	*   headers: { apikey: 'your-publishable-key' },
	*   storageKey: 'supabase-auth',
	* })
	* ```
	*/
	constructor(options) {
		var _a, _b, _c;
		/**
		* @experimental
		*/
		this.userStorage = null;
		this.memoryStorage = null;
		this.stateChangeEmitters = /* @__PURE__ */ new Map();
		this.autoRefreshTicker = null;
		this.autoRefreshTickTimeout = null;
		this.visibilityChangedCallback = null;
		this.refreshingDeferred = null;
		/**
		* Cache of the most recent refresh failure, keyed by the refresh token
		* that failed. Serial callers passing the *same* token within
		* `REFRESH_FAILURE_COOLDOWN_MS` (including subsequent auto-refresh ticks)
		* receive this cached result instead of firing another `/token` request.
		* Callers passing a *different* token (token rotation pickup, explicit
		* `setSession`/`refreshSession({ refresh_token })`, multi-account switch)
		* bypass the cache and attempt a fresh refresh as they should.
		* Cleared on any successful refresh (locally or via BroadcastChannel from
		* another tab) and on `_removeSession`.
		*
		* Pairs with `refreshingDeferred`: concurrent callers share the in-flight
		* promise, serial callers within the cooldown share the failure result.
		*/
		this.lastRefreshFailure = null;
		/**
		* Monotonic counter incremented at the top of `_removeSession`, before any
		* `await`. The commit guard inside `_callRefreshToken` captures this value
		* before `_saveSession` and re-checks it after, so a `signOut` that
		* interleaves inside `_saveSession`'s storage-write awaits is still caught
		* (the post-fetch storage snapshot alone misses that window).
		*/
		this._sessionRemovalEpoch = 0;
		/**
		* Keeps track of the async client initialization.
		* When null or not yet resolved the auth state is `unknown`
		* Once resolved the auth state is known and it's safe to call any further client methods.
		* Keep extra care to never reject or throw uncaught errors
		*/
		this.initializePromise = null;
		/**
		* Non-null only while `initialize()` is running. While open,
		* `_notifyAllSubscribers` enqueues init-chain notifications (those fired with
		* `broadcast = true`, i.e. from `_recoverAndRefresh`) into this array instead
		* of firing directly, so that `initializePromise` is guaranteed to be
		* resolved before any subscriber callback runs. Callbacks that call
		* `getSession()` / `getUser()` etc. would otherwise deadlock because those
		* methods await `initializePromise`. Notifications from the incoming
		* BroadcastChannel handler (`broadcast = false`) are not enqueued — they fire
		* immediately. Flushed (in order) by `initialize()` after `initializePromise`
		* settles.
		*/
		this._pendingInitNotifications = null;
		this.detectSessionInUrl = true;
		this.hasCustomAuthorizationHeader = false;
		this.suppressGetSessionWarning = false;
		/**
		* Custom lock function passed via `settings.lock`. When non-null, every auth
		* operation runs inside `_acquireLock`. When null (the default), the client
		* uses its lockless coordination (refresh single-flight + commit guard).
		* TODO(v3): remove along with the legacy lock path.
		*/
		this.lock = null;
		this.lockAcquired = false;
		this.pendingInLock = [];
		/**
		* Used to broadcast state change events to other tabs listening.
		*/
		this.broadcastChannel = null;
		this.logger = console.log;
		const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
		this.storageKey = settings.storageKey;
		this.instanceID = (_a = GoTrueClient.nextInstanceID[this.storageKey]) !== null && _a !== void 0 ? _a : 0;
		GoTrueClient.nextInstanceID[this.storageKey] = this.instanceID + 1;
		this.logDebugMessages = !!settings.debug;
		if (typeof settings.debug === "function") this.logger = settings.debug;
		if (this.instanceID > 0 && isBrowser()) {
			const message = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
			console.warn(message);
			if (this.logDebugMessages) console.trace(message);
		}
		this.persistSession = settings.persistSession;
		this.autoRefreshToken = settings.autoRefreshToken;
		this.experimental = (_b = settings.experimental) !== null && _b !== void 0 ? _b : {};
		this.admin = new GoTrueAdminApi({
			url: settings.url,
			headers: settings.headers,
			fetch: settings.fetch,
			experimental: this.experimental
		});
		this.url = settings.url;
		this.headers = settings.headers;
		this.fetch = resolveFetch(settings.fetch);
		this.detectSessionInUrl = settings.detectSessionInUrl;
		this.flowType = settings.flowType;
		this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
		this.throwOnError = settings.throwOnError;
		this.lockAcquireTimeout = settings.lockAcquireTimeout;
		if (settings.lock != null) {
			this.lock = settings.lock;
			if (!deprecatedLockWarned) {
				deprecatedLockWarned = true;
				console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`);
			}
		}
		if (!this.jwks) {
			this.jwks = { keys: [] };
			this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
		}
		this.mfa = {
			verify: this._verify.bind(this),
			enroll: this._enroll.bind(this),
			unenroll: this._unenroll.bind(this),
			challenge: this._challenge.bind(this),
			listFactors: this._listFactors.bind(this),
			challengeAndVerify: this._challengeAndVerify.bind(this),
			getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
			webauthn: new WebAuthnApi(this)
		};
		this.oauth = {
			getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
			approveAuthorization: this._approveAuthorization.bind(this),
			denyAuthorization: this._denyAuthorization.bind(this),
			listGrants: this._listOAuthGrants.bind(this),
			revokeGrant: this._revokeOAuthGrant.bind(this)
		};
		this.passkey = {
			startRegistration: this._startPasskeyRegistration.bind(this),
			verifyRegistration: this._verifyPasskeyRegistration.bind(this),
			startAuthentication: this._startPasskeyAuthentication.bind(this),
			verifyAuthentication: this._verifyPasskeyAuthentication.bind(this),
			list: this._listPasskeys.bind(this),
			update: this._updatePasskey.bind(this),
			delete: this._deletePasskey.bind(this)
		};
		if (this.persistSession) {
			if (settings.storage) this.storage = settings.storage;
			else if (supportsLocalStorage()) this.storage = globalThis.localStorage;
			else {
				this.memoryStorage = {};
				this.storage = memoryLocalStorageAdapter(this.memoryStorage);
			}
			if (settings.userStorage) this.userStorage = settings.userStorage;
		} else {
			this.memoryStorage = {};
			this.storage = memoryLocalStorageAdapter(this.memoryStorage);
		}
		if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
			try {
				this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
			} catch (e) {
				console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
			}
			(_c = this.broadcastChannel) === null || _c === void 0 || _c.addEventListener("message", async (event) => {
				this._debug("received broadcast notification from other tab or client", event);
				if (event.data.event === "TOKEN_REFRESHED" || event.data.event === "SIGNED_IN") this.lastRefreshFailure = null;
				try {
					await this._notifyAllSubscribers(event.data.event, event.data.session, false);
				} catch (error) {
					this._debug("#broadcastChannel", "error", error);
				}
			});
		}
		if (!settings.skipAutoInitialize) this.initialize().catch((error) => {
			this._debug("#initialize()", "error", error);
		});
	}
	/**
	* Returns whether error throwing mode is enabled for this client.
	*/
	isThrowOnErrorEnabled() {
		return this.throwOnError;
	}
	/**
	* Centralizes return handling with optional error throwing. When `throwOnError` is enabled
	* and the provided result contains a non-nullish error, the error is thrown instead of
	* being returned. This ensures consistent behavior across all public API methods.
	*/
	_returnResult(result) {
		if (this.throwOnError && result && result.error) throw result.error;
		return result;
	}
	_logPrefix() {
		return `GoTrueClient@${this.storageKey}:${this.instanceID} (${version}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
	}
	_debug(...args) {
		if (this.logDebugMessages) this.logger(this._logPrefix(), ...args);
		return this;
	}
	/**
	* Initialize the auth client by loading the session from storage or
	* detecting it from the URL after an OAuth, magic-link, or password-recovery
	* redirect.
	*
	* **Most callers do not need to invoke this directly.** The client calls it
	* automatically during construction, and to react to sign-in events (including
	* post-redirect events) you should subscribe to `onAuthStateChange` rather
	* than awaiting `initialize()`.
	*
	* You only need to call it manually when you have opted out of the automatic
	* call by passing `skipAutoInitialize: true` — for example, in an SSR context
	* where you need to control initialization timing. In that case, awaiting
	* `initialize()` returns the resolved session result (or any error encountered
	* while detecting it from the URL).
	*
	* @category Auth
	*/
	async initialize() {
		var _a;
		if (this.initializePromise) return await this.initializePromise;
		this._pendingInitNotifications = [];
		this.initializePromise = (async () => {
			if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
				return await this._initialize();
			});
			return await this._initialize();
		})();
		const result = await this.initializePromise;
		const queue = (_a = this._pendingInitNotifications) !== null && _a !== void 0 ? _a : [];
		this._pendingInitNotifications = null;
		for (const n of queue) await this._notifyAllSubscribers(n.event, n.session, n.broadcast);
		return result;
	}
	/**
	* IMPORTANT:
	* 1. Never throw in this method, as it is called from the constructor
	* 2. Never return a session from this method as it would be cached over
	*    the whole lifetime of the client
	*/
	async _initialize() {
		var _a;
		try {
			let params = {};
			let callbackUrlType = "none";
			if (isBrowser()) {
				params = parseParametersFromURL(window.location.href);
				if (this._isImplicitGrantCallback(params)) callbackUrlType = "implicit";
				else if (await this._isPKCECallback(params)) callbackUrlType = "pkce";
			}
			/**
			* Attempt to get the session from the URL only if these conditions are fulfilled
			*
			* Note: If the URL isn't one of the callback url types (implicit or pkce),
			* then there could be an existing session so we don't want to prematurely remove it
			*/
			if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
				const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
				if (error) {
					this._debug("#_initialize()", "error detecting session from URL", error);
					if (isAuthImplicitGrantRedirectError(error)) {
						const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
						if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") return { error };
					}
					return { error };
				}
				const { session, redirectType } = data;
				this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
				await this._saveSession(session);
				setTimeout(async () => {
					if (redirectType === "recovery") await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
					else await this._notifyAllSubscribers("SIGNED_IN", session);
				}, 0);
				return { error: null };
			}
			await this._recoverAndRefresh();
			return { error: null };
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({ error });
			return this._returnResult({ error: new AuthUnknownError("Unexpected error during initialization", error) });
		} finally {
			await this._handleVisibilityChange();
			this._debug("#_initialize()", "end");
		}
	}
	/**
	* Creates a new anonymous user.
	*
	* @returns A session where the is_anonymous claim in the access token JWT set to true
	*
	* @category Auth
	*
	* @remarks
	* - Returns an anonymous user
	* - It is recommended to set up captcha for anonymous sign-ins to prevent abuse. You can pass in the captcha token in the `options` param.
	*
	* @example Create an anonymous user
	* ```js
	* const { data, error } = await supabase.auth.signInAnonymously({
	*   options: {
	*     captchaToken
	*   }
	* });
	* ```
	*
	* @exampleResponse Create an anonymous user
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "",
	*       "phone": "",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {},
	*       "user_metadata": {},
	*       "identities": [],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": true
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "",
	*         "phone": "",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {},
	*         "user_metadata": {},
	*         "identities": [],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "is_anonymous": true
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Create an anonymous user with custom user metadata
	* ```js
	* const { data, error } = await supabase.auth.signInAnonymously({
	*   options: {
	*     data
	*   }
	* })
	* ```
	*/
	async signInAnonymously(credentials) {
		var _a, _b, _c;
		try {
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/signup`, {
				headers: this.headers,
				body: {
					data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
					gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
				},
				xform: _sessionResponse
			});
			if (error || !data) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			const session = data.session;
			const user = data.user;
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", session);
			}
			return this._returnResult({
				data: {
					user,
					session
				},
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Creates a new user.
	*
	* Be aware that if a user account exists in the system you may get back an
	* error message that attempts to hide this information from the user.
	* This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
	*
	* @returns A logged-in session if the server has "autoconfirm" ON
	* @returns A user if the server has "autoconfirm" OFF
	*
	* @category Auth
	*
	* @remarks
	* - By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](/dashboard/project/_/auth/providers).
	* - **Confirm email** determines if users need to confirm their email address after signing up.
	*   - If **Confirm email** is enabled, a `user` is returned but `session` is null.
	*   - If **Confirm email** is disabled, both a `user` and a `session` are returned.
	* - When the user confirms their email address, they are redirected to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](/dashboard/project/_/auth/url-configuration).
	* - If signUp() is called for an existing confirmed user:
	*   - When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.
	*   - When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.
	* - To fetch the currently logged-in user, refer to [`getUser()`](/docs/reference/javascript/auth-getuser).
	*
	* @example Sign up with an email and password
	* ```js
	* const { data, error } = await supabase.auth.signUp({
	*   email: 'example@email.com',
	*   password: 'example-password',
	* })
	* ```
	*
	* @exampleResponse Sign up with an email and password
	* ```json
	* // Some fields may be null if "confirm email" is enabled.
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {},
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z"
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {},
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z"
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Sign up with a phone number and password (SMS)
	* ```js
	* const { data, error } = await supabase.auth.signUp({
	*   phone: '123456789',
	*   password: 'example-password',
	*   options: {
	*     channel: 'sms'
	*   }
	* })
	* ```
	*
	* @exampleDescription Sign up with a phone number and password (whatsapp)
	* The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
	*
	* @example Sign up with a phone number and password (whatsapp)
	* ```js
	* const { data, error } = await supabase.auth.signUp({
	*   phone: '123456789',
	*   password: 'example-password',
	*   options: {
	*     channel: 'whatsapp'
	*   }
	* })
	* ```
	*
	* @example Sign up with additional user metadata
	* ```js
	* const { data, error } = await supabase.auth.signUp(
	*   {
	*     email: 'example@email.com',
	*     password: 'example-password',
	*     options: {
	*       data: {
	*         first_name: 'John',
	*         age: 27,
	*       }
	*     }
	*   }
	* )
	* ```
	*
	* @exampleDescription Sign up with a redirect URL
	* - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
	*
	* @example Sign up with a redirect URL
	* ```js
	* const { data, error } = await supabase.auth.signUp(
	*   {
	*     email: 'example@email.com',
	*     password: 'example-password',
	*     options: {
	*       emailRedirectTo: 'https://example.com/welcome'
	*     }
	*   }
	* )
	* ```
	*/
	async signUp(credentials) {
		var _a, _b, _c;
		let flowId = null;
		try {
			let res;
			if ("email" in credentials) {
				const { email, password, options } = credentials;
				let codeChallenge = null;
				let codeChallengeMethod = null;
				if (this.flowType === "pkce") [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
				res = await _request(this.fetch, "POST", `${this.url}/signup`, {
					headers: this.headers,
					redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId),
					body: {
						email,
						password,
						data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
						code_challenge: codeChallenge,
						code_challenge_method: codeChallengeMethod
					},
					xform: _sessionResponse
				});
			} else if ("phone" in credentials) {
				const { phone, password, options } = credentials;
				res = await _request(this.fetch, "POST", `${this.url}/signup`, {
					headers: this.headers,
					body: {
						phone,
						password,
						data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
						channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
					},
					xform: _sessionResponse
				});
			} else throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
			const { data, error } = res;
			if (error || !data) {
				await removePKCEVerifier(this.storage, this.storageKey, flowId);
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
			}
			const session = data.session;
			const user = data.user;
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", session);
			}
			return this._returnResult({
				data: {
					user,
					session
				},
				error: null
			});
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Log in an existing user with an email and password or phone and password.
	*
	* Be aware that you may get back an error message that will not distinguish
	* between the cases where the account does not exist or that the
	* email/phone and password combination is wrong or that the account can only
	* be accessed via social login.
	*
	* @category Auth
	*
	* @remarks
	* - Requires either an email and password or a phone number and password.
	*
	* @example Sign in with email and password
	* ```js
	* const { data, error } = await supabase.auth.signInWithPassword({
	*   email: 'example@email.com',
	*   password: 'example-password',
	* })
	* ```
	*
	* @exampleResponse Sign in with email and password
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {},
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z"
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {},
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z"
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Sign in with phone and password
	* ```js
	* const { data, error } = await supabase.auth.signInWithPassword({
	*   phone: '+13334445555',
	*   password: 'some-password',
	* })
	* ```
	*
	* @exampleDescription Handling errors
	* Log the full `error` object so fields like `code`, `status`, and `name` aren't hidden. The `error.code` (e.g. `'invalid_credentials'`, `'email_not_confirmed'`) is often more useful for branching than `error.message`, and the full object surfaces both.
	*
	* @example Handling errors
	* ```js
	* const { data, error } = await supabase.auth.signInWithPassword({
	*   email: 'example@email.com',
	*   password: 'example-password',
	* })
	* if (error) {
	*   console.error(error)
	*   return
	* }
	* ```
	*/
	async signInWithPassword(credentials) {
		try {
			let res;
			if ("email" in credentials) {
				const { email, password, options } = credentials;
				res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
					headers: this.headers,
					body: {
						email,
						password,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
					},
					xform: _sessionResponsePassword
				});
			} else if ("phone" in credentials) {
				const { phone, password, options } = credentials;
				res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
					headers: this.headers,
					body: {
						phone,
						password,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
					},
					xform: _sessionResponsePassword
				});
			} else throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
			const { data, error } = res;
			if (error) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			else if (!data || !data.session || !data.user) {
				const invalidTokenError = new AuthInvalidTokenResponseError();
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: invalidTokenError
				});
			}
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", data.session);
			}
			return this._returnResult({
				data: Object.assign({
					user: data.user,
					session: data.session
				}, data.weak_password ? { weakPassword: data.weak_password } : null),
				error
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Log in an existing user via a third-party provider.
	* This method supports the PKCE flow.
	*
	* @category Auth
	*
	* @remarks
	* - This method is used for signing in using [Social Login (OAuth) providers](/docs/guides/auth#configure-third-party-providers).
	* - It works by redirecting your application to the provider's authorization screen, before bringing back the user to your app.
	*
	* @example Sign in using a third-party provider
	* ```js
	* const { data, error } = await supabase.auth.signInWithOAuth({
	*   provider: 'github'
	* })
	* ```
	*
	* @exampleResponse Sign in using a third-party provider
	* ```json
	* {
	*   data: {
	*     provider: 'github',
	*     url: <PROVIDER_URL_TO_REDIRECT_TO>,
	*     flowId: <PKCE_FLOW_ID_OR_NULL>
	*   },
	*   error: null
	* }
	* ```
	*
	* @exampleDescription Sign in using a third-party provider with redirect
	* - When the OAuth provider successfully authenticates the user, they are redirected to the URL specified in the `redirectTo` parameter. This parameter defaults to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls). It does not redirect the user immediately after invoking this method.
	* - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
	*
	* @example Sign in using a third-party provider with redirect
	* ```js
	* const { data, error } = await supabase.auth.signInWithOAuth({
	*   provider: 'github',
	*   options: {
	*     redirectTo: 'https://example.com/welcome'
	*   }
	* })
	* ```
	*
	* @exampleDescription Sign in with scopes and access provider tokens
	* If you need additional access from an OAuth provider, in order to access provider specific APIs in the name of the user, you can do this by passing in the scopes the user should authorize for your application. Note that the `scopes` option takes in **a space-separated list** of scopes.
	*
	* Because OAuth sign-in often includes redirects, you should register an `onAuthStateChange` callback immediately after you create the Supabase client. This callback will listen for the presence of `provider_token` and `provider_refresh_token` properties on the `session` object and store them in local storage. The client library will emit these values **only once** immediately after the user signs in. You can then access them by looking them up in local storage, or send them to your backend servers for further processing.
	*
	* Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
	*
	* @example Sign in with scopes and access provider tokens
	* ```js
	* // Register this immediately after calling createClient!
	* // Because signInWithOAuth causes a redirect, you need to fetch the
	* // provider tokens from the callback.
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (session && session.provider_token) {
	*     window.localStorage.setItem('oauth_provider_token', session.provider_token)
	*   }
	*
	*   if (session && session.provider_refresh_token) {
	*     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
	*   }
	*
	*   if (event === 'SIGNED_OUT') {
	*     window.localStorage.removeItem('oauth_provider_token')
	*     window.localStorage.removeItem('oauth_provider_refresh_token')
	*   }
	* })
	*
	* // Call this on your Sign in with GitHub button to initiate OAuth
	* // with GitHub with the requested elevated scopes.
	* await supabase.auth.signInWithOAuth({
	*   provider: 'github',
	*   options: {
	*     scopes: 'repo gist notifications'
	*   }
	* })
	* ```
	*/
	async signInWithOAuth(credentials) {
		var _a, _b, _c, _d;
		return await this._handleProviderSignIn(credentials.provider, {
			redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
			scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
			queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
			skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
		});
	}
	/**
	* Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
	*
	* @category Auth
	*
	* @remarks
	* - Used when `flowType` is set to `pkce` in client options.
	* - When several PKCE flows are in flight at once, pass `options.flowId` so
	*   the code is exchanged with the verifier created by that specific flow.
	*   The flow id is returned by `signInWithOAuth`, and with
	*   `experimental.appendPkceFlowIdToRedirects` enabled it also arrives on
	*   your callback URL as the reserved `sb_flow_id` query parameter (read
	*   automatically in a browser).
	* - When a flow id is present but its stored verifier is gone (evicted,
	*   already used, or from another device), the call fails with a verifier
	*   missing error instead of trying another flow's verifier — a mismatched
	*   verifier would consume the single-use code. Without any flow id the
	*   most recently stored verifier is used, as before.
	*
	* @example Exchange Auth Code
	* ```js
	* supabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')
	* ```
	*
	* @example Exchange Auth Code for a specific flow (e.g. in a server-side callback handler)
	* ```js
	* const flowId = requestUrl.searchParams.get('sb_flow_id')
	* supabase.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined)
	* ```
	*
	* @exampleResponse Exchange Auth Code
	* ```json
	* {
	*   "data": {
	*     session: {
	*       access_token: '<ACCESS_TOKEN>',
	*       token_type: 'bearer',
	*       expires_in: 3600,
	*       expires_at: 1700000000,
	*       refresh_token: '<REFRESH_TOKEN>',
	*       user: {
	*         id: '11111111-1111-1111-1111-111111111111',
	*         aud: 'authenticated',
	*         role: 'authenticated',
	*         email: 'example@email.com'
	*         email_confirmed_at: '2024-01-01T00:00:00Z',
	*         phone: '',
	*         confirmation_sent_at: '2024-01-01T00:00:00Z',
	*         confirmed_at: '2024-01-01T00:00:00Z',
	*         last_sign_in_at: '2024-01-01T00:00:00Z',
	*         app_metadata: {
	*           "provider": "email",
	*           "providers": [
	*             "email",
	*             "<OTHER_PROVIDER>"
	*           ]
	*         },
	*         user_metadata: {
	*           email: 'email@email.com',
	*           email_verified: true,
	*           full_name: 'User Name',
	*           iss: '<ISS>',
	*           name: 'User Name',
	*           phone_verified: false,
	*           provider_id: '<PROVIDER_ID>',
	*           sub: '<SUB>'
	*         },
	*         identities: [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "email@example.com"
	*           },
	*           {
	*             "identity_id": "33333333-3333-3333-3333-333333333333",
	*             "id": "<ID>",
	*             "user_id": "<USER_ID>",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": true,
	*               "full_name": "User Name",
	*               "iss": "<ISS>",
	*               "name": "User Name",
	*               "phone_verified": false,
	*               "provider_id": "<PROVIDER_ID>",
	*               "sub": "<SUB>"
	*             },
	*             "provider": "<PROVIDER>",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         created_at: '2024-01-01T00:00:00Z',
	*         updated_at: '2024-01-01T00:00:00Z',
	*         is_anonymous: false
	*       },
	*       provider_token: '<PROVIDER_TOKEN>',
	*       provider_refresh_token: '<PROVIDER_REFRESH_TOKEN>'
	*     },
	*     user: {
	*       id: '11111111-1111-1111-1111-111111111111',
	*       aud: 'authenticated',
	*       role: 'authenticated',
	*       email: 'example@email.com',
	*       email_confirmed_at: '2024-01-01T00:00:00Z',
	*       phone: '',
	*       confirmation_sent_at: '2024-01-01T00:00:00Z',
	*       confirmed_at: '2024-01-01T00:00:00Z',
	*       last_sign_in_at: '2024-01-01T00:00:00Z',
	*       app_metadata: {
	*         provider: 'email',
	*         providers: [
	*           "email",
	*           "<OTHER_PROVIDER>"
	*         ]
	*       },
	*       user_metadata: {
	*         email: 'email@email.com',
	*         email_verified: true,
	*         full_name: 'User Name',
	*         iss: '<ISS>',
	*         name: 'User Name',
	*         phone_verified: false,
	*         provider_id: '<PROVIDER_ID>',
	*         sub: '<SUB>'
	*       },
	*       identities: [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "email@example.com"
	*         },
	*         {
	*           "identity_id": "33333333-3333-3333-3333-333333333333",
	*           "id": "<ID>",
	*           "user_id": "<USER_ID>",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": true,
	*             "full_name": "User Name",
	*             "iss": "<ISS>",
	*             "name": "User Name",
	*             "phone_verified": false,
	*             "provider_id": "<PROVIDER_ID>",
	*             "sub": "<SUB>"
	*           },
	*           "provider": "<PROVIDER>",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       created_at: '2024-01-01T00:00:00Z',
	*       updated_at: '2024-01-01T00:00:00Z',
	*       is_anonymous: false
	*     },
	*     redirectType: null
	*   },
	*   "error": null
	* }
	* ```
	*/
	async exchangeCodeForSession(authCode, options) {
		await this.initializePromise;
		if (this.lock != null) return this._acquireLock(this.lockAcquireTimeout, async () => {
			return this._exchangeCodeForSession(authCode, options);
		});
		return this._exchangeCodeForSession(authCode, options);
	}
	/**
	* Signs in a user by verifying a message signed by the user's private key.
	* Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
	* both of which derive from the EIP-4361 standard
	* With slight variation on Solana's side.
	* @reference https://eips.ethereum.org/EIPS/eip-4361
	*
	* @category Auth
	*
	* @remarks
	* - Uses a Web3 (Ethereum, Solana) wallet to sign a user in.
	* - Read up on the [potential for abuse](/docs/guides/auth/auth-web3#potential-for-abuse) before using it.
	*
	* @example Sign in with Solana or Ethereum (Window API)
	* ```js
	*   // uses window.ethereum for the wallet
	*   const { data, error } = await supabase.auth.signInWithWeb3({
	*     chain: 'ethereum',
	*     statement: 'I accept the Terms of Service at https://example.com/tos'
	*   })
	*
	*   // uses window.solana for the wallet
	*   const { data, error } = await supabase.auth.signInWithWeb3({
	*     chain: 'solana',
	*     statement: 'I accept the Terms of Service at https://example.com/tos'
	*   })
	* ```
	*
	* @example Sign in with Ethereum (Message and Signature)
	* ```js
	*   const { data, error } = await supabase.auth.signInWithWeb3({
	*     chain: 'ethereum',
	*     message: '<sign in with ethereum message>',
	*     signature: '<hex of the ethereum signature over the message>',
	*   })
	* ```
	*
	* @example Sign in with Solana (Brave)
	* ```js
	*   const { data, error } = await supabase.auth.signInWithWeb3({
	*     chain: 'solana',
	*     statement: 'I accept the Terms of Service at https://example.com/tos',
	*     wallet: window.braveSolana
	*   })
	* ```
	*
	* @example Sign in with Solana (Wallet Adapter)
	* ```jsx
	*   function SignInButton() {
	*   const wallet = useWallet()
	*
	*   return (
	*     <>
	*       {wallet.connected ? (
	*         <button
	*           onClick={() => {
	*             supabase.auth.signInWithWeb3({
	*               chain: 'solana',
	*               statement: 'I accept the Terms of Service at https://example.com/tos',
	*               wallet,
	*             })
	*           }}
	*         >
	*           Sign in with Solana
	*         </button>
	*       ) : (
	*         <WalletMultiButton />
	*       )}
	*     </>
	*   )
	* }
	*
	* function App() {
	*   const endpoint = clusterApiUrl('devnet')
	*   const wallets = useMemo(() => [], [])
	*
	*   return (
	*     <ConnectionProvider endpoint={endpoint}>
	*       <WalletProvider wallets={wallets}>
	*         <WalletModalProvider>
	*           <SignInButton />
	*         </WalletModalProvider>
	*       </WalletProvider>
	*     </ConnectionProvider>
	*   )
	* }
	* ```
	*/
	async signInWithWeb3(credentials) {
		const { chain } = credentials;
		switch (chain) {
			case "ethereum": return await this.signInWithEthereum(credentials);
			case "solana": return await this.signInWithSolana(credentials);
			default: throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
		}
	}
	async signInWithEthereum(credentials) {
		var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m;
		let message;
		let signature;
		if ("message" in credentials) {
			message = credentials.message;
			signature = credentials.signature;
		} else {
			const { chain, wallet, statement, options } = credentials;
			let resolvedWallet;
			if (!isBrowser()) {
				if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
				resolvedWallet = wallet;
			} else if (typeof wallet === "object") resolvedWallet = wallet;
			else {
				const windowAny = window;
				if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") resolvedWallet = windowAny.ethereum;
				else throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
			}
			const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
			const accounts = await resolvedWallet.request({ method: "eth_requestAccounts" }).then((accs) => accs).catch(() => {
				throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
			});
			if (!accounts || accounts.length === 0) throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
			const address = getAddress(accounts[0]);
			let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
			if (!chainId) chainId = fromHex(await resolvedWallet.request({ method: "eth_chainId" }));
			message = createSiweMessage({
				domain: url.host,
				address,
				statement,
				uri: url.href,
				version: "1",
				chainId,
				nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
				issuedAt: (_f = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _f !== void 0 ? _f : /* @__PURE__ */ new Date(),
				expirationTime: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.expirationTime,
				notBefore: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.notBefore,
				requestId: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.requestId,
				resources: (_k = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _k === void 0 ? void 0 : _k.resources
			});
			signature = await resolvedWallet.request({
				method: "personal_sign",
				params: [toHex(message), address]
			});
		}
		try {
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
				headers: this.headers,
				body: Object.assign({
					chain: "ethereum",
					message,
					signature
				}, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
				xform: _sessionResponse
			});
			if (error) throw error;
			if (!data || !data.session || !data.user) {
				const invalidTokenError = new AuthInvalidTokenResponseError();
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: invalidTokenError
				});
			}
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", data.session);
			}
			return this._returnResult({
				data: Object.assign({}, data),
				error
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	async signInWithSolana(credentials) {
		var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
		let message;
		let signature;
		if ("message" in credentials) {
			message = credentials.message;
			signature = credentials.signature;
		} else {
			const { chain, wallet, statement, options } = credentials;
			let resolvedWallet;
			if (!isBrowser()) {
				if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
				resolvedWallet = wallet;
			} else if (typeof wallet === "object") resolvedWallet = wallet;
			else {
				const windowAny = window;
				if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) resolvedWallet = windowAny.solana;
				else throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
			}
			const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
			if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
				const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
					version: "1",
					domain: url.host,
					uri: url.href
				}), statement ? { statement } : null));
				let outputToProcess;
				if (Array.isArray(output) && output[0] && typeof output[0] === "object") outputToProcess = output[0];
				else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) outputToProcess = output;
				else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
				if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
					message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
					signature = outputToProcess.signature;
				} else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
			} else {
				if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
				message = [
					`${url.host} wants you to sign in with your Solana account:`,
					resolvedWallet.publicKey.toBase58(),
					...statement ? [
						"",
						statement,
						""
					] : [""],
					"Version: 1",
					`URI: ${url.href}`,
					`Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
					...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
					...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
					...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
					...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
					...((_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
					...((_l = (_k = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _k === void 0 ? void 0 : _k.resources) === null || _l === void 0 ? void 0 : _l.length) ? ["Resources", ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)] : []
				].join("\n");
				const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
				if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
				signature = maybeSignature;
			}
		}
		try {
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
				headers: this.headers,
				body: Object.assign({
					chain: "solana",
					message,
					signature: bytesToBase64URL(signature)
				}, ((_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken) ? { gotrue_meta_security: { captcha_token: (_o = credentials.options) === null || _o === void 0 ? void 0 : _o.captchaToken } } : null),
				xform: _sessionResponse
			});
			if (error) throw error;
			if (!data || !data.session || !data.user) {
				const invalidTokenError = new AuthInvalidTokenResponseError();
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: invalidTokenError
				});
			}
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", data.session);
			}
			return this._returnResult({
				data: Object.assign({}, data),
				error
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	async _exchangeCodeForSession(authCode, options) {
		const hasExplicitFlowId = (options === null || options === void 0 ? void 0 : options.flowId) != null;
		const requestedFlowId = hasExplicitFlowId ? validatePKCEFlowId(options === null || options === void 0 ? void 0 : options.flowId) : isBrowser() ? validatePKCEFlowId(parseParametersFromURL(window.location.href)[PKCE_FLOW_ID_PARAM]) : null;
		if (hasExplicitFlowId && !requestedFlowId) this._debug("#_exchangeCodeForSession()", "provided flowId is not a valid flow id", options === null || options === void 0 ? void 0 : options.flowId);
		const { verifier: storageItem, flowId } = hasExplicitFlowId && !requestedFlowId ? {
			verifier: null,
			flowId: null
		} : await retrievePKCEVerifier(this.storage, this.storageKey, requestedFlowId);
		const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
		try {
			if (!codeVerifier && this.flowType === "pkce") throw new AuthPKCECodeVerifierMissingError();
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
				headers: this.headers,
				body: {
					auth_code: authCode,
					code_verifier: codeVerifier
				},
				xform: _sessionResponse
			});
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (error) throw error;
			if (!data || !data.session || !data.user) {
				const invalidTokenError = new AuthInvalidTokenResponseError();
				return this._returnResult({
					data: {
						user: null,
						session: null,
						redirectType: null
					},
					error: invalidTokenError
				});
			}
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers(redirectType === "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", data.session);
			}
			return this._returnResult({
				data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }),
				error
			});
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null,
					redirectType: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Allows signing in with an OIDC ID token. The authentication provider used
	* should be enabled and configured.
	*
	* @category Auth
	*
	* @remarks
	* - Use an ID token to sign in.
	* - Especially useful when implementing sign in using native platform dialogs in mobile or desktop apps using Sign in with Apple or Sign in with Google on iOS and Android.
	* - You can also use Google's [One Tap](https://developers.google.com/identity/gsi/web/guides/display-google-one-tap) and [Automatic sign-in](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out) via this API.
	*
	* @example Sign In using ID Token
	* ```js
	* const { data, error } = await supabase.auth.signInWithIdToken({
	*   provider: 'google',
	*   token: 'your-id-token'
	* })
	* ```
	*
	* @exampleResponse Sign In using ID Token
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         ...
	*       },
	*       "user_metadata": {
	*         ...
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "provider": "google",
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           ...
	*         },
	*         "user_metadata": {
	*           ...
	*         },
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "provider": "google",
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*/
	async signInWithIdToken(credentials) {
		try {
			const { options, provider, token, access_token, nonce } = credentials;
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
				headers: this.headers,
				body: {
					provider,
					id_token: token,
					access_token,
					nonce,
					gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
				},
				xform: _sessionResponse
			});
			if (error) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			else if (!data || !data.session || !data.user) {
				const invalidTokenError = new AuthInvalidTokenResponseError();
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: invalidTokenError
				});
			}
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", data.session);
			}
			return this._returnResult({
				data,
				error
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Log in a user using magiclink or a one-time password (OTP).
	*
	* If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
	* If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
	* If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
	*
	* Be aware that you may get back an error message that will not distinguish
	* between the cases where the account does not exist or, that the account
	* can only be accessed via social login.
	*
	* Do note that you will need to configure a Whatsapp sender on Twilio
	* if you are using phone sign in with the 'whatsapp' channel. The whatsapp
	* channel is not supported on other providers
	* at this time.
	* This method supports PKCE when an email is passed.
	*
	* @category Auth
	*
	* @remarks
	* - Requires either an email or phone number.
	* - This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.
	* - If the user doesn't exist, `signInWithOtp()` will signup the user instead. To restrict this behavior, you can set `shouldCreateUser` in `SignInWithPasswordlessCredentials.options` to `false`.
	* - If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.
	* - If you're using phone, you can configure whether you want the user to receive a OTP.
	* - The magic link's destination URL is determined by the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls).
	* - See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
	* - Magic links and OTPs share the same implementation. To send users a one-time code instead of a magic link, [modify the magic link email template](/dashboard/project/_/auth/templates) to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
	* - See our [Twilio Phone Auth Guide](/docs/guides/auth/phone-login?showSMSProvider=Twilio) for details about configuring WhatsApp sign in.
	*
	* @exampleDescription Sign in with email
	* The user will be sent an email which contains either a magiclink or a OTP or both. By default, a given user can only request a OTP once every 60 seconds.
	*
	* @example Sign in with email
	* ```js
	* const { data, error } = await supabase.auth.signInWithOtp({
	*   email: 'example@email.com',
	*   options: {
	*     emailRedirectTo: 'https://example.com/welcome'
	*   }
	* })
	* ```
	*
	* @exampleResponse Sign in with email
	* ```json
	* {
	*   "data": {
	*     "user": null,
	*     "session": null
	*   },
	*   "error": null
	* }
	* ```
	*
	* @exampleDescription Sign in with SMS OTP
	* The user will be sent a SMS which contains a OTP. By default, a given user can only request a OTP once every 60 seconds.
	*
	* @example Sign in with SMS OTP
	* ```js
	* const { data, error } = await supabase.auth.signInWithOtp({
	*   phone: '+13334445555',
	* })
	* ```
	*
	* @exampleDescription Sign in with WhatsApp OTP
	* The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.
	*
	* @example Sign in with WhatsApp OTP
	* ```js
	* const { data, error } = await supabase.auth.signInWithOtp({
	*   phone: '+13334445555',
	*   options: {
	*     channel:'whatsapp',
	*   }
	* })
	* ```
	*/
	async signInWithOtp(credentials) {
		var _a, _b, _c, _d, _f;
		let flowId = null;
		try {
			if ("email" in credentials) {
				const { email, options } = credentials;
				let codeChallenge = null;
				let codeChallengeMethod = null;
				if (this.flowType === "pkce") [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
				const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
					headers: this.headers,
					body: {
						email,
						data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
						create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
						code_challenge: codeChallenge,
						code_challenge_method: codeChallengeMethod
					},
					redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId)
				});
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
			}
			if ("phone" in credentials) {
				const { phone, options } = credentials;
				const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
					headers: this.headers,
					body: {
						phone,
						data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
						create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
						channel: (_f = options === null || options === void 0 ? void 0 : options.channel) !== null && _f !== void 0 ? _f : "sms"
					}
				});
				return this._returnResult({
					data: {
						user: null,
						session: null,
						messageId: data === null || data === void 0 ? void 0 : data.message_id
					},
					error
				});
			}
			throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Log in a user given a User supplied OTP or TokenHash received through mobile or email.
	*
	* @category Auth
	*
	* @remarks
	* - The `verifyOtp` method takes in different verification types.
	* - If a phone number is used, the type can either be:
	*   1. `sms` – Used when verifying a one-time password (OTP) sent via SMS during sign-up or sign-in.
	*   2. `phone_change` – Used when verifying an OTP sent to a new phone number during a phone number update process.
	* - If an email address is used, the type can be one of the following (note: `signup` and `magiclink` types are deprecated):
	*   1. `email` – Used when verifying an OTP sent to the user's email during sign-up or sign-in.
	*   2. `recovery` – Used when verifying an OTP sent for account recovery, typically after a password reset request.
	*   3. `invite` – Used when verifying an OTP sent as part of an invitation to join a project or organization.
	*   4. `email_change` – Used when verifying an OTP sent to a new email address during an email update process.
	* - The verification type used should be determined based on the corresponding auth method called before `verifyOtp` to sign up / sign-in a user.
	* - The `TokenHash` is contained in the [email templates](/docs/guides/auth/auth-email-templates) and can be used to sign in.  You may wish to use the hash for the PKCE flow for Server Side Auth. Read [the Password-based Auth guide](/docs/guides/auth/passwords) for more details.
	*
	* @example Verify Signup One-Time Password (OTP)
	* ```js
	* const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})
	* ```
	*
	* @exampleResponse Verify Signup One-Time Password (OTP)
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "recovery_sent_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "confirmed_at": "2024-01-01T00:00:00Z",
	*         "recovery_sent_at": "2024-01-01T00:00:00Z",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {
	*           "email": "example@email.com",
	*           "email_verified": false,
	*           "phone_verified": false,
	*           "sub": "11111111-1111-1111-1111-111111111111"
	*         },
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "is_anonymous": false
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Verify SMS One-Time Password (OTP)
	* ```js
	* const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})
	* ```
	*
	* @example Verify Email Auth (Token Hash)
	* ```js
	* const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email'})
	* ```
	*/
	async verifyOtp(params) {
		var _a, _b;
		try {
			let redirectTo = void 0;
			let captchaToken = void 0;
			if ("options" in params) {
				redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
				captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
			}
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
				headers: this.headers,
				body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
				redirectTo,
				xform: _sessionResponse
			});
			if (error) throw error;
			if (!data) throw /* @__PURE__ */ new Error("An error occurred on token verification.");
			const session = data.session;
			const user = data.user;
			if (session === null || session === void 0 ? void 0 : session.access_token) {
				await this._saveSession(session);
				await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
			}
			return this._returnResult({
				data: {
					user,
					session
				},
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Attempts a single-sign on using an enterprise Identity Provider. A
	* successful SSO attempt will redirect the current page to the identity
	* provider authorization page. The redirect URL is implementation and SSO
	* protocol specific.
	*
	* You can use it by providing a SSO domain. Typically you can extract this
	* domain by asking users for their email address. If this domain is
	* registered on the Auth instance the redirect will use that organization's
	* currently active SSO Identity Provider for the login.
	*
	* If you have built an organization-specific login page, you can use the
	* organization's SSO Identity Provider UUID directly instead.
	*
	* @category Auth
	*
	* @remarks
	* - Before you can call this method you need to [establish a connection](/docs/guides/auth/sso/auth-sso-saml#managing-saml-20-connections) to an identity provider. Use the [CLI commands](/docs/reference/cli/supabase-sso) to do this.
	* - If you've associated an email domain to the identity provider, you can use the `domain` property to start a sign-in flow.
	* - In case you need to use a different way to start the authentication flow with an identity provider, you can use the `providerId` property. For example:
	*     - Mapping specific user email addresses with an identity provider.
	*     - Using different hints to identity the identity provider to be used by the user, like a company-specific page, IP address or other tracking information.
	*
	* @example Sign in with email domain
	* ```js
	*   // You can extract the user's email domain and use it to trigger the
	*   // authentication flow with the correct identity provider.
	*
	*   const { data, error } = await supabase.auth.signInWithSSO({
	*     domain: 'company.com'
	*   })
	*
	*   if (data?.url) {
	*     // redirect the user to the identity provider's authentication flow
	*     window.location.href = data.url
	*   }
	* ```
	*
	* @example Sign in with provider UUID
	* ```js
	*   // Useful when you need to map a user's sign in request according
	*   // to different rules that can't use email domains.
	*
	*   const { data, error } = await supabase.auth.signInWithSSO({
	*     providerId: '21648a9d-8d5a-4555-a9d1-d6375dc14e92'
	*   })
	*
	*   if (data?.url) {
	*     // redirect the user to the identity provider's authentication flow
	*     window.location.href = data.url
	*   }
	* ```
	*/
	async signInWithSSO(params) {
		var _a, _b, _c, _d;
		let flowId = null;
		try {
			let codeChallenge = null;
			let codeChallengeMethod = null;
			if (this.flowType === "pkce") [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
			const result = await _request(this.fetch, "POST", `${this.url}/sso`, {
				body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: this._maybeAppendFlowIdToRedirect((_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo, flowId) }), ((_b = params === null || params === void 0 ? void 0 : params.options) === null || _b === void 0 ? void 0 : _b.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), {
					skip_http_redirect: true,
					code_challenge: codeChallenge,
					code_challenge_method: codeChallengeMethod
				}),
				headers: this.headers,
				xform: _ssoResponse
			});
			if (((_c = result.data) === null || _c === void 0 ? void 0 : _c.url) && isBrowser() && !((_d = params.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect)) window.location.assign(result.data.url);
			return this._returnResult(result);
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Sends a reauthentication OTP to the user's email or phone number.
	* Requires the user to be signed-in.
	*
	* @category Auth
	*
	* @remarks
	* - This method is used together with `updateUser()` when a user's password needs to be updated.
	* - If you require your user to reauthenticate before updating their password, you need to enable the **Secure password change** option in your [project's email provider settings](/dashboard/project/_/auth/providers).
	* - A user is only require to reauthenticate before updating their password if **Secure password change** is enabled and the user **hasn't recently signed in**. A user is deemed recently signed in if the session was created in the last 24 hours.
	* - This method will send a nonce to the user's email. If the user doesn't have a confirmed email address, the method will send the nonce to the user's confirmed phone number instead.
	* - After receiving the OTP, include it as the `nonce` in your `updateUser()` call to finalize the password change.
	*
	* @exampleDescription Send reauthentication nonce
	* Sends a reauthentication nonce to the user's email or phone number.
	*
	* @example Send reauthentication nonce
	* ```js
	* const { error } = await supabase.auth.reauthenticate()
	* ```
	*/
	async reauthenticate() {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._reauthenticate();
		});
		return await this._reauthenticate();
	}
	async _reauthenticate() {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) throw sessionError;
				if (!session) throw new AuthSessionMissingError();
				const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
					headers: this.headers,
					jwt: session.access_token
				});
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
	*
	* @category Auth
	*
	* @remarks
	* - Resends a signup confirmation, email change or phone change email to the user.
	* - Passwordless sign-ins can be resent by calling the `signInWithOtp()` method again.
	* - Password recovery emails can be resent by calling the `resetPasswordForEmail()` method again.
	* - This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made(note: For existing users signing in with OTP, you should use `signInWithOtp()` again to resend the OTP).
	* - You can specify a redirect url when you resend an email link using the `emailRedirectTo` option.
	*
	* @exampleDescription Resend an email signup confirmation
	* Resends the email signup confirmation to the user
	*
	* @example Resend an email signup confirmation
	* ```js
	* const { error } = await supabase.auth.resend({
	*   type: 'signup',
	*   email: 'email@example.com',
	*   options: {
	*     emailRedirectTo: 'https://example.com/welcome'
	*   }
	* })
	* ```
	*
	* @exampleDescription Resend a phone signup confirmation
	* Resends the phone signup confirmation email to the user
	*
	* @example Resend a phone signup confirmation
	* ```js
	* const { error } = await supabase.auth.resend({
	*   type: 'sms',
	*   phone: '1234567890'
	* })
	* ```
	*
	* @exampleDescription Resend email change email
	* Resends the email change email to the user
	*
	* @example Resend email change email
	* ```js
	* const { error } = await supabase.auth.resend({
	*   type: 'email_change',
	*   email: 'email@example.com'
	* })
	* ```
	*
	* @exampleDescription Resend phone change OTP
	* Resends the phone change OTP to the user
	*
	* @example Resend phone change OTP
	* ```js
	* const { error } = await supabase.auth.resend({
	*   type: 'phone_change',
	*   phone: '1234567890'
	* })
	* ```
	*/
	async resend(credentials) {
		let flowId = null;
		try {
			const endpoint = `${this.url}/resend`;
			if ("email" in credentials) {
				const { email, type, options } = credentials;
				let codeChallenge = null;
				let codeChallengeMethod = null;
				if (this.flowType === "pkce") [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
				const { error } = await _request(this.fetch, "POST", endpoint, {
					headers: this.headers,
					body: {
						email,
						type,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
						code_challenge: codeChallenge,
						code_challenge_method: codeChallengeMethod
					},
					redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId)
				});
				if (error) await removePKCEVerifier(this.storage, this.storageKey, flowId);
				return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
			} else if ("phone" in credentials) {
				const { phone, type, options } = credentials;
				const { data, error } = await _request(this.fetch, "POST", endpoint, {
					headers: this.headers,
					body: {
						phone,
						type,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
					}
				});
				return this._returnResult({
					data: {
						user: null,
						session: null,
						messageId: data === null || data === void 0 ? void 0 : data.message_id
					},
					error
				});
			}
			throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Returns the session, refreshing it if necessary.
	*
	* The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
	*
	* **IMPORTANT:** This method loads values directly from the storage attached
	* to the client. If that storage is based on request cookies for example,
	* the values in it may not be authentic and therefore it's strongly advised
	* against using this method and its results in such circumstances. A warning
	* will be emitted if this is detected. Use {@link GoTrueClient.getUser} instead.
	*
	* @category Auth
	*
	* @remarks
	* - Since the introduction of [asymmetric JWT signing keys](/docs/guides/auth/signing-keys), this method is considered low-level and we encourage you to use `getClaims()` or `getUser()` instead.
	* - Retrieves the current [user session](/docs/guides/auth/sessions) from the storage medium (local storage, cookies).
	* - The session contains an access token (signed JWT), a refresh token and the user object.
	* - If the session's access token is expired or is about to expire, this method will use the refresh token to refresh the session.
	* - When using in a browser, or you've called `startAutoRefresh()` in your environment (React Native, etc.) this function always returns a valid access token without refreshing the session itself, as this is done in the background. This function returns very fast.
	* - **IMPORTANT SECURITY NOTICE:** If using an insecure storage medium, such as cookies or request headers, the user object returned by this function **must not be trusted**. Always verify the JWT using `getClaims()` or your own JWT verification library to securely establish the user's identity and access. You can also use `getUser()` to fetch the user object directly from the Auth server for this purpose.
	* - Cross-tab refresh races are handled by the GoTrue server (the rotated token from the first tab is returned to subsequent tabs via the parent-of-active mechanism), so no client-side serialization is needed.
	*
	* @example Get the session data
	* ```js
	* const { data, error } = await supabase.auth.getSession()
	* ```
	*
	* @exampleResponse Get the session data
	* ```json
	* {
	*   "data": {
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {
	*           "email": "example@email.com",
	*           "email_verified": false,
	*           "phone_verified": false,
	*           "sub": "11111111-1111-1111-1111-111111111111"
	*         },
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "is_anonymous": false
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*/
	async getSession() {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return this._useSession(async (result) => {
				return result;
			});
		});
		return await this._useSession(async (result) => {
			return result;
		});
	}
	/**
	* Acquires a global lock based on the storage key.
	*
	* TODO(v3): remove along with the legacy lock path. Only called when
	* `this.lock` is non-null (custom lock supplied via constructor). The
	* default lockless path bypasses this entirely.
	*/
	async _acquireLock(acquireTimeout, fn) {
		this._debug("#_acquireLock", "begin", acquireTimeout);
		try {
			if (this.lockAcquired) {
				const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
				const result = (async () => {
					await last;
					return await fn();
				})();
				this.pendingInLock.push((async () => {
					try {
						await result;
					} catch (_e) {}
				})());
				return result;
			}
			return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
				this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
				try {
					this.lockAcquired = true;
					const result = fn();
					this.pendingInLock.push((async () => {
						try {
							await result;
						} catch (e) {}
					})());
					await result;
					while (this.pendingInLock.length) {
						const waitOn = [...this.pendingInLock];
						await Promise.all(waitOn);
						this.pendingInLock.splice(0, waitOn.length);
					}
					return await result;
				} finally {
					this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
					this.lockAcquired = false;
				}
			});
		} finally {
			this._debug("#_acquireLock", "end");
		}
	}
	/**
	* Use instead of {@link GoTrueClient.getSession} inside the library. Loads the session
	* via `__loadSession` (which may trigger a refresh if the access token is
	* within the expiry margin) and runs `fn` with the result.
	*/
	async _useSession(fn) {
		this._debug("#_useSession", "begin");
		try {
			return await fn(await this.__loadSession());
		} finally {
			this._debug("#_useSession", "end");
		}
	}
	/**
	* NEVER USE DIRECTLY!
	*
	* Always use `_useSession`.
	*/
	async __loadSession() {
		this._debug("#__loadSession()", "begin");
		if (this.lock != null && !this.lockAcquired) this._debug("#__loadSession()", "used outside of an acquired lock!", (/* @__PURE__ */ new Error()).stack);
		try {
			let currentSession = null;
			const maybeSession = await getItemAsync(this.storage, this.storageKey);
			this._debug("#getSession()", "session from storage", maybeSession);
			if (maybeSession !== null) {
				if (this._isValidSession(maybeSession)) currentSession = maybeSession;
				else {
					this._debug("#getSession()", "session from storage is not valid");
					await this._removeSession();
				}
			}
			if (!currentSession) return {
				data: { session: null },
				error: null
			};
			const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
			this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
			if (!hasExpired) {
				if (this.userStorage) {
					const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
					if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) currentSession.user = maybeUser.user;
					else currentSession.user = userNotAvailableProxy();
				}
				if (this.storage.isServer && currentSession.user && !currentSession.user.__isUserNotAvailableProxy) {
					const suppressWarningRef = { value: this.suppressGetSessionWarning };
					currentSession.user = insecureUserWarningProxy(currentSession.user, suppressWarningRef);
					if (suppressWarningRef.value) this.suppressGetSessionWarning = true;
				}
				return {
					data: { session: currentSession },
					error: null
				};
			}
			const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
			if (error) {
				if (!!(currentSession.expires_at && currentSession.expires_at * 1e3 > Date.now())) {
					const stillStored = await getItemAsync(this.storage, this.storageKey);
					if (stillStored && stillStored.refresh_token === currentSession.refresh_token) return this._returnResult({
						data: { session: currentSession },
						error: null
					});
				}
				return this._returnResult({
					data: { session: null },
					error
				});
			}
			return this._returnResult({
				data: { session },
				error: null
			});
		} finally {
			this._debug("#__loadSession()", "end");
		}
	}
	/**
	* Gets the current user details if there is an existing session. This method
	* performs a network request to the Supabase Auth server, so the returned
	* value is authentic and can be used to base authorization rules on.
	*
	* @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
	*
	* @category Auth
	*
	* @remarks
	* - This method fetches the user object from the database instead of local session.
	* - This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
	* - Should always be used when checking for user authorization on the server. On the client, you can instead use `getSession().session.user` for faster results. `getSession` is insecure on the server.
	*
	* @example Get the logged in user with the current existing session
	* ```js
	* const { data: { user } } = await supabase.auth.getUser()
	* ```
	*
	* @exampleResponse Get the logged in user with the current existing session
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Get the logged in user with a custom access token jwt
	* ```js
	* const { data: { user } } = await supabase.auth.getUser(jwt)
	* ```
	*/
	async getUser(jwt) {
		if (jwt) return await this._getUser(jwt);
		await this.initializePromise;
		let result;
		if (this.lock != null) result = await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._getUser();
		});
		else result = await this._getUser();
		if (result.data.user) this.suppressGetSessionWarning = true;
		return result;
	}
	async _getUser(jwt) {
		try {
			if (jwt) return await _request(this.fetch, "GET", `${this.url}/user`, {
				headers: this.headers,
				jwt,
				xform: _userResponse
			});
			return await this._useSession(async (result) => {
				var _a, _b, _c;
				const { data, error } = result;
				if (error) throw error;
				if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) return {
					data: { user: null },
					error: new AuthSessionMissingError()
				};
				return await _request(this.fetch, "GET", `${this.url}/user`, {
					headers: this.headers,
					jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
					xform: _userResponse
				});
			});
		} catch (error) {
			if (isAuthError(error)) {
				if (isAuthSessionMissingError(error)) await this._removeSession();
				return this._returnResult({
					data: { user: null },
					error
				});
			}
			throw error;
		}
	}
	/**
	* Updates user data for a logged in user.
	*
	* @category Auth
	*
	* @remarks
	* - In order to use the `updateUser()` method, the user needs to be signed in first.
	* - By default, email updates sends a confirmation link to both the user's current and new email.
	* To only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
	*
	* @exampleDescription Update the email for an authenticated user
	* Sends a "Confirm Email Change" email to the new address. If **Secure Email Change** is enabled (default), confirmation is also required from the **old email** before the change is applied. To skip dual confirmation and apply the change after only the new email is verified, disable **Secure Email Change** in the [Email Auth Provider settings](/dashboard/project/_/auth/providers?provider=Email).
	*
	* @example Update the email for an authenticated user
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   email: 'new@email.com'
	* })
	* ```
	*
	* @exampleResponse Update the email for an authenticated user
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "new_email": "new@email.com",
	*       "email_change_sent_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @exampleDescription Update the phone number for an authenticated user
	* Sends a one-time password (OTP) to the new phone number.
	*
	* @example Update the phone number for an authenticated user
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   phone: '123456789'
	* })
	* ```
	*
	* @example Update the password for an authenticated user
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   password: 'new password'
	* })
	* ```
	*
	* @exampleDescription Update the user's metadata
	* Updates the user's custom metadata.
	*
	* **Note**: The `data` field maps to the `auth.users.raw_user_meta_data` column in your Supabase database. When calling `getUser()`, the data will be available as `user.user_metadata`.
	*
	* @example Update the user's metadata
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   data: { hello: 'world' }
	* })
	* ```
	*
	* @exampleDescription Update the user's password with a nonce
	* If **Secure password change** is enabled in your [project's email provider settings](/dashboard/project/_/auth/providers), updating the user's password would require a nonce if the user **hasn't recently signed in**. The nonce is sent to the user's email or phone number. A user is deemed recently signed in if the session was created in the last 24 hours.
	*
	* @example Update the user's password with a nonce
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   password: 'new password',
	*   nonce: '123456'
	* })
	* ```
	*/
	async updateUser(attributes, options = {}) {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._updateUser(attributes, options);
		});
		return await this._updateUser(attributes, options);
	}
	async _updateUser(attributes, options = {}) {
		let flowId = null;
		try {
			return await this._useSession(async (result) => {
				const { data: sessionData, error: sessionError } = result;
				if (sessionError) throw sessionError;
				if (!sessionData.session) throw new AuthSessionMissingError();
				const session = sessionData.session;
				let codeChallenge = null;
				let codeChallengeMethod = null;
				if (this.flowType === "pkce" && attributes.email != null) [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
				const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
					headers: this.headers,
					redirectTo: this._maybeAppendFlowIdToRedirect(options === null || options === void 0 ? void 0 : options.emailRedirectTo, flowId),
					body: Object.assign(Object.assign({}, attributes), {
						code_challenge: codeChallenge,
						code_challenge_method: codeChallengeMethod
					}),
					jwt: session.access_token,
					xform: _userResponse
				});
				if (userError) throw userError;
				session.user = data.user;
				await this._saveSession(session);
				await this._notifyAllSubscribers("USER_UPDATED", session);
				return this._returnResult({
					data: { user: session.user },
					error: null
				});
			});
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: { user: null },
				error
			});
			throw error;
		}
	}
	/**
	* Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
	* If the refresh token or access token in the current session is invalid, an error will be thrown.
	* @param currentSession The current session that minimally contains an access token and refresh token.
	*
	* @category Auth
	*
	* @remarks
	* - This method sets the session using an `access_token` and `refresh_token`.
	* - If successful, a `SIGNED_IN` event is emitted.
	*
	* @exampleDescription Set the session
	* Sets the session data from an access_token and refresh_token, then returns an auth response or error.
	*
	* @example Set the session
	* ```js
	*   const { data, error } = await supabase.auth.setSession({
	*     access_token,
	*     refresh_token
	*   })
	* ```
	*
	* @exampleResponse Set the session
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "confirmed_at": "2024-01-01T00:00:00Z",
	*         "last_sign_in_at": "11111111-1111-1111-1111-111111111111",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {
	*           "email": "example@email.com",
	*           "email_verified": false,
	*           "phone_verified": false,
	*           "sub": "11111111-1111-1111-1111-111111111111"
	*         },
	*         "identities": [
	*           {
	*             "identity_id": "2024-01-01T00:00:00Z",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "is_anonymous": false
	*       },
	*       "token_type": "bearer",
	*       "expires_in": 3500,
	*       "expires_at": 1700000000
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*/
	async setSession(currentSession) {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._setSession(currentSession);
		});
		return await this._setSession(currentSession);
	}
	async _setSession(currentSession) {
		try {
			if (!currentSession.access_token || !currentSession.refresh_token) throw new AuthSessionMissingError();
			const timeNow = Date.now() / 1e3;
			let expiresAt = timeNow;
			let hasExpired = true;
			let session = null;
			const { payload } = decodeJWT(currentSession.access_token);
			if (payload.exp) {
				expiresAt = payload.exp;
				hasExpired = expiresAt <= timeNow;
			}
			if (hasExpired) {
				const { data: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
				if (error) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
				if (!refreshedSession) return {
					data: {
						user: null,
						session: null
					},
					error: null
				};
				session = refreshedSession;
			} else {
				const { data, error } = await this._getUser(currentSession.access_token);
				if (error) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
				session = {
					access_token: currentSession.access_token,
					refresh_token: currentSession.refresh_token,
					user: data.user,
					token_type: "bearer",
					expires_in: expiresAt - timeNow,
					expires_at: expiresAt
				};
				await this._saveSession(session);
				await this._notifyAllSubscribers("SIGNED_IN", session);
			}
			return this._returnResult({
				data: {
					user: session.user,
					session
				},
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					session: null,
					user: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Returns a new session, regardless of expiry status.
	* Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
	* If the current session's refresh token is invalid, an error will be thrown.
	* @param currentSession The current session. If passed in, it must contain a refresh token.
	*
	* @category Auth
	*
	* @remarks
	* - This method will refresh and return a new session whether the current one is expired or not.
	*
	* @example Refresh session using the current session
	* ```js
	* const { data, error } = await supabase.auth.refreshSession()
	* const { session, user } = data
	* ```
	*
	* @exampleResponse Refresh session using the current session
	* ```json
	* {
	*   "data": {
	*     "user": {
	*       "id": "11111111-1111-1111-1111-111111111111",
	*       "aud": "authenticated",
	*       "role": "authenticated",
	*       "email": "example@email.com",
	*       "email_confirmed_at": "2024-01-01T00:00:00Z",
	*       "phone": "",
	*       "confirmed_at": "2024-01-01T00:00:00Z",
	*       "last_sign_in_at": "2024-01-01T00:00:00Z",
	*       "app_metadata": {
	*         "provider": "email",
	*         "providers": [
	*           "email"
	*         ]
	*       },
	*       "user_metadata": {
	*         "email": "example@email.com",
	*         "email_verified": false,
	*         "phone_verified": false,
	*         "sub": "11111111-1111-1111-1111-111111111111"
	*       },
	*       "identities": [
	*         {
	*           "identity_id": "22222222-2222-2222-2222-222222222222",
	*           "id": "11111111-1111-1111-1111-111111111111",
	*           "user_id": "11111111-1111-1111-1111-111111111111",
	*           "identity_data": {
	*             "email": "example@email.com",
	*             "email_verified": false,
	*             "phone_verified": false,
	*             "sub": "11111111-1111-1111-1111-111111111111"
	*           },
	*           "provider": "email",
	*           "last_sign_in_at": "2024-01-01T00:00:00Z",
	*           "created_at": "2024-01-01T00:00:00Z",
	*           "updated_at": "2024-01-01T00:00:00Z",
	*           "email": "example@email.com"
	*         }
	*       ],
	*       "created_at": "2024-01-01T00:00:00Z",
	*       "updated_at": "2024-01-01T00:00:00Z",
	*       "is_anonymous": false
	*     },
	*     "session": {
	*       "access_token": "<ACCESS_TOKEN>",
	*       "token_type": "bearer",
	*       "expires_in": 3600,
	*       "expires_at": 1700000000,
	*       "refresh_token": "<REFRESH_TOKEN>",
	*       "user": {
	*         "id": "11111111-1111-1111-1111-111111111111",
	*         "aud": "authenticated",
	*         "role": "authenticated",
	*         "email": "example@email.com",
	*         "email_confirmed_at": "2024-01-01T00:00:00Z",
	*         "phone": "",
	*         "confirmed_at": "2024-01-01T00:00:00Z",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "app_metadata": {
	*           "provider": "email",
	*           "providers": [
	*             "email"
	*           ]
	*         },
	*         "user_metadata": {
	*           "email": "example@email.com",
	*           "email_verified": false,
	*           "phone_verified": false,
	*           "sub": "11111111-1111-1111-1111-111111111111"
	*         },
	*         "identities": [
	*           {
	*             "identity_id": "22222222-2222-2222-2222-222222222222",
	*             "id": "11111111-1111-1111-1111-111111111111",
	*             "user_id": "11111111-1111-1111-1111-111111111111",
	*             "identity_data": {
	*               "email": "example@email.com",
	*               "email_verified": false,
	*               "phone_verified": false,
	*               "sub": "11111111-1111-1111-1111-111111111111"
	*             },
	*             "provider": "email",
	*             "last_sign_in_at": "2024-01-01T00:00:00Z",
	*             "created_at": "2024-01-01T00:00:00Z",
	*             "updated_at": "2024-01-01T00:00:00Z",
	*             "email": "example@email.com"
	*           }
	*         ],
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "is_anonymous": false
	*       }
	*     }
	*   },
	*   "error": null
	* }
	* ```
	*
	* @example Refresh session using a refresh token
	* ```js
	* const { data, error } = await supabase.auth.refreshSession({ refresh_token })
	* const { session, user } = data
	* ```
	*/
	async refreshSession(currentSession) {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._refreshSession(currentSession);
		});
		return await this._refreshSession(currentSession);
	}
	async _refreshSession(currentSession) {
		try {
			return await this._useSession(async (result) => {
				var _a;
				if (!currentSession) {
					const { data, error } = result;
					if (error) throw error;
					currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
				}
				if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) throw new AuthSessionMissingError();
				const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
				if (error) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
				if (!session) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: null
				});
				return this._returnResult({
					data: {
						user: session.user,
						session
					},
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					user: null,
					session: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Gets the session data from a URL string
	*/
	async _getSessionFromURL(params, callbackUrlType) {
		var _a;
		try {
			if (!isBrowser()) throw new AuthImplicitGrantRedirectError("No browser detected.");
			if (params.error || params.error_description || params.error_code) throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
				error: params.error || "unspecified_error",
				code: params.error_code || "unspecified_code"
			});
			switch (callbackUrlType) {
				case "implicit":
					if (this.flowType === "pkce") throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
					break;
				case "pkce": if (this.flowType === "implicit") throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
			}
			if (callbackUrlType === "pkce") {
				this._debug("#_initialize()", "begin", "is PKCE flow", true);
				if (!params.code) throw new AuthPKCEGrantCodeExchangeError("No code detected.");
				const { data, error } = await this._exchangeCodeForSession(params.code, { flowId: params[PKCE_FLOW_ID_PARAM] });
				if (error) throw error;
				const url = new URL(window.location.href);
				url.searchParams.delete("code");
				url.searchParams.delete(PKCE_FLOW_ID_PARAM);
				window.history.replaceState(window.history.state, "", url.toString());
				return {
					data: {
						session: data.session,
						redirectType: (_a = data.redirectType) !== null && _a !== void 0 ? _a : null
					},
					error: null
				};
			}
			const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
			if (!access_token || !expires_in || !refresh_token || !token_type) throw new AuthImplicitGrantRedirectError("No session defined in URL");
			const timeNow = Math.round(Date.now() / 1e3);
			const expiresIn = parseInt(expires_in);
			let expiresAt = timeNow + expiresIn;
			if (expires_at) expiresAt = parseInt(expires_at);
			const actuallyExpiresIn = expiresAt - timeNow;
			if (actuallyExpiresIn * 1e3 <= 3e4) console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
			const issuedAt = expiresAt - expiresIn;
			if (timeNow - issuedAt >= 120) console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt, timeNow);
			else if (timeNow - issuedAt < 0) console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt, timeNow);
			const { data, error } = await this._getUser(access_token);
			if (error) throw error;
			const session = {
				provider_token,
				provider_refresh_token,
				access_token,
				expires_in: expiresIn,
				expires_at: expiresAt,
				refresh_token,
				token_type,
				user: data.user
			};
			window.location.hash = "";
			this._debug("#_getSessionFromURL()", "clearing window.location.hash");
			return this._returnResult({
				data: {
					session,
					redirectType: params.type
				},
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					session: null,
					redirectType: null
				},
				error
			});
			throw error;
		}
	}
	/**
	* Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
	*
	* If `detectSessionInUrl` is a function, it will be called with the URL and params to determine
	* if the URL should be processed as a Supabase auth callback. This allows users to exclude
	* URLs from other OAuth providers (e.g., Facebook Login) that also return access_token in the fragment.
	*/
	_isImplicitGrantCallback(params) {
		if (typeof this.detectSessionInUrl === "function") return this.detectSessionInUrl(new URL(window.location.href), params);
		return Boolean(params.access_token || params.error || params.error_description || params.error_code);
	}
	/**
	* Checks if the current URL and backing storage contain parameters given by a PKCE flow
	*/
	async _isPKCECallback(params) {
		if (!params.code) return false;
		const flowId = validatePKCEFlowId(params[PKCE_FLOW_ID_PARAM]);
		if (flowId && await getItemAsync(this.storage, pkceVerifierSlotKey(this.storageKey, flowId))) return true;
		return !!await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
	}
	/**
	* Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
	*
	* For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
	* There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
	*
	* If using `others` scope, no `SIGNED_OUT` event is fired!
	*
	* **Warning:** the default `scope` is `'global'`. This signs the user out of
	* **every device they are currently signed in on**, not just the current
	* tab/session. If you only want to sign the user out of the current session
	* (the behavior most other auth libraries default to), pass
	* `{ scope: 'local' }` explicitly.
	*
	* @category Auth
	*
	* @remarks
	* - In order to use the `signOut()` method, the user needs to be signed in first.
	* - By default, `signOut()` uses the **global** scope, which signs out the user
	*   on every device they are signed in on (not just the current one). Pass
	*   `{ scope: 'local' }` to only sign out the current session. This is
	*   usually what apps want on a "Sign out" button, especially when users
	*   sign in from multiple devices and do not expect signing out of one to
	*   terminate the others.
	* - Since Supabase Auth uses JWTs for authentication, the access token JWT will be valid until it's expired. When the user signs out, Supabase revokes the refresh token and deletes the JWT from the client-side. This does not revoke the JWT and it will still be valid until it expires.
	*
	* @example Sign out of every device (global – default)
	* ```js
	* const { error } = await supabase.auth.signOut()
	* ```
	*
	* @example Sign out only the current session (recommended for most apps)
	* ```js
	* const { error } = await supabase.auth.signOut({ scope: 'local' })
	* ```
	*
	* @example Sign out of all other sessions, keep the current one
	* ```js
	* const { error } = await supabase.auth.signOut({ scope: 'others' })
	* ```
	*/
	async signOut(options = { scope: "global" }) {
		await this.initializePromise;
		if (this.lock != null) return await this._acquireLock(this.lockAcquireTimeout, async () => {
			return await this._signOut(options);
		});
		return await this._signOut(options);
	}
	async _signOut({ scope } = { scope: "global" }) {
		return await this._useSession(async (result) => {
			var _a;
			const removeCurrentSession = async () => {
				await this._removeSession();
			};
			const { data, error: sessionError } = result;
			if (sessionError && !isAuthSessionMissingError(sessionError)) return this._returnResult({ error: sessionError });
			const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
			if (accessToken) {
				const { error } = await this.admin.signOut(accessToken, scope);
				if (error) {
					if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403) || isAuthSessionMissingError(error))) {
						if (scope !== "others") await removeCurrentSession();
						return this._returnResult({ error });
					}
				}
			}
			if (scope !== "others") await removeCurrentSession();
			return this._returnResult({ error: null });
		});
	}
	/**  *
	* @category Auth
	*
	* @remarks
	* - Subscribes to important events occurring on the user's session.
	* - Use on the frontend/client. It is less useful on the server.
	* - Events are emitted across tabs to keep your application's UI up-to-date. Some events can fire very frequently, based on the number of tabs open. Use a quick and efficient callback function, and defer or debounce as many operations as you can to be performed outside of the callback.
	* - Callbacks can be `async` and can safely call other Supabase auth methods (`getUser`, `setSession`, etc.) from inside the callback.
	* - Keep callbacks quick. Events are awaited in order, so a slow callback delays subsequent events to subscribers in this tab.
	* - Emitted events:
	*   - `INITIAL_SESSION`
	*     - Emitted right after the Supabase client is constructed and the initial session from storage is loaded.
	*   - `SIGNED_IN`
	*     - Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
	*     - Avoid making assumptions as to when this event is fired, this may occur even when the user is already signed in. Instead, check the user object attached to the event to see if a new user has signed in and update your application's UI.
	*     - This event can fire very frequently depending on the number of tabs open in your application.
	*   - `SIGNED_OUT`
	*     - Emitted when the user signs out. This can be after:
	*       - A call to `supabase.auth.signOut()`.
	*       - After the user's session has expired for any reason:
	*         - User has signed out on another device.
	*         - The session has reached its timebox limit or inactivity timeout.
	*         - User has signed in on another device with single session per user enabled.
	*         - Check the [User Sessions](/docs/guides/auth/sessions) docs for more information.
	*     - Use this to clean up any local storage your application has associated with the user.
	*   - `TOKEN_REFRESHED`
	*     - Emitted each time a new access and refresh token are fetched for the signed in user.
	*     - It's best practice and highly recommended to extract the access token (JWT) and store it in memory for further use in your application.
	*       - Avoid frequent calls to `supabase.auth.getSession()` for the same purpose.
	*     - There is a background process that keeps track of when the session should be refreshed so you will always receive valid tokens by listening to this event.
	*     - The frequency of this event is related to the JWT expiry limit configured on your project.
	*   - `USER_UPDATED`
	*     - Emitted each time the `supabase.auth.updateUser()` method finishes successfully. Listen to it to update your application's UI based on new profile information.
	*   - `PASSWORD_RECOVERY`
	*     - Emitted instead of the `SIGNED_IN` event when the user lands on a page that includes a password recovery link in the URL.
	*     - Use it to show a UI to the user where they can [reset their password](/docs/guides/auth/passwords#resetting-a-users-password-forgot-password).
	*
	* @example Listen to auth changes
	* ```js
	* const { data } = supabase.auth.onAuthStateChange((event, session) => {
	*   console.log(event, session)
	*
	*   if (event === 'INITIAL_SESSION') {
	*     // handle initial session
	*   } else if (event === 'SIGNED_IN') {
	*     // handle sign in event
	*   } else if (event === 'SIGNED_OUT') {
	*     // handle sign out event
	*   } else if (event === 'PASSWORD_RECOVERY') {
	*     // handle password recovery event
	*   } else if (event === 'TOKEN_REFRESHED') {
	*     // handle token refreshed event
	*   } else if (event === 'USER_UPDATED') {
	*     // handle user updated event
	*   }
	* })
	*
	* // call unsubscribe to remove the callback
	* data.subscription.unsubscribe()
	* ```
	*
	* @exampleDescription Listen to sign out
	* Make sure you clear out any local data, such as local and session storage, after the client library has detected the user's sign out.
	*
	* @example Listen to sign out
	* ```js
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (event === 'SIGNED_OUT') {
	*     console.log('SIGNED_OUT', session)
	*
	*     // clear local and session storage
	*     [
	*       window.localStorage,
	*       window.sessionStorage,
	*     ].forEach((storage) => {
	*       Object.entries(storage)
	*         .forEach(([key]) => {
	*           storage.removeItem(key)
	*         })
	*     })
	*   }
	* })
	* ```
	*
	* @exampleDescription Store OAuth provider tokens on sign in
	* When using [OAuth (Social Login)](/docs/guides/auth/social-login) you sometimes wish to get access to the provider's access token and refresh token, in order to call provider APIs in the name of the user.
	*
	* For example, if you are using [Sign in with Google](/docs/guides/auth/social-login/auth-google) you may want to use the provider token to call Google APIs on behalf of the user. Supabase Auth does not keep track of the provider access and refresh token, but does return them for you once, immediately after sign in. You can use the `onAuthStateChange` method to listen for the presence of the provider tokens and store them in local storage. You can further send them to your server's APIs for use on the backend.
	*
	* Finally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.
	*
	* @example Store OAuth provider tokens on sign in
	* ```js
	* // Register this immediately after calling createClient!
	* // Because signInWithOAuth causes a redirect, you need to fetch the
	* // provider tokens from the callback.
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (session && session.provider_token) {
	*     window.localStorage.setItem('oauth_provider_token', session.provider_token)
	*   }
	*
	*   if (session && session.provider_refresh_token) {
	*     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
	*   }
	*
	*   if (event === 'SIGNED_OUT') {
	*     window.localStorage.removeItem('oauth_provider_token')
	*     window.localStorage.removeItem('oauth_provider_refresh_token')
	*   }
	* })
	* ```
	*
	* @exampleDescription Use React Context for the User's session
	* Instead of relying on `supabase.auth.getSession()` within your React components, you can use a [React Context](https://react.dev/reference/react/createContext) to store the latest session information from the `onAuthStateChange` callback and access it that way.
	*
	* @example Use React Context for the User's session
	* ```js
	* const SessionContext = React.createContext(null)
	*
	* function main() {
	*   const [session, setSession] = React.useState(null)
	*
	*   React.useEffect(() => {
	*     const {data: { subscription }} = supabase.auth.onAuthStateChange(
	*       (event, session) => {
	*         if (event === 'SIGNED_OUT') {
	*           setSession(null)
	*         } else if (session) {
	*           setSession(session)
	*         }
	*       })
	*
	*     return () => {
	*       subscription.unsubscribe()
	*     }
	*   }, [])
	*
	*   return (
	*     <SessionContext.Provider value={session}>
	*       <App />
	*     </SessionContext.Provider>
	*   )
	* }
	* ```
	*
	* @example Listen to password recovery events
	* ```js
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (event === 'PASSWORD_RECOVERY') {
	*     console.log('PASSWORD_RECOVERY', session)
	*     // show screen to update user's password
	*     showPasswordResetScreen(true)
	*   }
	* })
	* ```
	*
	* @example Listen to sign in
	* ```js
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (event === 'SIGNED_IN') console.log('SIGNED_IN', session)
	* })
	* ```
	*
	* @example Listen to token refresh
	* ```js
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (event === 'TOKEN_REFRESHED') console.log('TOKEN_REFRESHED', session)
	* })
	* ```
	*
	* @example Listen to user updates
	* ```js
	* supabase.auth.onAuthStateChange((event, session) => {
	*   if (event === 'USER_UPDATED') console.log('USER_UPDATED', session)
	* })
	* ```
	*/
	onAuthStateChange(callback) {
		const id = generateCallbackId();
		const subscription = {
			id,
			callback,
			unsubscribe: () => {
				this._debug("#unsubscribe()", "state change callback with id removed", id);
				this.stateChangeEmitters.delete(id);
			}
		};
		this._debug("#onAuthStateChange()", "registered callback with id", id);
		this.stateChangeEmitters.set(id, subscription);
		(async () => {
			await this.initializePromise;
			if (this.lock != null) await this._acquireLock(this.lockAcquireTimeout, async () => {
				this._emitInitialSession(id);
			});
			else await this._emitInitialSession(id);
		})();
		return { data: { subscription } };
	}
	async _emitInitialSession(id) {
		return await this._useSession(async (result) => {
			var _a, _b;
			try {
				const { data: { session }, error } = result;
				if (error) throw error;
				await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
				this._debug("INITIAL_SESSION", "callback id", id, "session", session);
			} catch (err) {
				await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
				this._debug("INITIAL_SESSION", "callback id", id, "error", err);
				if (isAuthSessionMissingError(err) || isAuthRetryableFetchError(err) || isAuthApiError(err) && (err.code === "refresh_token_not_found" || err.code === "refresh_token_already_used" || err.code === "session_expired")) console.warn(err);
				else console.error(err);
			}
		});
	}
	/**
	* Sends a password reset request to an email address. This method supports the PKCE flow.
	*
	* @param email The email address of the user.
	* @param options.redirectTo The URL to send the user to after they click the password reset link.
	* @param options.captchaToken Verification token received when the user completes the captcha on the site.
	*
	* @category Auth
	*
	* @remarks
	* - The password reset flow consist of 2 broad steps: (i) Allow the user to login via the password reset link; (ii) Update the user's password.
	* - The `resetPasswordForEmail()` only sends a password reset link to the user's email.
	* To update the user's password, see [`updateUser()`](/docs/reference/javascript/auth-updateuser).
	* - A `PASSWORD_RECOVERY` event will be emitted when the password recovery link is clicked.
	* You can use [`onAuthStateChange()`](/docs/reference/javascript/auth-onauthstatechange) to listen and invoke a callback function on these events.
	* - When the user clicks the reset link in the email they are redirected back to your application.
	* You can configure the URL that the user is redirected to with the `redirectTo` parameter.
	* See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
	* - After the user has been redirected successfully, prompt them for a new password and call `updateUser()`:
	* ```js
	* const { data, error } = await supabase.auth.updateUser({
	*   password: new_password
	* })
	* ```
	*
	* @example Reset password
	* ```js
	* const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
	*   redirectTo: 'https://example.com/update-password',
	* })
	* ```
	*
	* @exampleResponse Reset password
	* ```json
	* {
	*   data: {}
	*   error: null
	* }
	* ```
	*
	* @example Reset password (React)
	* ```js
	* /**
	*  * Step 1: Send the user an email to get a password reset token.
	*  * This email contains a link which sends the user back to your application.
	*  *\/
	* const { data, error } = await supabase.auth
	*   .resetPasswordForEmail('user@email.com')
	*
	* /**
	*  * Step 2: Once the user is redirected back to your application,
	*  * ask the user to reset their password.
	*  *\/
	*  useEffect(() => {
	*    supabase.auth.onAuthStateChange(async (event, session) => {
	*      if (event == "PASSWORD_RECOVERY") {
	*        const newPassword = prompt("What would you like your new password to be?");
	*        const { data, error } = await supabase.auth
	*          .updateUser({ password: newPassword })
	*
	*        if (data) alert("Password updated successfully!")
	*        if (error) alert("There was an error updating your password.")
	*      }
	*    })
	*  }, [])
	* ```
	*/
	async resetPasswordForEmail(email, options = {}) {
		let codeChallenge = null;
		let codeChallengeMethod = null;
		let flowId = null;
		if (this.flowType === "pkce") [codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod(true);
		try {
			return await _request(this.fetch, "POST", `${this.url}/recover`, {
				body: {
					email,
					code_challenge: codeChallenge,
					code_challenge_method: codeChallengeMethod,
					gotrue_meta_security: { captcha_token: options.captchaToken }
				},
				headers: this.headers,
				redirectTo: this._maybeAppendFlowIdToRedirect(options.redirectTo, flowId)
			});
		} catch (error) {
			await removePKCEVerifier(this.storage, this.storageKey, flowId);
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Gets all the identities linked to a user.
	*
	* @category Auth
	*
	* @remarks
	* - The user needs to be signed in to call `getUserIdentities()`.
	*
	* @example Returns a list of identities linked to the user
	* ```js
	* const { data, error } = await supabase.auth.getUserIdentities()
	* ```
	*
	* @exampleResponse Returns a list of identities linked to the user
	* ```json
	* {
	*   "data": {
	*     "identities": [
	*       {
	*         "identity_id": "22222222-2222-2222-2222-222222222222",
	*         "id": "2024-01-01T00:00:00Z",
	*         "user_id": "2024-01-01T00:00:00Z",
	*         "identity_data": {
	*           "email": "example@email.com",
	*           "email_verified": false,
	*           "phone_verified": false,
	*           "sub": "11111111-1111-1111-1111-111111111111"
	*         },
	*         "provider": "email",
	*         "last_sign_in_at": "2024-01-01T00:00:00Z",
	*         "created_at": "2024-01-01T00:00:00Z",
	*         "updated_at": "2024-01-01T00:00:00Z",
	*         "email": "example@email.com"
	*       }
	*     ]
	*   },
	*   "error": null
	* }
	* ```
	*/
	async getUserIdentities() {
		var _a;
		try {
			const { data, error } = await this.getUser();
			if (error) throw error;
			return this._returnResult({
				data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] },
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**  *
	* @category Auth
	*
	* @remarks
	* - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
	* - The user needs to be signed in to call `linkIdentity()`.
	* - If the candidate identity is already linked to the existing user or another user, `linkIdentity()` will fail.
	* - If `linkIdentity` is run in the browser, the user is automatically redirected to the returned URL. On the server, you should handle the redirect.
	*
	* @example Link an identity to a user
	* ```js
	* const { data, error } = await supabase.auth.linkIdentity({
	*   provider: 'github'
	* })
	* ```
	*
	* @exampleResponse Link an identity to a user
	* ```json
	* {
	*   data: {
	*     provider: 'github',
	*     url: <PROVIDER_URL_TO_REDIRECT_TO>,
	*     flowId: <PKCE_FLOW_ID_OR_NULL>
	*   },
	*   error: null
	* }
	* ```
	*/
	async linkIdentity(credentials) {
		if ("token" in credentials) return this.linkIdentityIdToken(credentials);
		return this.linkIdentityOAuth(credentials);
	}
	async linkIdentityOAuth(credentials) {
		var _a;
		let flowId = null;
		try {
			const { data, error } = await this._useSession(async (result) => {
				var _a, _b, _c, _d, _f;
				const { data, error } = result;
				if (error) throw error;
				const { url, flowId: urlFlowId } = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
					redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
					scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
					queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
					skipBrowserRedirect: true
				});
				flowId = urlFlowId;
				return await _request(this.fetch, "GET", url, {
					headers: this.headers,
					jwt: (_f = (_d = data.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _f !== void 0 ? _f : void 0
				});
			});
			if (error) throw error;
			if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) window.location.assign(data === null || data === void 0 ? void 0 : data.url);
			return this._returnResult({
				data: {
					provider: credentials.provider,
					url: data === null || data === void 0 ? void 0 : data.url,
					flowId
				},
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: {
					provider: credentials.provider,
					url: null,
					flowId
				},
				error
			});
			throw error;
		}
	}
	async linkIdentityIdToken(credentials) {
		return await this._useSession(async (result) => {
			var _a;
			try {
				const { error: sessionError, data: { session } } = result;
				if (sessionError) throw sessionError;
				const { options, provider, token, access_token, nonce } = credentials;
				const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
					headers: this.headers,
					jwt: (_a = session === null || session === void 0 ? void 0 : session.access_token) !== null && _a !== void 0 ? _a : void 0,
					body: {
						provider,
						id_token: token,
						access_token,
						nonce,
						link_identity: true,
						gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
					},
					xform: _sessionResponse
				});
				if (error) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
				else if (!data || !data.session || !data.user) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error: new AuthInvalidTokenResponseError()
				});
				if (data.session) {
					await this._saveSession(data.session);
					await this._notifyAllSubscribers("USER_UPDATED", data.session);
				}
				return this._returnResult({
					data,
					error
				});
			} catch (error) {
				await removePKCEVerifier(this.storage, this.storageKey, null);
				if (isAuthError(error)) return this._returnResult({
					data: {
						user: null,
						session: null
					},
					error
				});
				throw error;
			}
		});
	}
	/**
	* Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
	*
	* @category Auth
	*
	* @remarks
	* - The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
	* - The user needs to be signed in to call `unlinkIdentity()`.
	* - The user must have at least 2 identities in order to unlink an identity.
	* - The identity to be unlinked must belong to the user.
	*
	* @example Unlink an identity
	* ```js
	* // retrieve all identities linked to a user
	* const identities = await supabase.auth.getUserIdentities()
	*
	* // find the google identity
	* const googleIdentity = identities.find(
	*   identity => identity.provider === 'google'
	* )
	*
	* // unlink the google identity
	* const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
	* ```
	*/
	async unlinkIdentity(identity) {
		try {
			return await this._useSession(async (result) => {
				var _a, _b;
				const { data, error } = result;
				if (error) throw error;
				return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
					headers: this.headers,
					jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Generates a new JWT.
	* @param refreshToken A valid refresh token that was returned on login.
	*/
	async _refreshAccessToken(refreshToken) {
		const debugName = `#_refreshAccessToken()`;
		this._debug(debugName, "begin");
		try {
			const startedAt = Date.now();
			return await retryable(async (attempt) => {
				if (attempt > 0) await sleep(200 * Math.pow(2, attempt - 1));
				this._debug(debugName, "refreshing attempt", attempt);
				return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
					body: { refresh_token: refreshToken },
					headers: this.headers,
					xform: _sessionResponse
				});
			}, (attempt, error) => {
				const nextBackOffInterval = 200 * Math.pow(2, attempt);
				return error && isAuthRetryableFetchError(error) && Date.now() + nextBackOffInterval - startedAt < 3e4;
			});
		} catch (error) {
			this._debug(debugName, "error", error);
			if (isAuthError(error)) return this._returnResult({
				data: {
					session: null,
					user: null
				},
				error
			});
			throw error;
		} finally {
			this._debug(debugName, "end");
		}
	}
	_isValidSession(maybeSession) {
		return typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
	}
	async _handleProviderSignIn(provider, options) {
		const { url, flowId } = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
			redirectTo: options.redirectTo,
			scopes: options.scopes,
			queryParams: options.queryParams
		});
		this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
		if (isBrowser() && !options.skipBrowserRedirect) window.location.assign(url);
		return {
			data: {
				provider,
				url,
				flowId
			},
			error: null
		};
	}
	/**
	* Recovers the session from LocalStorage and refreshes the token
	* Note: this method is async to accommodate for AsyncStorage e.g. in React native.
	*/
	async _recoverAndRefresh() {
		var _a, _b;
		const debugName = "#_recoverAndRefresh()";
		this._debug(debugName, "begin");
		try {
			const currentSession = await getItemAsync(this.storage, this.storageKey);
			if (currentSession && this.userStorage) {
				let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
				if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
					maybeUser = { user: currentSession.user };
					await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
				}
				currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
			} else if (currentSession && !currentSession.user) {
				if (!currentSession.user) {
					const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
					if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
						currentSession.user = separateUser.user;
						await removeItemAsync(this.storage, this.storageKey + "-user");
						await setItemAsync(this.storage, this.storageKey, currentSession);
					} else currentSession.user = userNotAvailableProxy();
				}
			}
			this._debug(debugName, "session from storage", currentSession);
			if (!this._isValidSession(currentSession)) {
				this._debug(debugName, "session is not valid");
				if (currentSession !== null) await this._removeSession();
				return;
			}
			const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
			this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
			if (expiresWithMargin) {
				if (this.autoRefreshToken && currentSession.refresh_token) {
					const { error } = await this._callRefreshToken(currentSession.refresh_token);
					if (error) {
						if (isAuthRefreshDiscardedError(error)) this._debug(debugName, "refresh discarded by commit guard", error);
						else this._debug(debugName, "refresh failed", error);
					}
				}
			} else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) try {
				const { data, error: userError } = await this._getUser(currentSession.access_token);
				if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
					currentSession.user = data.user;
					await this._saveSession(currentSession);
					await this._notifyAllSubscribers("SIGNED_IN", currentSession);
				} else this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
			} catch (getUserError) {
				console.error("Error getting user data:", getUserError);
				this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
			}
			else await this._notifyAllSubscribers("SIGNED_IN", currentSession);
		} catch (err) {
			this._debug(debugName, "error", err);
			if (isAuthRetryableFetchError(err)) console.warn(err);
			else console.error(err);
			return;
		} finally {
			this._debug(debugName, "end");
		}
	}
	async _callRefreshToken(refreshToken) {
		var _a, _b;
		if (!refreshToken) throw new AuthSessionMissingError();
		if (this.refreshingDeferred) return this.refreshingDeferred.promise;
		if (this.lastRefreshFailure && this.lastRefreshFailure.refreshToken === refreshToken && Date.now() < this.lastRefreshFailure.expiresAt) {
			this._debug("#_callRefreshToken()", "returning cached failure (cooldown active)");
			return this.lastRefreshFailure.result;
		}
		const debugName = `#_callRefreshToken()`;
		this._debug(debugName, "begin");
		try {
			this.refreshingDeferred = new Deferred();
			this.refreshingDeferred.promise.then(void 0, () => {});
			const storedAtStart = await getItemAsync(this.storage, this.storageKey);
			const { data, error } = await this._refreshAccessToken(refreshToken);
			if (error) throw error;
			if (!data.session) throw new AuthSessionMissingError();
			const storedAfter = await getItemAsync(this.storage, this.storageKey);
			if (storedAtStart !== null && (storedAfter === null || storedAfter.refresh_token !== storedAtStart.refresh_token)) {
				this._debug(debugName, "commit guard: storage changed since refresh started, discarding rotated tokens", {
					startedWith: "present",
					nowHolds: storedAfter ? "replaced" : "cleared"
				});
				const discarded = {
					data: null,
					error: new AuthRefreshDiscardedError()
				};
				this.refreshingDeferred.resolve(discarded);
				return discarded;
			}
			const epochBeforeSave = this._sessionRemovalEpoch;
			await this._saveSession(data.session);
			if (this._sessionRemovalEpoch !== epochBeforeSave) {
				this._debug(debugName, "commit guard (post-save): _removeSession ran during _saveSession, undoing write");
				await removeItemAsync(this.storage, this.storageKey);
				if (this.userStorage) await removeItemAsync(this.userStorage, this.storageKey + "-user");
				const discarded = {
					data: null,
					error: new AuthRefreshDiscardedError()
				};
				this.refreshingDeferred.resolve(discarded);
				return discarded;
			}
			await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
			const result = {
				data: data.session,
				error: null
			};
			this.lastRefreshFailure = null;
			this.refreshingDeferred.resolve(result);
			return result;
		} catch (error) {
			this._debug(debugName, "error", error);
			if (isAuthError(error)) {
				const result = {
					data: null,
					error
				};
				if (!isAuthRetryableFetchError(error)) {
					const storedNow = await getItemAsync(this.storage, this.storageKey);
					if (!!((storedNow === null || storedNow === void 0 ? void 0 : storedNow.expires_at) && storedNow.expires_at * 1e3 > Date.now())) this._debug(debugName, "proactive refresh failed, access token still valid — preserving session");
					else await this._removeSession();
				}
				this.lastRefreshFailure = {
					refreshToken,
					result,
					expiresAt: Date.now() + REFRESH_FAILURE_COOLDOWN_MS
				};
				(_a = this.refreshingDeferred) === null || _a === void 0 || _a.resolve(result);
				return result;
			}
			(_b = this.refreshingDeferred) === null || _b === void 0 || _b.reject(error);
			throw error;
		} finally {
			this.refreshingDeferred = null;
			this._debug(debugName, "end");
		}
	}
	async _notifyAllSubscribers(event, session, broadcast = true) {
		if (this._pendingInitNotifications !== null && broadcast) {
			this._pendingInitNotifications.push({
				event,
				session,
				broadcast
			});
			return;
		}
		const debugName = `#_notifyAllSubscribers(${event})`;
		this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
		try {
			if (this.broadcastChannel && broadcast) this.broadcastChannel.postMessage({
				event,
				session
			});
			const errors = [];
			const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
				try {
					await x.callback(event, session);
				} catch (e) {
					errors.push(e);
				}
			});
			await Promise.all(promises);
			if (errors.length > 0) {
				for (let i = 0; i < errors.length; i += 1) console.error(errors[i]);
				throw errors[0];
			}
		} finally {
			this._debug(debugName, "end");
		}
	}
	/**
	* set currentSession and currentUser
	* process to _startAutoRefreshToken if possible
	*/
	async _saveSession(session) {
		this._debug("#_saveSession()", session);
		this.suppressGetSessionWarning = true;
		const sessionToProcess = Object.assign({}, session);
		const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
		if (this.userStorage) {
			if (!userIsProxy && sessionToProcess.user) await setItemAsync(this.userStorage, this.storageKey + "-user", { user: sessionToProcess.user });
			else if (userIsProxy) {}
			const mainSessionData = Object.assign({}, sessionToProcess);
			delete mainSessionData.user;
			const clonedMainSessionData = deepClone(mainSessionData);
			await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
		} else {
			const clonedSession = deepClone(sessionToProcess);
			await setItemAsync(this.storage, this.storageKey, clonedSession);
		}
	}
	async _removeSession() {
		this._sessionRemovalEpoch += 1;
		this._debug("#_removeSession()");
		this.lastRefreshFailure = null;
		this.suppressGetSessionWarning = false;
		await removeItemAsync(this.storage, this.storageKey);
		await removeAllPKCEVerifiers(this.storage, this.storageKey);
		await removeItemAsync(this.storage, this.storageKey + "-user");
		if (this.userStorage) await removeItemAsync(this.userStorage, this.storageKey + "-user");
		await this._notifyAllSubscribers("SIGNED_OUT", null);
	}
	/**
	* Removes any registered visibilitychange callback.
	*
	* {@link GoTrueClient.startAutoRefresh}
	* {@link GoTrueClient.stopAutoRefresh}
	*/
	_removeVisibilityChangedCallback() {
		this._debug("#_removeVisibilityChangedCallback()");
		const callback = this.visibilityChangedCallback;
		this.visibilityChangedCallback = null;
		try {
			if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) window.removeEventListener("visibilitychange", callback);
		} catch (e) {
			console.error("removing visibilitychange callback failed", e);
		}
	}
	/**
	* This is the private implementation of {@link GoTrueClient.startAutoRefresh}. Use this
	* within the library.
	*/
	async _startAutoRefresh() {
		await this._stopAutoRefresh();
		this._debug("#_startAutoRefresh()");
		const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
		this.autoRefreshTicker = ticker;
		if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") ticker.unref();
		else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") Deno.unrefTimer(ticker);
		const timeout = setTimeout(async () => {
			await this.initializePromise;
			await this._autoRefreshTokenTick();
		}, 0);
		this.autoRefreshTickTimeout = timeout;
		if (timeout && typeof timeout === "object" && typeof timeout.unref === "function") timeout.unref();
		else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") Deno.unrefTimer(timeout);
	}
	/**
	* This is the private implementation of {@link GoTrueClient.stopAutoRefresh}. Use this
	* within the library.
	*/
	async _stopAutoRefresh() {
		this._debug("#_stopAutoRefresh()");
		const ticker = this.autoRefreshTicker;
		this.autoRefreshTicker = null;
		if (ticker) clearInterval(ticker);
		const timeout = this.autoRefreshTickTimeout;
		this.autoRefreshTickTimeout = null;
		if (timeout) clearTimeout(timeout);
	}
	/**
	* Starts an auto-refresh process in the background. The session is checked
	* every few seconds. Close to the time of expiration a process is started to
	* refresh the session. If refreshing fails it will be retried for as long as
	* necessary.
	*
	* If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
	* to call this function, it will be called for you.
	*
	* On browsers the refresh process works only when the tab/window is in the
	* foreground to conserve resources as well as prevent race conditions and
	* flooding auth with requests. If you call this method any managed
	* visibility change callback will be removed and you must manage visibility
	* changes on your own.
	*
	* On non-browser platforms the refresh process works *continuously* in the
	* background, which may not be desirable. You should hook into your
	* platform's foreground indication mechanism and call these methods
	* appropriately to conserve resources.
	*
	* {@link GoTrueClient.stopAutoRefresh}
	*
	* @category Auth
	*
	* @remarks
	* - Only useful in non-browser environments such as React Native or Electron.
	* - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
	* - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
	* - To give this hint to the application, you should be calling this method when the app is in focus and calling `supabase.auth.stopAutoRefresh()` when it's out of focus.
	*
	* @example Start and stop auto refresh in React Native
	* ```js
	* import { AppState } from 'react-native'
	*
	* // make sure you register this only once!
	* AppState.addEventListener('change', (state) => {
	*   if (state === 'active') {
	*     supabase.auth.startAutoRefresh()
	*   } else {
	*     supabase.auth.stopAutoRefresh()
	*   }
	* })
	* ```
	*/
	async startAutoRefresh() {
		this._removeVisibilityChangedCallback();
		await this._startAutoRefresh();
	}
	/**
	* Stops an active auto refresh process running in the background (if any).
	*
	* If you call this method any managed visibility change callback will be
	* removed and you must manage visibility changes on your own.
	*
	* See {@link GoTrueClient.startAutoRefresh} for more details.
	*
	* @category Auth
	*
	* @remarks
	* - Only useful in non-browser environments such as React Native or Electron.
	* - The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
	* - On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.
	* - When your application goes in the background or out of focus, call this method to stop the proactive refreshing of the session.
	*
	* @example Start and stop auto refresh in React Native
	* ```js
	* import { AppState } from 'react-native'
	*
	* // make sure you register this only once!
	* AppState.addEventListener('change', (state) => {
	*   if (state === 'active') {
	*     supabase.auth.startAutoRefresh()
	*   } else {
	*     supabase.auth.stopAutoRefresh()
	*   }
	* })
	* ```
	*/
	async stopAutoRefresh() {
		this._removeVisibilityChangedCallback();
		await this._stopAutoRefresh();
	}
	/**
	* Tears down the client's background work: stops the auto-refresh interval,
	* removes the `visibilitychange` listener, closes the cross-tab
	* `BroadcastChannel`, and clears registered `onAuthStateChange` subscribers.
	*
	* Call this from cleanup hooks when the client is being replaced before
	* its JS realm is destroyed. React Strict Mode and HMR are the common
	* cases. Any in-flight `fetch` calls continue to completion and may still
	* write to storage; dispose doesn't abort them or erase storage.
	*
	* Lifecycle caveat: because in-flight refreshes are not aborted, a
	* disposed instance can still persist a rotated session to storage after
	* `dispose()` returns. A subsequent `createClient` against the same
	* `storageKey` will pick up that session on its next read. If you need
	* strict isolation between client lifecycles, await any pending auth
	* operation before calling `dispose()` (or change the `storageKey` for
	* the replacement client).
	*
	* Safe to call repeatedly.
	*
	* @category Auth
	*
	* @example Cleanup on React unmount
	* ```ts
	* useEffect(() => {
	*   const client = createClient(...)
	*   return () => { client.auth.dispose() }
	* }, [])
	* ```
	*/
	async dispose() {
		var _a;
		this._removeVisibilityChangedCallback();
		await this._stopAutoRefresh();
		(_a = this.broadcastChannel) === null || _a === void 0 || _a.close();
		this.broadcastChannel = null;
		this.stateChangeEmitters.clear();
	}
	/**
	* Runs the auto refresh token tick.
	*/
	async _autoRefreshTokenTick() {
		this._debug("#_autoRefreshTokenTick()", "begin");
		if (this.lock != null) {
			try {
				await this._acquireLock(0, async () => {
					try {
						const now = Date.now();
						try {
							return await this._useSession(async (result) => {
								const { data: { session } } = result;
								if (!session || !session.refresh_token || !session.expires_at) {
									this._debug("#_autoRefreshTokenTick()", "no session");
									return;
								}
								const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
								this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is 3 ticks`);
								if (expiresInTicks <= 3) await this._callRefreshToken(session.refresh_token);
							});
						} catch (e) {
							console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
						}
					} finally {
						this._debug("#_autoRefreshTokenTick()", "end");
					}
				});
			} catch (e) {
				if (e instanceof LockAcquireTimeoutError) this._debug("auto refresh token tick lock not available");
				else throw e;
			}
			return;
		}
		if (this.refreshingDeferred !== null) {
			this._debug("#_autoRefreshTokenTick()", "refresh already in flight, skipping");
			return;
		}
		try {
			const now = Date.now();
			try {
				await this._useSession(async (result) => {
					const { data: { session } } = result;
					if (!session || !session.refresh_token || !session.expires_at) {
						this._debug("#_autoRefreshTokenTick()", "no session");
						return;
					}
					const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
					this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is 3 ticks`);
					if (expiresInTicks <= 3) await this._callRefreshToken(session.refresh_token);
				});
			} catch (e) {
				console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
			}
		} finally {
			this._debug("#_autoRefreshTokenTick()", "end");
		}
	}
	/**
	* Registers callbacks on the browser / platform, which in-turn run
	* algorithms when the browser window/tab are in foreground. On non-browser
	* platforms it assumes always foreground.
	*/
	async _handleVisibilityChange() {
		this._debug("#_handleVisibilityChange()");
		if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
			if (this.autoRefreshToken) this.startAutoRefresh();
			return false;
		}
		try {
			this.visibilityChangedCallback = async () => {
				try {
					await this._onVisibilityChanged(false);
				} catch (error) {
					this._debug("#visibilityChangedCallback", "error", error);
				}
			};
			window === null || window === void 0 || window.addEventListener("visibilitychange", this.visibilityChangedCallback);
			await this._onVisibilityChanged(true);
		} catch (error) {
			console.error("_handleVisibilityChange", error);
		}
	}
	/**
	* Callback registered with `window.addEventListener('visibilitychange')`.
	*/
	async _onVisibilityChanged(calledFromInitialize) {
		const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
		this._debug(methodName, "visibilityState", document.visibilityState);
		if (document.visibilityState === "visible") {
			if (this.autoRefreshToken) this._startAutoRefresh();
			if (!calledFromInitialize) {
				await this.initializePromise;
				if (this.lock != null) await this._acquireLock(this.lockAcquireTimeout, async () => {
					if (document.visibilityState !== "visible") {
						this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
						return;
					}
					await this._recoverAndRefresh();
				});
				else {
					if (document.visibilityState !== "visible") {
						this._debug(methodName, "visibilityState is no longer visible, skipping recovery");
						return;
					}
					await this._recoverAndRefresh();
				}
			}
		} else if (document.visibilityState === "hidden") {
			if (this.autoRefreshToken) this._stopAutoRefresh();
		}
	}
	/**
	* Generates the relevant login URL for a third-party provider.
	* @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
	* @param options.scopes A space-separated list of scopes granted to the OAuth application.
	* @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
	*/
	async _getUrlForProvider(url, provider, options) {
		let redirectTo = options === null || options === void 0 ? void 0 : options.redirectTo;
		let codeChallenge = null;
		let codeChallengeMethod = null;
		let flowId = null;
		if (this.flowType === "pkce") {
			[codeChallenge, codeChallengeMethod, flowId] = await this._getCodeChallengeAndMethod();
			redirectTo = this._maybeAppendFlowIdToRedirect(redirectTo, flowId);
		}
		const urlParams = [`provider=${encodeURIComponent(provider)}`];
		if (redirectTo) urlParams.push(`redirect_to=${encodeURIComponent(redirectTo)}`);
		if (options === null || options === void 0 ? void 0 : options.scopes) urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
		if (codeChallenge != null && codeChallengeMethod != null) {
			const flowParams = new URLSearchParams({
				code_challenge: `${encodeURIComponent(codeChallenge)}`,
				code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
			});
			urlParams.push(flowParams.toString());
		}
		if (options === null || options === void 0 ? void 0 : options.queryParams) {
			const query = new URLSearchParams(options.queryParams);
			urlParams.push(query.toString());
		}
		if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
		return {
			url: `${url}?${urlParams.join("&")}`,
			flowId
		};
	}
	/**
	* Appends the reserved flow id parameter to a redirect URL so the callback
	* can be matched to the verifier stored for its flow. Opt-in via
	* `experimental.appendPkceFlowIdToRedirects`: redirect URLs are validated
	* against the project's allow list including the query string, so an extra
	* parameter can stop exact (non-wildcard) entries from matching.
	*/
	_maybeAppendFlowIdToRedirect(redirectTo, flowId) {
		if (!redirectTo || !flowId || !this.experimental.appendPkceFlowIdToRedirects) return redirectTo !== null && redirectTo !== void 0 ? redirectTo : void 0;
		return appendFlowIdToRedirectTo(redirectTo, flowId);
	}
	/**
	* Generates and stores a PKCE challenge/verifier pair for a new flow,
	* logging any pending verifier the bounded slot ring evicts.
	*/
	async _getCodeChallengeAndMethod(isPasswordRecovery = false) {
		return getCodeChallengeAndMethod(this.storage, this.storageKey, isPasswordRecovery, (evictedFlowId) => this._debug("#_getCodeChallengeAndMethod()", "evicted oldest pending PKCE verifier slot", evictedFlowId));
	}
	async _unenroll(params) {
		try {
			return await this._useSession(async (result) => {
				var _a;
				const { data: sessionData, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
					headers: this.headers,
					jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	async _enroll(params) {
		try {
			return await this._useSession(async (result) => {
				var _a, _b;
				const { data: sessionData, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				const body = Object.assign({
					friendly_name: params.friendlyName,
					factor_type: params.factorType
				}, params.factorType === "phone" ? { phone: params.phone } : params.factorType === "totp" ? { issuer: params.issuer } : {});
				const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
					body,
					headers: this.headers,
					jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				if (params.factorType === "totp" && data.type === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
				return this._returnResult({
					data,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	async _verify(params) {
		const run = async () => {
			try {
				return await this._useSession(async (result) => {
					var _a;
					const { data: sessionData, error: sessionError } = result;
					if (sessionError) return this._returnResult({
						data: null,
						error: sessionError
					});
					const body = Object.assign({ challenge_id: params.challengeId }, "webauthn" in params ? { webauthn: Object.assign(Object.assign({}, params.webauthn), { credential_response: params.webauthn.type === "create" ? serializeCredentialCreationResponse(params.webauthn.credential_response) : serializeCredentialRequestResponse(params.webauthn.credential_response) }) } : { code: params.code });
					const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
						body,
						headers: this.headers,
						jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
					});
					if (error) return this._returnResult({
						data: null,
						error
					});
					await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
					await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
					return this._returnResult({
						data,
						error
					});
				});
			} catch (error) {
				if (isAuthError(error)) return this._returnResult({
					data: null,
					error
				});
				throw error;
			}
		};
		if (this.lock != null) return this._acquireLock(this.lockAcquireTimeout, run);
		return run();
	}
	async _challenge(params) {
		const run = async () => {
			try {
				return await this._useSession(async (result) => {
					var _a;
					const { data: sessionData, error: sessionError } = result;
					if (sessionError) return this._returnResult({
						data: null,
						error: sessionError
					});
					const response = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
						body: params,
						headers: this.headers,
						jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
					});
					if (response.error) return response;
					const { data } = response;
					if (data.type !== "webauthn") return {
						data,
						error: null
					};
					switch (data.webauthn.type) {
						case "create": return {
							data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialCreationOptions(data.webauthn.credential_options.publicKey) }) }) }),
							error: null
						};
						case "request": return {
							data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialRequestOptions(data.webauthn.credential_options.publicKey) }) }) }),
							error: null
						};
					}
				});
			} catch (error) {
				if (isAuthError(error)) return this._returnResult({
					data: null,
					error
				});
				throw error;
			}
		};
		if (this.lock != null) return this._acquireLock(this.lockAcquireTimeout, run);
		return run();
	}
	/**
	* {@link GoTrueMFAApi#challengeAndVerify}
	*/
	async _challengeAndVerify(params) {
		const { data: challengeData, error: challengeError } = await this._challenge({ factorId: params.factorId });
		if (challengeError) return this._returnResult({
			data: null,
			error: challengeError
		});
		return await this._verify({
			factorId: params.factorId,
			challengeId: challengeData.id,
			code: params.code
		});
	}
	/**
	* {@link GoTrueMFAApi#listFactors}
	*/
	async _listFactors() {
		var _a;
		const { data: { user }, error: userError } = await this.getUser();
		if (userError) return {
			data: null,
			error: userError
		};
		const data = {
			all: [],
			phone: [],
			totp: [],
			webauthn: []
		};
		for (const factor of (_a = user === null || user === void 0 ? void 0 : user.factors) !== null && _a !== void 0 ? _a : []) {
			data.all.push(factor);
			if (factor.status === "verified") data[factor.factor_type].push(factor);
		}
		return {
			data,
			error: null
		};
	}
	/**
	* {@link GoTrueMFAApi#getAuthenticatorAssuranceLevel}
	*/
	async _getAuthenticatorAssuranceLevel(jwt) {
		var _a, _b, _c, _d;
		if (jwt) try {
			const { payload } = decodeJWT(jwt);
			let currentLevel = null;
			if (payload.aal) currentLevel = payload.aal;
			let nextLevel = currentLevel;
			const { data: { user }, error: userError } = await this.getUser(jwt);
			if (userError) return this._returnResult({
				data: null,
				error: userError
			});
			if (((_b = (_a = user === null || user === void 0 ? void 0 : user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : []).length > 0) nextLevel = "aal2";
			const currentAuthenticationMethods = payload.amr || [];
			return {
				data: {
					currentLevel,
					nextLevel,
					currentAuthenticationMethods
				},
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
		const { data: { session }, error: sessionError } = await this.getSession();
		if (sessionError) return this._returnResult({
			data: null,
			error: sessionError
		});
		if (!session) return {
			data: {
				currentLevel: null,
				nextLevel: null,
				currentAuthenticationMethods: []
			},
			error: null
		};
		const { payload } = decodeJWT(session.access_token);
		let currentLevel = null;
		if (payload.aal) currentLevel = payload.aal;
		let nextLevel = currentLevel;
		if (((_d = (_c = session.user.factors) === null || _c === void 0 ? void 0 : _c.filter((factor) => factor.status === "verified")) !== null && _d !== void 0 ? _d : []).length > 0) nextLevel = "aal2";
		const currentAuthenticationMethods = payload.amr || [];
		return {
			data: {
				currentLevel,
				nextLevel,
				currentAuthenticationMethods
			},
			error: null
		};
	}
	/**
	* Retrieves details about an OAuth authorization request.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*
	* Returns authorization details including client info, scopes, and user information.
	* If the response includes only a redirect_url field, it means consent was already given - the caller
	* should handle the redirect manually if needed.
	*/
	async _getAuthorizationDetails(authorizationId) {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				return await _request(this.fetch, "GET", `${this.url}/oauth/authorizations/${authorizationId}`, {
					headers: this.headers,
					jwt: session.access_token,
					xform: (data) => ({
						data,
						error: null
					})
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Approves an OAuth authorization request.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*/
	async _approveAuthorization(authorizationId, options) {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
					headers: this.headers,
					jwt: session.access_token,
					body: { action: "approve" },
					xform: (data) => ({
						data,
						error: null
					})
				});
				if (response.data && response.data.redirect_url) {
					if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) window.location.assign(response.data.redirect_url);
				}
				return response;
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Denies an OAuth authorization request.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*/
	async _denyAuthorization(authorizationId, options) {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
					headers: this.headers,
					jwt: session.access_token,
					body: { action: "deny" },
					xform: (data) => ({
						data,
						error: null
					})
				});
				if (response.data && response.data.redirect_url) {
					if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) window.location.assign(response.data.redirect_url);
				}
				return response;
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Lists all OAuth grants that the authenticated user has authorized.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*/
	async _listOAuthGrants() {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				return await _request(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
					headers: this.headers,
					jwt: session.access_token,
					xform: (data) => ({
						data,
						error: null
					})
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Revokes a user's OAuth grant for a specific client.
	* Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
	*/
	async _revokeOAuthGrant(options) {
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				await _request(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
					headers: this.headers,
					jwt: session.access_token,
					query: { client_id: options.clientId },
					noResolveJson: true
				});
				return {
					data: {},
					error: null
				};
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	async fetchJwk(kid, jwks = { keys: [] }) {
		let jwk = jwks.keys.find((key) => key.kid === kid);
		if (jwk) return jwk;
		const now = Date.now();
		jwk = this.jwks.keys.find((key) => key.kid === kid);
		if (jwk && this.jwks_cached_at + 6e5 > now) return jwk;
		const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
		if (error) throw error;
		if (!data.keys || data.keys.length === 0) return null;
		this.jwks = data;
		this.jwks_cached_at = now;
		jwk = data.keys.find((key) => key.kid === kid);
		if (!jwk) return null;
		return jwk;
	}
	/**
	* Extracts the JWT claims present in the access token by first verifying the
	* JWT against the server's JSON Web Key Set endpoint
	* `/.well-known/jwks.json` which is often cached, resulting in significantly
	* faster responses. Prefer this method over {@link GoTrueClient.getUser} which always
	* sends a request to the Auth server for each JWT.
	*
	* If the project is not using an asymmetric JWT signing key (like ECC or
	* RSA) it always sends a request to the Auth server (similar to
	* {@link GoTrueClient.getUser}) to verify the JWT.
	*
	* @param jwt An optional specific JWT you wish to verify, not the one you
	*            can obtain from {@link GoTrueClient.getSession}.
	* @param options Various additional options that allow you to customize the
	*                behavior of this method.
	*
	* @category Auth
	*
	* @remarks
	* - Parses the user's [access token](/docs/guides/auth/sessions#access-token-jwt-claims) as a [JSON Web Token (JWT)](/docs/guides/auth/jwts) and returns its components if valid and not expired.
	* - If your project is using asymmetric JWT signing keys, then the verification is done locally usually without a network request using the [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).
	* - A network request is sent to your project's JWT signing key discovery endpoint `https://project-id.supabase.co/auth/v1/.well-known/jwks.json`, which is cached locally. If your environment is ephemeral, such as a Lambda function that is destroyed after every request, a network request will be sent for each new invocation. Supabase provides a network-edge cache providing fast responses for these situations.
	* - If the user's access token is about to expire when calling this function, the user's session will first be refreshed before validating the JWT.
	* - If your project is using a symmetric secret to sign the JWT, it always sends a request similar to `getUser()` to validate the JWT at the server before returning the decoded token. This is also used if the WebCrypto API is not available in the environment. Make sure you polyfill it in such situations.
	* - The returned claims can be customized per project using the [Custom Access Token Hook](/docs/guides/auth/auth-hooks/custom-access-token-hook).
	*
	* @example Get JWT claims, header and signature
	* ```js
	* const { data, error } = await supabase.auth.getClaims()
	* ```
	*
	* @exampleResponse Get JWT claims, header and signature
	* ```json
	* {
	*   "data": {
	*     "claims": {
	*       "aal": "aal1",
	*       "amr": [{
	*         "method": "email",
	*         "timestamp": 1715766000
	*       }],
	*       "app_metadata": {},
	*       "aud": "authenticated",
	*       "email": "example@email.com",
	*       "exp": 1715769600,
	*       "iat": 1715766000,
	*       "is_anonymous": false,
	*       "iss": "https://project-id.supabase.co/auth/v1",
	*       "phone": "+13334445555",
	*       "role": "authenticated",
	*       "session_id": "11111111-1111-1111-1111-111111111111",
	*       "sub": "11111111-1111-1111-1111-111111111111",
	*       "user_metadata": {}
	*     },
	*     "header": {
	*       "alg": "RS256",
	*       "typ": "JWT",
	*       "kid": "11111111-1111-1111-1111-111111111111"
	*     },
	*     "signature": [/** Uint8Array *\/],
	*   },
	*   "error": null
	* }
	* ```
	*/
	async getClaims(jwt, options = {}) {
		try {
			let token = jwt;
			if (!token) {
				const { data, error } = await this.getSession();
				if (error || !data.session) return this._returnResult({
					data: null,
					error
				});
				token = data.session.access_token;
			}
			const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
			if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) try {
				validateExp(payload.exp);
			} catch (e) {
				throw new AuthInvalidJwtError(e instanceof Error ? e.message : "JWT validation failed");
			}
			const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
			if (!signingKey) {
				const { error } = await this.getUser(token);
				if (error) throw error;
				return {
					data: {
						claims: payload,
						header,
						signature
					},
					error: null
				};
			}
			const algorithm = getAlgorithm(header.alg);
			const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, ["verify"]);
			if (!await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`))) throw new AuthInvalidJwtError("Invalid JWT signature");
			return {
				data: {
					claims: payload,
					header,
					signature
				},
				error: null
			};
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Sign in with a passkey. Handles the full WebAuthn ceremony:
	* 1. Fetches authentication challenge from server
	* 2. Prompts user via navigator.credentials.get()
	* 3. Verifies credential with server and creates session
	*
	* Requires `auth.experimental.passkey: true`.
	*
	* @category Auth
	*/
	async signInWithPasskey(credentials) {
		var _a, _b, _c;
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			if (!browserSupportsWebAuthn()) return this._returnResult({
				data: null,
				error: new AuthUnknownError("Browser does not support WebAuthn", null)
			});
			const { data: options, error: optionsError } = await this._startPasskeyAuthentication({ options: { captchaToken: (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.captchaToken } });
			if (optionsError || !options) return this._returnResult({
				data: null,
				error: optionsError
			});
			const { data: credential, error: credentialError } = await getCredential({
				publicKey: deserializeCredentialRequestOptions(options.options),
				signal: (_c = (_b = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _b === void 0 ? void 0 : _b.signal) !== null && _c !== void 0 ? _c : webAuthnAbortService.createNewAbortSignal()
			});
			if (credentialError || !credential) return this._returnResult({
				data: null,
				error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
			});
			const serialized = serializeCredentialRequestResponse(credential);
			return this._verifyPasskeyAuthentication({
				challengeId: options.challenge_id,
				credential: serialized
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Register a passkey for the current authenticated user. Handles the full WebAuthn ceremony:
	* 1. Fetches registration challenge from server
	* 2. Prompts user via navigator.credentials.create()
	* 3. Verifies credential with server
	*
	* Requires an active session. Requires `auth.experimental.passkey: true`.
	*
	* @category Auth
	*/
	async registerPasskey(credentials) {
		var _a, _b;
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			if (!browserSupportsWebAuthn()) return this._returnResult({
				data: null,
				error: new AuthUnknownError("Browser does not support WebAuthn", null)
			});
			const { data: options, error: optionsError } = await this._startPasskeyRegistration();
			if (optionsError || !options) return this._returnResult({
				data: null,
				error: optionsError
			});
			const { data: credential, error: credentialError } = await createCredential({
				publicKey: deserializeCredentialCreationOptions(options.options),
				signal: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.signal) !== null && _b !== void 0 ? _b : webAuthnAbortService.createNewAbortSignal()
			});
			if (credentialError || !credential) return this._returnResult({
				data: null,
				error: credentialError !== null && credentialError !== void 0 ? credentialError : new AuthUnknownError("WebAuthn ceremony failed", null)
			});
			const serialized = serializeCredentialCreationResponse(credential);
			return this._verifyPasskeyRegistration({
				challengeId: options.challenge_id,
				credential: serialized
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Start passkey registration for the current authenticated user.
	* Returns WebAuthn credential creation options to pass to navigator.credentials.create().
	*/
	async _startPasskeyRegistration() {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/options`, {
					headers: this.headers,
					jwt: session.access_token,
					body: {}
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				return this._returnResult({
					data,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Verify passkey registration with the credential response.
	* The credentialResponse should be the serialized output of navigator.credentials.create().
	*/
	async _verifyPasskeyRegistration(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, {
					headers: this.headers,
					jwt: session.access_token,
					body: {
						challenge_id: params.challengeId,
						credential: params.credential
					}
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				return this._returnResult({
					data,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Start passkey authentication.
	* Returns WebAuthn credential request options to pass to navigator.credentials.get().
	*/
	async _startPasskeyAuthentication(params) {
		var _a;
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, {
				headers: this.headers,
				body: { gotrue_meta_security: { captcha_token: (_a = params === null || params === void 0 ? void 0 : params.options) === null || _a === void 0 ? void 0 : _a.captchaToken } }
			});
			if (error) return this._returnResult({
				data: null,
				error
			});
			return this._returnResult({
				data,
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Verify passkey authentication and create a session.
	* The credential should be the serialized output of navigator.credentials.get().
	*/
	async _verifyPasskeyAuthentication(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			const { data, error } = await _request(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, {
				headers: this.headers,
				body: {
					challenge_id: params.challengeId,
					credential: params.credential
				},
				xform: _sessionResponse
			});
			if (error) return this._returnResult({
				data: null,
				error
			});
			if (data.session) {
				await this._saveSession(data.session);
				await this._notifyAllSubscribers("SIGNED_IN", data.session);
			}
			return this._returnResult({
				data,
				error: null
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* List all passkeys for the current user.
	*/
	async _listPasskeys() {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const { data, error } = await _request(this.fetch, "GET", `${this.url}/passkeys`, {
					headers: this.headers,
					jwt: session.access_token,
					xform: (data) => ({
						data,
						error: null
					})
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				return this._returnResult({
					data,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Update a passkey.
	*/
	async _updatePasskey(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const { data, error } = await _request(this.fetch, "PATCH", `${this.url}/passkeys/${params.passkeyId}`, {
					headers: this.headers,
					jwt: session.access_token,
					body: { friendly_name: params.friendlyName }
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				return this._returnResult({
					data,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
	/**
	* Delete a passkey.
	*/
	async _deletePasskey(params) {
		assertPasskeyExperimentalEnabled(this.experimental);
		try {
			return await this._useSession(async (result) => {
				const { data: { session }, error: sessionError } = result;
				if (sessionError) return this._returnResult({
					data: null,
					error: sessionError
				});
				if (!session) return this._returnResult({
					data: null,
					error: new AuthSessionMissingError()
				});
				const { error } = await _request(this.fetch, "DELETE", `${this.url}/passkeys/${params.passkeyId}`, {
					headers: this.headers,
					jwt: session.access_token,
					noResolveJson: true
				});
				if (error) return this._returnResult({
					data: null,
					error
				});
				return this._returnResult({
					data: null,
					error: null
				});
			});
		} catch (error) {
			if (isAuthError(error)) return this._returnResult({
				data: null,
				error
			});
			throw error;
		}
	}
};
GoTrueClient.nextInstanceID = {};
//#endregion
//#region node_modules/@supabase/auth-js/dist/module/AuthClient.js
var AuthClient = GoTrueClient;
//#endregion
export { AuthClient };
