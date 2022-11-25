var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");
var userController = require("../controllers/userController");

router.post("/signup", userController.user_signup);

router.post("/signup/alum", userController.user_signup_alumni);

router.post("/login", userController.user_login);

router.get("/", checkAuth, userController.get_one_detail);

router.get("/logout", checkAuth, userController.user_logout);

module.exports = router;
