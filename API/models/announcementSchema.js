var mongoose = require("mongoose");

var schema = mongoose.Schema;
var announcementSchema = new schema({
	_id: mongoose.Schema.Types.ObjectId,
	annoId: {
		type: Number,
		unique: true
	},
	annoMsg: String,
	updatedTime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Announcement", announcementSchema);
