var Level = require("../models/levelSchema");
var User = require("../models/userSchema");
var mysql = require("mysql");

exports.level_status = (req, res, next) => {
	const id = req.body.levelId;
	const user_id = req.userData.userId;

	Level.find({ levelId: id })
		.exec()
		.then(doc => {
			if (doc) {
				User.find({ _id: user_id })
					.exec()
					.then(result => {
						var cmp_flag = 0;
						comp_lvls = result[0].completedLevels;

						for (var i = 0; i < comp_lvls.length; i++) {
							if (comp_lvls[i]["levelId"] == id) {
								cmp_flag = 1;
								break;
							}
						}
						if (cmp_flag) usr_lvl_status = "completed";
						else usr_lvl_status = "not completed";
						var temp = {
							status: "Success",
							data: {
								levelStatus: doc[0].levelStatus,
								userLevelStatus: usr_lvl_status
							}
						};
						res.status(200).json(temp);
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Oops... Something went wrong"
						});
					});
			} else {
				res.status(404).json({
					status: "Error",
					message: "No valid entry for this Id"
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

exports.level_status_all = (req, res, next) => {
	const user_id = req.userData.userId;
	Level.find({})
		.select("levelStatus levelId")
		.exec()
		.then(doc => {
			if (doc) {
				User.find({ _id: user_id })
					.exec()
					.then(result => {
						var cmp_flag = 0;
						comp_lvls = result[0]["completedLevels"];
						lvl_sta_lis = [];
						for (var i = 0; i < doc.length; i++) {
							temp_dict = {};
							temp_dict["levelId"] = doc[i].levelId;
							temp_dict["levelStatus"] = doc[i].levelStatus;
							cmp_flag = 0;
							for (var j = 0; j < comp_lvls.length; j++) {
								if (comp_lvls[j].levelId == doc[i].levelId) {
									cmp_flag = 1;
									break;
								}
							}
							if (cmp_flag == 1) {
								temp_dict["userLevelStatus"] = "completed";
							} else {
								temp_dict["userLevelStatus"] = "not completed";
							}
							lvl_sta_lis.push(temp_dict);
						}
						var temp = {
							status: "Success",
							data: lvl_sta_lis,
							currentLevel: result[0].currentLevel
						};

						res.status(200).json(temp);
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Oops... Something went wrong"
						});
					});
			} else {
				res.status(404).json({
					status: "Error",
					message: "No valid entry for this Id"
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

exports.level_detail = (req, res, next) => {
	const id = req.body.levelId;
	Level.find({ levelId: id })
		.select("difficulty story")
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({ status: "Success", data: doc });
			} else {
				res.status(404).json({
					status: "Error",
					message: "No valid entry for this Id"
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

exports.level_completion = (req, res, next) => {
	const id = req.body.levelId;
	const passwrd = req.body.password;
	const user_id = req.userData.userId;
	Level.find({ levelId: id })
		.select("password rewardPoints")
		.exec()
		.then(doc => {
			if (doc[0].password === passwrd) {
				User.find({ _id: user_id })
					.select(
						"currentLevel currentLevelHints type completedLevels"
					)
					.exec()
					.then(ans => {
						var cur_lev = ans[0].currentLevel;
						var cur_lev_hin = ans[0].currentLevelHints;
						var dict = {};

						if (cur_lev < parseInt(id)) {
							res.status(400).json({
								status: "Error",
								message: "Unauthorized entry"
							});
						} else {
							dict["levelId"] = cur_lev;
							dict["hintUsed"] = cur_lev_hin;
							compl_levls = ans[0].completedLevels;
							var flag = 0;
							for (var j = 0; j < compl_levls.length; j++) {
								if (compl_levls[j]["levelId"] == id) {
									flag = 1;
									break;
								}
							}

							
							if (
								flag == 0 &&
								ans[0].type.toLowerCase() == "student"
							) {
								Level.updateOne(
									{ levelId: id },
									{
										$inc: { complStuCnt: 1 }
									}
								)
									.exec()
									.then(reslt => {})
									.catch(err => {
										res.status(500).json({
											status: "Error",
											message:
												"Oops... Something went wrong"
										});
									});
							}

							if (flag == 0) {
								User.update(
									{ _id: user_id },
									{
										$inc: {
											score: doc[0].rewardPoints,
											currentLevel: 1
										},
										$set: { currentLevelHints: [] },
										$push: { completedLevels: dict }
									}
								)

									.exec()
									.then(result => {
										res.status(200).json({
											status: "Success",
											message:
												"Congrats!! You have completed this level"
										});
									})
									.catch(err => {
										res.status(500).json({
											status: "Error",
											message:
												"Oops... Something went wrong"
										});
									});
							} else if (flag == 1) {
								res.status(200).json({
									status: "Success",
									message:
										"You have already completed this level"
								});
							}
							
						}
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Oops... Something went wrong"
						});
					});
			} else if (doc.password != passwrd) {
				res.status(400).json({
					status: "Error",
					message:
						"You entered the wrong password. You cannot proceed."
				});
			} else {
				res.status(404).json({
					status: "Error",
					message: "No valid entry for this Id"
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

/** Endpoint for SQL Injection. */
exports.check_user_password = (req, res, next) => {
	const uname = req.body.uname;
	const password = req.body.password;

	var con = mysql.createConnection({
		host: "localhost",
		user: "hackin",
		password: "hackin",
		database: "hackin"
	});

	con.connect(function(err) {
		if (err) {
			res.status(500).json({
				status: "Error",
				message: "Oops... Something went wrong"
			});
		}
		con.query(
			"SELECT * FROM verify where uname = '" +
				uname +
				"' and password = '" +
				password +
				"';",
			function(err, result, fields) {
				if (err) {
					res.status(500).json({
						status: "Error",
						message: "Oops... Something went wrong"
					});
				}
				if (result.length > 0) {
					res.status(200).json({
						status: "Success",
						message: "Authentication success."
					});
				} else {
					res.status(403).json({
						status: "Error",
						message: "Please try different values."
					});
				}
			}
		);
	});
};