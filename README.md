# Introducing Drawy
A real time collaboration capable drawing app(powered by Excalidraw) which is easy to deploy and host
built with tech stack you already know.


[![Netlify Status](https://api.netlify.com/api/v1/badges/87baadb1-b688-415f-8faf-ee6084958e37/deploy-status)](https://app.netlify.com/projects/drawy-draw/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/pratyay360/drawy)

[use now](https://drawy.pratyay.qzz.io)

## if you want to run it host on your own supabase account, and running on Netlify is purely optional, this app is built with [nitro](https://nitro.build/)

## nitro is easy to deploy so no issues [deploy adapter](https://nitro.build/deploy)

### Supabase realtime because it's a nice BaaS with websocket support + postgres and object storage all in one place and supabase is easy to integrate with Vercel and Netlify.

With [Excalidraw canvas](https://npmx.dev/package/@excalidraw/excalidraw) with
[library Suppport](https://libraries.excalidraw.com/?theme=light&sort=default)

Using Supabase for both db and [sync](https://supabase.com/docs/guides/realtime)
and Netlify for hosting ... you can use any hosting provider if you want to ..

Host your own version for privacy and owning your own data also relying on the hosted instance is not required cz I am also on the free tier.

Refer to `.env.example` for the naming conventions of .env also you can use
[mise](https://mise.jdx.dev/) for managing dev env ..

tech stack 

1. Supabase(db, realtime sync)
2. Tanstack start(frontend)
3. vite-plus + nub (for dependency management)
(nub cz it's something new )
