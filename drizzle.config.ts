import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// export default defineConfig({
//   out: "./migrations",
//   schema: "./shared/schema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });

export default defineConfig({
  schema: './shared/schema.ts',
  dialect: "postgresql",
  out: './drizzle',
  // driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: true,
  },
});
