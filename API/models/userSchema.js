var mongoose = require("mongoose");

var schema = mongoose.Schema;
var UserSchema = new schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	logincode: {
		type: String,
		required: true
	},
	phone: {
		type: String
	},
	college: {
		type: String
	},
	type: {
		type: String
	},
	course: {
		type: String
	},
	avatar: {
		type: String
	},
	score: {
		type: Number
	},
	currentLevel: {
		type: Number
	},
	currentLevelHints: [Number],
	completedLevels: {
		type: [
			{
				levelId: {
					type: String
				},
				hintUsed: [Number]
			}
		]
	},
	anno: {
		type: Number,
		default: 0
	},
	storySeen: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Users", UserSchema);
