[![Netlify Status](https://api.netlify.com/api/v1/badges/87baadb1-b688-415f-8faf-ee6084958e37/deploy-status)](https://app.netlify.com/projects/drawy-draw/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/pratyay360/drawy)

# demonstrating crdt (Conflict free Replicated Data Types)

with [excalidraw canvas](https://npmx.dev/package/@excalidraw/excalidraw) with
[library suppport](https://libraries.excalidraw.com/?theme=light&sort=default)

using supabase for both db and [sync](https://supabase.com/docs/guides/realtime)
and netlify for hosting .. you can use any hosting provider if you want to ..

host your own version for privacy ..

refer to .env.example for .. the naming conventions of .env also you can use
[mise](https://mise.jdx.dev/) for managing dev env ..

tech stack ..

supabase(db, crdt sync)

tanstack start(frontend)

nitro as a deployment and backend

vite-plus + nub (for dependency management)
