import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import debug from "debug";

// routes
import { indexRouter } from "./routes/index.js";
import { messageRouter } from "./routes/message.js";

const app = express();

const serverLog = debug("Server");
const errorLog = debug("HandleErrorRouter");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || "3000";

const viewPath = path.join(__dirname, "views");
const publicPath = path.join(__dirname, "public");
const staticOptions = {
  index: false,
  maxAge: "1d",
  redirect: false,
};

// view engine setup
app.set("views", viewPath);
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath, staticOptions));

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/favicon.ico", (req, res) => res.status(204));
app.use("/", indexRouter);
app.use("/messages", messageRouter);

// Unknown routes handler
app.use((req, res, next) => {
  next(createError(404, "The endpoint you are looking for cannot be found."));
});

// Errors handler
app.use((err, req, res, next) => {
  errorLog(err);

  err.status ?? (err = createError(500));

  res.render("error", {
    message: err.message,
  });
});

const handleListening = async () => {
  const IP_Address = os
    .networkInterfaces()
    .en0.find((internet) => internet.family === "IPv4").address;
  serverLog(`Listening on Local:         http://localhost:${port}`);
  serverLog(`Listening on Your Network:  http://${IP_Address}:${port}`);
};
const handleError = (error) => {
  switch (error.code) {
    case "EACCES":
      serverLog(`Port ${port} requires elevated privileges`);
    case "EADDRINUSE":
      serverLog(`Port ${port} is already in use`);
    default:
      serverLog(error);

      app.close();
      process.exit(1);
  }
};

app
  .listen(port, process.env.NODE_ENV === "development" && handleListening)
  .on("error", handleError);
