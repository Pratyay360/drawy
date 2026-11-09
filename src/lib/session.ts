import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { normalizeUsername } from "#/lib/username";
import { loadCurrentUser, logoutServer, signInServer, signUpServer } from "./session.server";

export interface CurrentUser {
    username: string;
}

const authInput = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required").max(128, "Password is too long"),
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
    async (): Promise<CurrentUser | null> => loadCurrentUser(),
);

export const signIn = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);
        return signInServer(username, data.password);
    });

export const signUp = createServerFn({ method: "POST" })
    .validator(authInput)
    .handler(async ({ data }) => {
        const username = normalizeUsername(data.username);
        return signUpServer(username, data.password);
    });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
    return logoutServer();
});