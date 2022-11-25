var User = require("../models/userSchema");
var Level = require("../models/levelSchema");

exports.get_leaderboard = (req, res, next) => {
	var id = req.userData.userId;
	User.find({ _id: id })
		.select("type currentLevel")
		.exec()
		.then(docs => {
			if (docs[0].type.toLowerCase() == "alumni") {
				User.find({ type: "Alumni" })
					.sort({ score: -1 })
					.select("username course score")
					.exec()
					.then(result => {
						result_send = []
						result.map((object, i) => {
							result_send.push({
								name_id: object.username + "-" + object.course, 
								level_pts: object.score
							})
						})

						res.status(200).json({
							status: "Success",
							name: "Name",
							count: "Points",
							data: result_send
						});
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Oops... Something went wrong"
						});
					});
			} else {
				Level.find({})
					.select("levelId complStuCnt")
					.exec()
					.then(result => {

						result_send = []
						result.map((object, i) => {
							result_send.push({
								name_id: "ROOM " + object.levelId, 
								level_pts: object.complStuCnt
							})
						})


						res.status(200).json({
							status: "Success",
							name: "Levels",
							count: "Completion Count",
							data: result_send
						});
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Oops... Something went wrong"
						});
					});
			}
		})
		.catch(err => {
			res.status(500).json({
				status: "Error",
				message: "Oops... Something went wrong"
			});
		});
};
