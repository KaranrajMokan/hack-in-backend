const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

const userRoutes = require("./API/routes/users");
const levelRoutes = require("./API/routes/level");
const hintRoutes = require("./API/routes/hint");
const leaderboardRoutes = require("./API/routes/leaderboard");
const announcementRoutes = require("./API/routes/announcement");
const compiler = require("./Test/code_compiler/CodeCompiler");
const myLogger = require("./API/models/loggerSchema");

mongoose.Promise = global.Promise;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const connection_string = "";  // Include MongoDB connection string

app.use(logger("dev"));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*

REQUEST LOGGER.

app.use((req, res, next) => {
	var header_data = {'authorization': req.headers.authorization, 'user-agent': req.headers['user-agent'], 'referer': req.headers['referer']}
 	log_data = {'body' : req.body, 'ip':ip, 'headers':header_data, 'url':req.originalUrl, 'method':req.method}
	to_log = {
		_id: new mongoose.Types.ObjectId(),
		log: log_data
	}
	var logger = new myLogger(to_log);
	logger.save()
	next();
});

*/

app.use("/api/user", userRoutes);
app.use("/api/level", levelRoutes);
app.use("/api/hint", hintRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/compile", compiler)

function CreateDB() {
	mongoose.connect(connection_string, { useNewUrlParser: true });
	mongoose.set("useCreateIndex", true);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	return db;
}
db = CreateDB();
db.once("openUri", function connection() {});

app.use((req, res, next) => {
	res.status(404);
	res.json({
		status: "Error",
		error: {
			message: "Content Not Found!"
		}
	});
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		status: "Error",
		error: {
			message: error
		}
	});
});

var server = http.createServer(app);
server.listen(PORT, function() {
	console.log("Server is running on Port", PORT);
});
