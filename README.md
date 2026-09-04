# Introducing Drawy

A real time collaboration capable drawing app(powered by Excalidraw) which is easy to deploy and host
built with tech stack you already know.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPratyay360%2Fdrawy&project-name=drawy&repository-name=drawy)

[use now](https://drawy.pratyay.qzz.io)

## if you want to run it host on your own supabase account, and running on Netlify is purely optional, this app is built with [nitro](https://nitro.build/)

## nitro is easy to deploy so no issues [deploy adapter](https://nitro.build/deploy)

### Supabase realtime because it's a nice BaaS with websocket support + postgres and object storage all in one place and supabase is easy to integrate with Vercel and Netlify

With [Excalidraw canvas](https://npmx.dev/package/@excalidraw/excalidraw) with
[library Suppport](https://libraries.excalidraw.com/?theme=light&sort=default)

Using Supabase for both db and [sync](https://supabase.com/docs/guides/realtime)
and vervcel for hosting. you can use any hosting provider if you want to ...

Host your own version for privacy and owning your own data also relying on the
hosted instance is not recomended cz (I am also on the free tier and can go off anytime on exhausting the limits).

Refer to `.env.example` for the naming conventions of .env also you can use
[mise](https://mise.jdx.dev/) for managing dev enviournment variables ..

tech stack

1. Supabase(db, realtime sync)
2. Tanstack start(frontend)
3. vite-plus + nub (for dependency management)
   (nub cz it's something new )
