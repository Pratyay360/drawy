import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

function getServerEnv(key: string): string | undefined {
	const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> })?.env;
	return process.env[key] ?? process.env[`VITE_${key}`] ?? metaEnv?.[key] ?? metaEnv?.[`VITE_${key}`];
}

export function createClient() {
	const url = getServerEnv("SUPABASE_URL");
	const secretKey = getServerEnv("SUPABASE_SECRET_KEY") ?? getServerEnv("SUPABASE_PUBLISHABLE_KEY");
	if (!url || !secretKey) {
		throw new Error(
			"Missing Supabase server env vars: SUPABASE_URL and SUPABASE_SECRET_KEY must be set (check .env / Vercel env).",
		);
	}
	return createServerClient(url, secretKey, {
		cookies: {
			getAll() {
				return Object.entries(getCookies()).map(
					([name, value]) =>
						({
							name,
							value,
						}) satisfies { name: string; value: string },
				);
			},
			setAll(cookies) {
				cookies.map((cookie) => {
					setCookie(cookie.name, cookie.value);
				});
			},
		},
	});
}
