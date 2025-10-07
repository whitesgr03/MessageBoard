import debug from "debug";
import pg from "pg";

const databaseLog = debug("PostgreSQL");
const { Pool } = pg;

databaseLog("Connecting to database...");
const db = new Pool({
  host: process.env.PGHOST, // Wherever the db is hosted
  port: process.env.PGPORT, // The default port
  database: process.env.PGDATABASE,
  connectionString: process.env.PGURI, // postgresql://<role_name>:<role_password>@localhost:5432/top_users
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
}).on("error", async (err) => {
  databaseLog(`There has an Error, so the database is closed.`);
  databaseLog("Unexpected error on idle client", err);
  await pool.end();
  process.exit(1);
});
databaseLog("Connect to database successful");

export const query = async (sql, values) => {
  const start = Date.now();
  const result = await db.query(sql, values);
  const duration = Date.now() - start;
  databaseLog("executed query", { sql, duration, rows: result.rowCount });
  return result;
};
