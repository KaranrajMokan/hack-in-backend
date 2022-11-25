var Level = require("../models/levelSchema");
var User = require("../models/userSchema");

exports.hint_details = (req, res, next) => {
	const id = req.body.levelId;
	const user_id = req.userData.userId;
	Level.find({ levelId: id })
		.select("hints")
		.exec()
		.then(result => {
			User.find({ _id: user_id })
				.exec()
				.then(doc => {
					var hint_lis = [];
					var cmpl_flag = 0;
					if (id == doc[0].currentLevel) {
						hint_lis = doc[0].currentLevelHints;
						cmpl_flag = 2;
					} else {
						com_lvls = doc[0].completedLevels;
						for (var i = 0; i < com_lvls.length; i++) {
							if (com_lvls[i].levelId == id) {
								hint_lis = com_lvls[i].hintUsed;
								cmpl_flag = 1;
								break;
							}
						}
					}
					if (cmpl_flag == 1 || cmpl_flag == 2) {
						var max = -1;
						max = Math.max.apply(null, hint_lis);
					}
					if (max == -1 || hint_lis.length == 0) {
						res.status(200).json({
							status: "Success",
							data: []
						});
					} else {
						hints = result[0].hints;
						hint_list = [];
						for (var i = 0; i < hints.length; i++) {
							hint_dict = {};
							if (hints[i]["hintId"] <= max) {
								hint_dict["hintId"] = hints[i]["hintId"];
								hint_dict["hintMsg"] = hints[i]["hintMsg"];
								hint_list.push(hint_dict);
							}
						}
						res.status(200).json({
							status: "Success",
							data: hint_list
						});
					}
				})
				.catch(err => {
					res.status(500).json({
						status: "Error",
						message: "Oops... Something went wrong"
					});
				});
		})
		.catch(err => {
			res.status(500).json({
				status: "Error",
				message: "Oops... Something went wrong"
			});
		});
};

exports.hint_cost = (req, res, next) => {
	const id = req.body.levelId;
	const hint_id = req.body.hintId;
	Level.find({ levelId: id })
		.exec()
		.then(doc => {
			if (typeof doc[0] !== "undefined") {
				hints = doc[0].hints;
				var cost;
				for (var i = 0; i < hints.length; i++) {
					if (hints[i]["hintId"] == hint_id) {
						cost = hints[i]["cost"];
					}
				}
				if (cost) {
					res.status(200).json({
						status: "Success",
						cost: cost
					});
				} else {
					res.status(404).json({
						status: "Error",
						message: "No valid entry for this Id"
					});
				}
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

exports.hint_buy = (req, res, next) => {
	const id = req.body.levelId;
	var hint_id = req.body.hintId;
	const user_id = req.userData.userId;

	Level.find({ levelId: id })
		.exec()
		.then(doc => {
			hints = doc[0].hints;
			var cost;
			hint_flag = 0;
			for (var i = 0; i < hints.length; i++) {
				if (hints[i]["hintId"] == hint_id) {
					var cost = hints[i]["cost"];
					hint_flag = 1;
				}
			}
			if (hint_flag == 0) {
				res.status(200).json({
					status: "Error",
					message: "No valid entry for this hint Id"
				});
			}
			if (cost) {
				User.find({ _id: user_id })
					.exec()
					.then(answer => {
						if (answer[0].currentLevel == id) {
							var is_hint_id = 0;
							cur_hin_lis = answer[0].currentLevelHints;
							for (var i = 0; i < cur_hin_lis.length; i++) {
								if (cur_hin_lis[i] == hint_id) {
									is_hint_id = 1;
									break;
								}
							}
							if (is_hint_id) {
								res.status(200).json({
									status: "Success",
									data: "bought already"
								});
							} else {
								var max = Math.max.apply(null, cur_hin_lis);
								if (cur_hin_lis.length == 0) {
									cur_len = cur_hin_lis.length;
									hint_id = cur_len + 1;
								} else if (hint_id > max + 1) {
									hint_id = cur_hin_lis.length + 1;
								}
								User.update(
									{ _id: user_id },
									{
										$inc: { score: -cost },
										$push: { currentLevelHints: hint_id }
									}
								)
									.exec()
									.then(result => {
										res.status(200).json({
											status: "Success",
											data: "updated"
										});
									})
									.catch(err => {
										res.status(500).json({
											status: "Error",
											message:
												"Oops... Something went wrong"
										});
									});
							}
						} else {
							comp_lvls = answer[0].completedLevels;
							compl_flag = 0;
							for (var j = 0; j < comp_lvls.length; j++) {
								if (comp_lvls[j].levelId == id) {
									compl_flag = 1;
									break;
								}
							}
							if (compl_flag == 0) {
								res.status(200).json({
									status: "Error",
									message: "not possible"
								});
							} else {
								res.status(200).json({
									status: "Error",
									message: "bought already"
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
			} else {
				res.status(200).json({
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
