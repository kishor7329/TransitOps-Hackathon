import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db";

const COOKIE_NAME = "transitops_session";
const DEFAULT_SECRET = "transitops-dev-secret-change-me";

export const rolePermissions: Record<string, string[]> = {
    "Fleet Manager": ["dashboard:read", "fleet:manage", "drivers:read", "maintenance:manage", "analytics:read", "settings:read"],
    Driver: ["dashboard:read", "fleet:read", "trips:manage", "settings:read"],
    "Safety Officer": ["dashboard:read", "drivers:manage", "trips:read", "settings:read"],
    "Financial Analyst": ["dashboard:read", "fleet:read", "fuel-expenses:manage", "analytics:read", "settings:read"],
};

export type RoleName = keyof typeof rolePermissions;

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: RoleName;
    permissions: string[];
};

type UserRow = {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: RoleName;
    is_active: boolean;
};

function authSecret() {
    return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

function toAuthUser(row: Pick<UserRow, "id" | "name" | "email" | "role">): AuthUser {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        permissions: rolePermissions[row.role] ?? [],
    };
}

export async function createUser(input: { name: string; email: string; password: string; role: RoleName }) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const result = await query<UserRow>(
        `insert into users (name, email, password_hash, role_id)
         select $1, $2, $3, id from roles where name = $4
         returning id, name, email, password_hash, $4::text as role, is_active`,
        [input.name, input.email.toLowerCase(), passwordHash, input.role],
    );

    return toAuthUser(result.rows[0]);
}

export async function findUserForLogin(email: string) {
    const result = await query<UserRow>(
        `select users.id, users.name, users.email, users.password_hash, users.is_active, roles.name as role
         from users
         join roles on roles.id = users.role_id
         where lower(users.email) = lower($1)
         limit 1`,
        [email],
    );

    return result.rows[0] ?? null;
}

export async function verifyLoginPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
}

export function signSession(user: AuthUser) {
    return jwt.sign(user, authSecret(), { expiresIn: "8h" });
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        return jwt.verify(token, authSecret()) as AuthUser;
    } catch {
        return null;
    }
}
