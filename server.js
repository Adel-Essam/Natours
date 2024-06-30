const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

const DB = process.env.mongo_url;

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const port = 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
