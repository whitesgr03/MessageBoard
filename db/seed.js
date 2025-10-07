import pg from "pg";
import debug from "debug";

const databaseLog = debug("PostgreSQL");
const { Client } = pg;

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content VARCHAR ( 100 ) NOT NULL,
  username VARCHAR ( 30 ) NOT NULL,
  created_at timestamptz NOT NULL
);
`;

const query = `INSERT INTO messages (content, username, created_at)
  VALUES ('Hi there!', 'Amando', $1), ('Hello World!', 'Jackson', $1);
`;

databaseLog("Seeding...");
const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  connectionString: process.env.PGURI,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});
await client.connect();
await client.query(SQL);
await client.query(query, [new Date()]);
await client.end();
databaseLog("Seed is completed");
