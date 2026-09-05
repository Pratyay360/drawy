if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { createClient } from "../_libs/@supabase/ssr+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-supabase-DoqNbnQq.js
var adminClient;
function getServerEnv(key) {
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
	return process.env[key] ?? process.env[`VITE_${key}`] ?? metaEnv?.[key] ?? metaEnv?.[`VITE_${key}`];
}
function createSupabaseAdminClient() {
	if (adminClient) return adminClient;
	const url = getServerEnv("SUPABASE_URL");
	const secretKey = getServerEnv("SUPABASE_SECRET_KEY");
	if (!url || !secretKey) throw new Error("Missing Supabase server env vars: SUPABASE_URL and SUPABASE_SECRET_KEY must be set (check .env / Vercel env). Received url=" + String(url));
	adminClient = createClient(url, secretKey, { auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true
	} });
	return adminClient;
}
//#endregion
export { createSupabaseAdminClient };
