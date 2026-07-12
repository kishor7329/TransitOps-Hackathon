import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const globalForPg = globalThis as unknown as {
    transitOpsPool?: Pool;
};

function loadEnvFromFile(path: string) {
    if (!existsSync(path)) return;

    const envFile = readFileSync(path, "utf8");
    for (const line of envFile.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!match) continue;

        const [, key, rawValue] = match;
        process.env[key] ??= rawValue.replace(/^["']|["']$/g, "");
    }
}

function ensureEnvLoaded() {
    loadEnvFromFile(join(process.cwd(), ".env.local"));
    loadEnvFromFile(join(process.cwd(), ".env"));
    loadEnvFromFile(join(process.cwd(), "..", ".env"));
}

function shouldUseSsl(connectionString: string) {
    if (connectionString.includes("sslmode=disable")) return false;
    if (connectionString.includes("sslmode=require")) return true;
    return !/localhost|127\.0\.0\.1/i.test(connectionString);
}

function getPool() {
    ensureEnvLoaded();

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is missing");
    }

    if (!globalForPg.transitOpsPool) {
        globalForPg.transitOpsPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: shouldUseSsl(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
        });
    }

    return globalForPg.transitOpsPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
    return getPool().query<T>(text, params);
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
    const client = await getPool().connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
