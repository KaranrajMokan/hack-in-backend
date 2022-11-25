var Announcement = require("../API/models/announcementSchema");

var mongoose = require("mongoose");

const connection_string = "";

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

annon = [
	{
		_id: new mongoose.Types.ObjectId(),
		annoId: 1,
		annoMsg: "Welcome to Hackin 2019"
	},
	{
		_id: new mongoose.Types.ObjectId(),
		annoId: 2,
		annoMsg: "msg1"
	},
	{
		_id: new mongoose.Types.ObjectId(),
		annoId: 3,
		annoMsg: "msg2"
	}
];

for (var i = 0; i < annon.length; i++) {
	var announce = new Announcement(annon[i]);
	announce.save();
}
