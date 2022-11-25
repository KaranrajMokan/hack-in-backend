var User = require("../models/userSchema");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var mysql = require('mysql');

exports.user_signup = (req, res) => {
	if (
		req.body.email &&
		req.body.loginCode &&
		req.body.password &&
		req.body.phone &&
		req.body.confPassword
	) {
		if (req.body.password !== req.body.confPassword) {
			return res.status(400).json({
				status: "Error",
				message: "Passwords don't match"
			});
		}

		if (req.body.loginCode === "#30LGN19") {
			res.status(403).json({
				status: "Error",
				message: "Click Alumnus Tab."
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err != null) {
					return res.status(500).json({
						status: "Error",
						message: "Invalid password"
					});
				}

				var user_data_collected = {
					_id: new mongoose.Types.ObjectId(),
					username: req.body.email, // change this
					email: req.body.email,
					password: hash,
					logincode: req.body.loginCode,
					phone: req.body.phone,
					college: "", 
					type: "student", 
					course: "",
					avatar: "",
					score: 0,
					currentLevel: 1,
					userLevelStatus: "not completed"
				}

				// Check MCA API to get Name, college, course. verify email and phone number.

				var user = new User(user_data_collected);
				user.save()
					.then(result => {
						var token = jwt.sign(
							{
								email: user.email,
								username: user.username,
								userId: user._id
							},
							"secret",
							{
								expiresIn: "1h"
							}
						);

						res.status(201).json({
							status: "Success",
							message: "Created user",
							token: token
						});
					})
					.catch(err => {
						res.status(500).json({
							status: "Error",
							message: "Cannot create user. Email already exist"
						});
					});
				
			});
		}
	} else {
		res.status(403).json({
			status: "Error",
			message: "All fields required."
		});
	}
};

exports.user_signup_alumni = (req, res) => {
	if (
		req.body.email &&
		req.body.alumCode &&
		req.body.password &&
		req.body.phone &&
		req.body.confPassword &&
		req.body.rollno &&
		req.body.name
	) {
		if (req.body.password !== req.body.confPassword) {
			return res.status(400).json({
				status: "Error",
				message: "Passwords don't match"
			});
		}

		bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (err != null) {
				return res.status(500).json({
					status: "Error",
					message: "Invalid password"
				});
			}

			var user_data_collected = {
				_id: new mongoose.Types.ObjectId(),
				username: req.body.name, // change this
				email: req.body.email,
				password: hash,
				logincode: req.body.alumCode,
				phone: req.body.phone,
				college: "PSG College of Technology", 
				type: "", // change this
				course: req.body.rollno,
				avatar: "",
				score: 0,
				currentLevel: 1,
				userLevelStatus: "not completed"
			}

			if (req.body.alumCode == '#30LGN19'|| req.body.alumCode == '#30lgn19' || req.body.alumCode == '30LGN19') {
				user_data_collected['type'] = 'Alumni'
			} else if (req.body.alumCode == 'tester3997') {
				user_data_collected['type'] = 'Tester'
			} else {
				return res.status(403).json({
					status: "Error",
					message: "Invalid Alumni Registration Passphrase."
				});
			}

			var user = new User(user_data_collected);

			user.save()
				.then(result => {
					var token = jwt.sign(
						{
							email: user.email,
							username: user.username,
							userId: user._id
						},
						"secret",
						{
							expiresIn: "1h"
						}
					);

					res.status(201).json({
						status: "Success",
						message: "Created user",
						token: token
					});
				})
				.catch(err => {
					res.status(500).json({
						status: "Error",
						message: "Cannot create user. Email already exist"
					});
				});
		});
	} else {
		res.status(403).json({
			status: "Error",
			message: "All fields required."
		});
	}
};

exports.user_login = (req, res, next) => {
	if (req.body.email && req.body.password) {
		User.find({ email: req.body.email })
			.exec()
			.then(user => {
				if (user.length < 1) {
					return res.status(401).json({
						status: "Error",
						message: "Invalid Credentials!"
					});
				}
				bcrypt.compare(
					req.body.password,
					user[0].password,
					(err, result) => {
						if (err) {
							return res.status(401).json({
								status: "Error",
								message: "Invalid Credentials!"
							});
						}
						if (result) {
							var token = jwt.sign(
								{
									email: user[0].email,
									username: user[0].username,
									userId: user[0]._id
								},
								"secret",
								{
									expiresIn: "1h"
								}
							);
							return res.status(200).json({
								status: "Success",
								message: "Auth successful",
								token: token
							});
						}
						res.status(401).json({
							status: "Error",
							message: "Auth failed"
						});
					}
				);
			})
			.catch(err => {
				res.status(500).json({
					status: "Error",
					error: "Auth failed."
				});
			});
	} else {
		return res.status(401).json({
			status: "Error",
			message: "Invalid Credentials!"
		});
	}
};

exports.get_one_detail = (req, res, next) => {
	var id = req.userData.userId;
	User.findById(id)
		.select("username email storySeen currentLevel")
		.exec()
		.then(doc => {
			if (doc) {
				var clone = JSON.parse(JSON.stringify(doc));
				delete clone._id;
				clone["status"] = "Success";
				if (clone.storySeen == false) {
					User.update({ _id: id }, { $set: { storySeen: true } })
						.exec()
						.then(result => {})
						.catch(err => {});
				}
				res.status(200).json(clone);
			} else {
				res.status(404).json({
					status: "Error",
					message: "No data found."
				});
			}
		})
		.catch(err => {
			res.staus(500).json({
				status: "Error",
				error: "No data found."
			});
		});
};

exports.user_logout = (req, res, next) => {
	res.status(200).json({
		status: "Success",
		message: "User Logged out"
	});
};

/* Deprecated */
exports.user_get_all = (req, res, next) => {
	User.find()
		.select("username email password")
		.exec()
		.then(docs => {
			var response = {
				count: docs.length,
				users: docs.map(doc => {
					return {
						username: doc.username,
						password: doc.password,
						email: doc.email,
						_id: doc._id,
						request: {
							type: "GET",
							url: "http://localhost:3000/" + doc._id
						}
					};
				})
			};
			res.status(200).json(response);
		})
		.catch(err => {
			res.status(500).json({
				status: "Error",
				error: err
			});
		});
};

/* Deprecated */
exports.delete_user = (req, res, next) => {
	var id = req.params.userId;
	User.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			res.status(500).json({
				name: "6",
				error: err
			});
		});
};

/* Deprecated */
exports.update_user = (req, res, next) => {
	var id = req.params.userId;
	var updateOps = {};
	for (var ops of Object.keys(req.body)) {
		updateOps[ops] = req.body[ops];
	}
	User.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "updated",
				reslt: result
			});
		})
		.catch(err => {
			res.status(500).json({
				status: "Error",
				error: err
			});
		});
};
