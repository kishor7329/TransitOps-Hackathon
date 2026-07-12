import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { findUserForLogin, rolePermissions, setSessionCookie, signSession, verifyLoginPassword } from "@/lib/auth";

export async function POST(request: Request) {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid login payload" }, { status: 400 });
    }

    const user = await findUserForLogin(parsed.data.email.toLowerCase());

    if (!user || !user.is_active || !(await verifyLoginPassword(parsed.data.password, user.password_hash))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: rolePermissions[user.role] ?? [],
    };
    const token = signSession(authUser);
    await setSessionCookie(token);

    return NextResponse.json({
        user: authUser,
    });
}
