import db from "./database.js";
import debug from "debug";

const databaseLog = debug("PostgreSQL");

const isTableExist = async name => {
	const SQL = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name= $1) AS exist;`;
	const { rows } = await db.query(SQL, [name]);

	return rows[0].exist;
};

const initialMessages = async () => {
	const SQL = `CREATE TABLE messages (
	                	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	                    content VARCHAR ( 100 ) NOT NULL,
	                    username VARCHAR ( 30 ) NOT NULL,
	                    created_at timestamptz NOT NULL
	                );`;

	const seeding = {
		text: `INSERT INTO messages (content, username, created_at)
						VALUES
							('Hi there!', 'Amando', $1),
							('Hello World!', 'Jackson', $1)
					;`,
		values: [new Date()],
	};
	await db
		.query(SQL)
		.then(async () => await db.query(seeding.text, seeding.values));
};

const handleSeeding = async () => {
	databaseLog("Seeding tables...");
	!(await isTableExist("messages")) && (await initialMessages());

	databaseLog("Seeding tables successfully.");
};

export default handleSeeding;
