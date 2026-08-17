import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { normalizeUsername, usernameError } from "#/lib/username";

export interface CurrentUser {
    username: string;
}

const authInput = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
    const { resolveCurrentUserServer } = await import("./session.server");
    return resolveCurrentUserServer();
});

export const signIn = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);
        const invalidUsername = usernameError(username);
        if (invalidUsername) throw new Error(invalidUsername);

        const { signInServer } = await import("./session.server");
        return signInServer(username, data.password);
    });

export const signUp = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);
        const invalidUsername = usernameError(username);
        if (invalidUsername) throw new Error(invalidUsername);

        const { signUpServer } = await import("./session.server");
        return signUpServer(username, data.password);
    });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
    const { logoutServer } = await import("./session.server");
    return logoutServer();
});