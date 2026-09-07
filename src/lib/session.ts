import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { normalizeUsername } from "#/lib/username";

export interface CurrentUser {
    username: string;
}

const authInput = z.object({
    username: z.string().min(1, "Username is required"),
    password: z
        .string()
        .min(1, "Password must be at least 1 characters")
        .max(128, "Password is too long"),
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
    async (): Promise<CurrentUser | null> => {
        const { resolveCurrentUserServer } = await import("./session.server");
        return resolveCurrentUserServer();
    },
);

export const signIn = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);

        const { signInServer } = await import("./session.server");
        return signInServer(username, data.password);
    });

export const signUp = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);

        const { signUpServer } = await import("./session.server");
        return signUpServer(username, data.password);
    });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
    const { logoutServer } = await import("./session.server");
    return logoutServer();
});