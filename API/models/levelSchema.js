var mongoose = require("mongoose");

var schema = mongoose.Schema;
var LevelSchema = new schema({
	_id: mongoose.Schema.Types.ObjectId,
	levelId: {
		type: Number,
		required: true,
		unique: true
	},
	levelStatus: {
		type: String,
		default: "closed",
		required: true
	},
	difficulty: {
		type: String,
		required: true
	},
	story: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	rewardPoints: {
		type: Number,
		required: true
	},
	hints: {
		type: [
			{
				hintId: {
					type: Number,
					unique: true,
					required: true
				},
				cost: {
					type: Number,
					required: true
				},
				hintMsg: {
					type: String,
					required: true
				}
			}
		]
	},
	complStuCnt: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Levels", LevelSchema);
