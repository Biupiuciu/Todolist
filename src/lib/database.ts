import "dotenv/config";
import { Pool } from "pg";
// import { neon } from "@neondatabase/serverless";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});







