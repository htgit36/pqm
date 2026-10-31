import "server-only";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pqmPool?: mysql.Pool };

export const pool =
  globalForDb.pqmPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 5,
    charset: "utf8mb4",
    timezone: "+07:00",
  });

if (process.env.NODE_ENV !== "production") globalForDb.pqmPool = pool;

export const db = drizzle(pool, { schema, mode: "default", casing: "snake_case" });
export { schema };
