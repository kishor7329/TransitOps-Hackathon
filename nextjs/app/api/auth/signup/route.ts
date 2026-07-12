import { NextResponse } from "next/server";
import { createUser, rolePermissions, setSessionCookie, signSession } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";

export async function POST(request: Request) {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid signup payload" }, { status: 400 });
    }

    try {
        const user = await createUser(parsed.data);
        const userWithPermissions = {
            ...user,
            permissions: rolePermissions[user.role] ?? [],
        };
        await setSessionCookie(signSession(userWithPermissions));
        return NextResponse.json({ user: userWithPermissions }, { status: 201 });
    } catch (error) {
        const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
        if (code === "23505") {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        return NextResponse.json({ error: "Database is not ready. Run npm run db:setup and try again." }, { status: 500 });
    }
}
