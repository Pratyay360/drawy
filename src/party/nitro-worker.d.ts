/** The Nitro (TanStack Start) server bundle that `bun run build` emits into
 * .output/server. The worker entry imports it so PartyServer can answer
 * /parties/* before the request reaches Nitro. */
declare module "*.output/server/index.mjs" {
    const worker: {
        fetch(request: Request, env: unknown, context: unknown): Promise<Response>;
        scheduled?: (...args: unknown[]) => unknown;
        email?: (...args: unknown[]) => unknown;
        queue?: (...args: unknown[]) => unknown;
        tail?: (...args: unknown[]) => unknown;
        trace?: (...args: unknown[]) => unknown;
    };
    export default worker;
}
