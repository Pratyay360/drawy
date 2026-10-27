/** Room id of the occupancy singleton in the `rooms` party. Kept in its own
 * module so client code can read it without pulling the PartyServer
 * Durable Object classes (and their `cloudflare:workers` import) into the
 * browser bundle. */
export const SINGLETON_ROOM_ID = "index";
