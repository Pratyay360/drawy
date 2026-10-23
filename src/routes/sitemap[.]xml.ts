import { createFileRoute } from "@tanstack/react-router";
import { docs } from "#/lib/docs";
import { SITE_URL } from "#/lib/site";

const STATIC_PATHS = [
    "/",
    "/about",
    "/help",
    "/changelog",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/docs",
];

export const Route = createFileRoute("/sitemap.xml")({
    server: {
        handlers: {
            GET: () => {
                const urls = [...STATIC_PATHS, ...docs.map((doc) => `/docs/${doc.slug}`)];

                const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/1.0">
${urls
    .map(
        (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`,
    )
    .join("\n")}
</urlset>
`;

                return new Response(body, {
                    headers: { "content-type": "application/xml; charset=utf-8" },
                });
            },
        },
    },
});