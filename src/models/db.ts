import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import "dotenv/config";

// You can also use environment variables instead
const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10, // adjust pool size
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: "default" });

// Optional: expose the pool if you need raw queries
export { pool };
