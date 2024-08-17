import pg from "pg";
import debug from "debug";

const databaseLog = debug("PostgreSQL");
const { Pool } = pg;

databaseLog("Connecting PostgreSQL...");
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
pool.on("error", async err => {
	databaseLog(`There has an Error, so the database is closed.`);
	databaseLog("Connect error:");
	databaseLog(err);
	await pool.end();
	process.exit(1);
});
databaseLog("PostgreSQL connect successful");

const initialTables = async () => {
	const checkTable = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name= $1) AS exist;`;
	const tables = {
		messages: `CREATE TABLE messages (
	                	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	                    content VARCHAR ( 100 ) NOT NULL,
	                    username VARCHAR ( 30 ) NOT NULL,
	                    created_at timestamptz NOT NULL
	                );`,
	};
	const populate = {
		messages: {
			text: `INSERT INTO messages (content, username, created_at)
						VALUES
							('Hi there!', 'Amando', $1),
							('Hello World!', 'Jackson', $1)
					;`,
			values: [new Date()],
		},
	};

	databaseLog("Creating tables...");
	await Promise.all(
		Object.keys(tables).map(async name => {
			const { rows } = await pool.query(checkTable, [name]);
			return (
				!rows[0].exist &&
				pool
					.query(tables[name])
					.then(
						async () =>
							await pool.query(
								populate[name].text,
								populate[name].values
							)
					)
			);
		})
	);
	databaseLog("The tables were created.");
};

export { pool, initialTables };
