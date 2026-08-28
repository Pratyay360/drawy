[![Netlify Status](https://api.netlify.com/api/v1/badges/87baadb1-b688-415f-8faf-ee6084958e37/deploy-status)](https://app.netlify.com/projects/drawy-draw/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/pratyay360/drawy)

[use now](https://drawy.pratyay.qzz.io)

## if you want to run it host on your own supabase account, and running on netlify is purely optional, this app is built with [nitro](https://nitro.build/)

## nitro is easy to deploy so no issues [deploy adapter](https://nitro.build/deploy)

## demonstrating crdt (Conflict free Replicated Data Types)

### been using supabase realtime cz it's a nice BaaS with websocket support

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

vite-plus + nub (for dependency management)
