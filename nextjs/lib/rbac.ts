import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    return { user, response: null };
}

export async function requirePermission(permission: string) {
    const { user, response } = await requireUser();
    if (!user) return { user: null, response };

    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    const allowed = permissions.includes(permission) || permissions.includes(permission.replace(":read", ":manage"));
    if (!allowed) {
        return { user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { user, response: null };
}
