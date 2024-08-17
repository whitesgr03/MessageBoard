import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import debug from "debug";

// routes
import indexRouter from "./routes/index.js";
import messageRouter from "./routes/message.js";

const app = express();
const errorLog = debug("HandleErrorRouter");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticOptions = {
	index: false,
	maxAge: "1d",
	redirect: false,
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public"), staticOptions));

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

export default app;
