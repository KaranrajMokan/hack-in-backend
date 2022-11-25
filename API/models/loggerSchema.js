var mongoose = require("mongoose");

var schema = mongoose.Schema;
var loggerSchema = new schema({
	_id: mongoose.Schema.Types.ObjectId,
	log: {},
	updatedTime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Logger", loggerSchema);
