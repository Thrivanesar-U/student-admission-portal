import { config } from "dotenv";
import pg from "pg";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

config({
  path: ".env.local",
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined.");
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

try {
  console.log("Starting database migrations...");

  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Database migrations completed successfully.");
} catch (error) {
  console.error("Migration failed:");
  console.error(error);

  process.exitCode = 1;
} finally {
  await pool.end();
}