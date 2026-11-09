// Override for staging and preview deployments.
export const SITE_URL = (
    import.meta.env.VITE_SITE_URL ?? "https://drawyparty.pratyay.online"
).replace(/\/$/, "");
