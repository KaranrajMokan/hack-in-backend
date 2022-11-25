var User = require("../models/userSchema");
var Anno = require("../models/announcementSchema");

exports.get_details = (req, res, next) => {
	const user_id = req.userData.userId;

	Anno.find({}, { _id: 0, __v: 0 })
		.exec()
		.then(result => {
			var clone = JSON.parse(JSON.stringify(result));

			User.find({ _id: user_id })
				.select("anno")
				.exec()
				.then(doc => {
					response_data = {
						status: "Success",
						data: {
							seen: doc[0]["anno"],
							announcements: clone
						}
					};
					res.send(response_data);
				})
				.catch(error => {
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

exports.update_announcement = (req, res, next) => {
	const id = req.body.annoId;
	const user_id = req.userData.userId;
	User.update({ _id: user_id }, { $set: { anno: id } })
		.exec()
		.then(result => {
			res.status(200).json({
				status: "Success",
				message: ""
			});
		})
		.catch(err => {
			res.status(500).json({
				status: "Error",
				message: "Oops... Something went wrong"
			});
		});
};

/* Deprecated */
function previousAnnouncementGet(req, res, next) {
	const user_id = req.userData.userId;
	User.find({ _id: user_id }, { _id: 0, anno: 1 })
		//.select("anno")
		.exec()
		.then(doc => {
			ann_lis = doc[0].anno;
			ann = [];
			temp = [];
			for (var i = 0; i < ann_lis.length; i++) {
				ann.push(ann_lis[i].annoId);
				temp.push(ann_lis[i]);
			}
			Anno.find({ annoId: { $nin: ann } }, { _id: 0 })
				.exec()
				.then(result => {
					for (var i = 0; i < result.length; i++) {
						temp.push(result[i]);
					}
					User.update({ _id: user_id }, { $set: { anno: temp } })
						//User.update({ _id:user_id},{ $push:{ anno:{$each: result}}})
						.exec()
						.then(answer => {})
						.catch(err => {
							res.status(500).json({
								status: "Error",
								message: "Oops... Something went wrong"
							});
						});
					res.status(200).json({
						status: "Success",
						data: temp
					});
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
}

/** Deprecated */
function previousAnnouncementPost(req, res, next) {
	const id = req.body.annoId;
	const user_id = req.userData.userId;
	User.find({ _id: user_id }, { _id: 0, anno: 1 })
		.exec()
		.then(doc => {
			ann_lis = doc[0].anno;
			temp = [];
			for (var i = 0; i < ann_lis.length; i++) {
				if (ann_lis[i].annoId == id) {
					var t = ann_lis[i];
					t["seen"] = true;
					temp.push(t);
				} else {
					temp.push(ann_lis[i]);
				}
			}
			//User.find({$and: [{ "_id":user_id},{"anno.annoId":id}]},{ $set: { "anno.$.seen": true } })
			User.update({ _id: user_id }, { $set: { anno: temp } })
				.exec()
				.then(result => {
					res.status(200).json({
						status: "Success",
						message: ""
					});
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
}
