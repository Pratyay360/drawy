import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "#/lib/site";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: () => {
				const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

				return new Response(body, {
					headers: { "content-type": "text/plain; charset=utf-8" },
				});
			},
		},
	},
});
