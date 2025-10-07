import asyncHandler from "express-async-handler";
import { format } from "date-fns";

import { query } from "../db/pool.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM messages");

  const messages = rows.map((message) => ({
    ...message,
    created_at: format(new Date(message.created_at), "MM/dd/yyyy"),
  }));

  res.render("index", {
    messages,
  });
});

export const getMessageForm = async (req, res) => {
  res.render("form");
};

export const createMessage = asyncHandler(async (req, res) => {
  const { content, username } = req.body;

  await query(
    "INSERT INTO messages (content, username, created_at) VALUES ($1, $2, $3)",
    [content, username, new Date()],
  );

  res.redirect("/");
});
