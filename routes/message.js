import express from "express";

import * as messageControllers from "../controllers/messageController.js";

export const messageRouter = express.Router();

messageRouter.get("/", messageControllers.getMessages);

messageRouter
  .route("/create")
  .get(messageControllers.getMessageForm)
  .post(messageControllers.createMessage);
