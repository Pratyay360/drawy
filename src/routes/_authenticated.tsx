import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "#/lib/session";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async () => {
        const user = await getCurrentUser();
        if (!user) throw redirect({ to: "/login" });
    },
    component: Outlet,
});