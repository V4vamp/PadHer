import { drizzle } from "drizzle-orm/node-postgres";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Pool } = require("pg");
import * as schema from "./shared/schema";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
