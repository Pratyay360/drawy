import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

export function createClient() {
    const url = process.env.VITE_SUPABASE_URL!;
    const secretKey = process.env.SUPABASE_SECRET_KEY!;
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