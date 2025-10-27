import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const caPath = join(__dirname, "../../config/us-east-2-bundle.pem");
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: isProduction ? {
    ca: fs.readFileSync(caPath).toString(),
  } : {
    rejectUnauthorized: false,
  },
});
