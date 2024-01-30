const express = require("express");
const router = express.Router();

const messages = [
	{
		text: "Hi there!",
		user: "Amando",
		added: new Date(),
	},
	{
		text: "Hello World!",
		user: "Charles",
		added: new Date(),
	},
];

router.get("/", (req, res) => {
	res.render("index", {
		title: "Mini Messageboard",
		messages: messages,
	});
});

router.post("/new", (req, res) => {
	const { author, message } = req.body;

	const newMessage = {
		text: message,
		user: author,
		added: new Date(),
	};
	messages.push(newMessage);

	res.redirect("/");
});

module.exports = router;
