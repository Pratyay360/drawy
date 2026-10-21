/**
 * Canonical production URL for the Drawy app.
 *
 * Used by the sitemap, robots.txt and any absolute links. Override via
 * `VITE_SITE_URL` (e.g. in `.env`) for staging/preview deployments.
 */
export const SITE_URL = (
	import.meta.env.VITE_SITE_URL ?? "https://drawy.pratyay.online"
).replace(/\/$/, "");
