import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

async function loadEnv() {
  for (const file of [".env.local", ".env", join("..", ".env")]) {
    try {
      const envFile = await readFile(join(process.cwd(), file), "utf8");
      for (const line of envFile.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!match) continue;
        const [, key, rawValue] = match;
        process.env[key] ??= rawValue.replace(/^["']|["']$/g, "");
      }
    } catch {
      // Next.js may still provide env vars in deployed environments.
    }
  }
}

await loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

const sql = await readFile(join(process.cwd(), "database", "schema.sql"), "utf8");
const useSsl = process.env.DATABASE_URL.includes("sslmode=require") || !/localhost|127\.0\.0\.1/i.test(process.env.DATABASE_URL);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

try {
  await client.connect();
  await client.query(sql);
  console.log("TransitOps PostgreSQL schema is ready.");
} finally {
  await client.end();
}
