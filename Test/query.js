var Logger = require("../API/models/loggerSchema");
var User = require("../API/models/userSchema");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

const connection_string = "";
console.log("start");
function CreateDB() {
	mongoose.connect(connection_string, { useNewUrlParser: true });
	mongoose.set("useCreateIndex", true);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	return db;
}
db = CreateDB();
db.once("openUri", function connection() {
	console.log("connected to mongo atlas");
});
console.log("connected");

Logger.find({"log.url":"/api/compile/code"})
	.select("log.body.stdin log.headers.authorization")
	.sort({"updatedTime": -1})
	.exec()
	.then(log => {
		for (var i = 0; i < log.length; i++) {
			var current_log = log[i];
			if (current_log.log.headers.authorization) {
				var token = current_log.log.headers.authorization.split(" ")[1];
				// console.log(jwt.decode(token, "secret"));
				var decoded = jwt.decode(token, "secret");
				if (decoded.email === "usertocheck@gmail.com")
					console.log(decoded.email, current_log.log.body.stdin);
			}
		}
	});


// Logger.find({"log.url":"/api/level/final"})
// .select("log.body.data log.headers.authorization")
// .sort({"updatedTime": -1})
// .exec()
// .then(log => {
// 	for (var i = 0; i < log.length; i++) {
// 		var current_log = log[i];
// 		// console.log(current_log)
// 		var email = null;
// 		if (current_log.log.headers.authorization) {
// 			var token = current_log.log.headers.authorization.split(" ")[1];
// 			var decoded = jwt.decode(token, "secret");
// 			email = decoded.email;
// 			// console.log(decoded)
// 			if (email === "usertocheck@gmail.com") {
// 				let data = current_log.log.body.data;
// 				let buff = new Buffer.from(data, 'base64');
// 				let text = buff.toString('ascii');
// 				console.log(text);
// 				console.log("---------------End of code-------------")
// 			}
// 		}
		
// 		// let data = current_log.log.body.data;
// 		// let buff = new Buffer.from(data, 'base64');
// 		// let text = buff.toString('ascii');
// 		// console.log(email, text);
// 	}
// });


// User.find({"currentLevel":10})
// .select("email name phone")
// .exec()
// .then(log => {
// 	for (var i = 0; i < log.length; i++) {
// 		var current_log = log[i];]
// 	}
// });