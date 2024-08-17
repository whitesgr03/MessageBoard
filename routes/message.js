import express from "express";

import * as messageControllers from "../controllers/messageController.js";

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get("/", messageControllers.messageList);

router
	.route("/create")
	.get(messageControllers.messageCreateGet)
	.post(messageControllers.messageCreatePost);

export default router;
