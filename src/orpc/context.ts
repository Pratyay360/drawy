import { os } from "@orpc/server";

import type { CurrentUser } from "#/lib/session";

export interface RouterContext {
	request: Pick<Request, "headers">;
	user?: CurrentUser;
}

export const base = os.$context<RouterContext>();
