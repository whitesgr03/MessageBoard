const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	res.render("form");
});

router.post("/", (req, res) => {
	console.log(req.body);
	res.redirect("/new");
});

module.exports = router;
