var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");
var leaderboardController = require("../controllers/leaderboardController");

router.get("/", checkAuth, leaderboardController.get_leaderboard);

module.exports = router;
