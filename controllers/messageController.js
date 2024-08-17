import asyncHandler from "express-async-handler";
import { format } from "date-fns";

import { pool as db } from "../config/database.js";

const messageList = asyncHandler(async (req, res) => {
	const query = {
		text: "SELECT * FROM messages",
	};

	const { rows } = await db.query(query);

	const messages = rows.map(message => ({
		...message,
		created_at: format(new Date(message.created_at), "MM/dd/yyyy"),
	}));

	res.render("index", {
		messages,
	});
});

const messageCreateGet = async (req, res) => {
	res.render("form");
};

const messageCreatePost = asyncHandler(async (req, res) => {
	const { content, username } = req.body;

	const query = {
		text: "INSERT INTO messages (content, username, created_at) VALUES ($1, $2, $3)",
		values: [content, username, new Date()],
	};

	await db.query(query);

	res.redirect("/");
});

export { messageList, messageCreateGet, messageCreatePost };
