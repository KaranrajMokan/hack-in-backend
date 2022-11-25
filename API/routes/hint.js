var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");
var hintController = require("../controllers/hintController");

router.post("/", checkAuth, hintController.hint_details);

router.post("/cost", checkAuth, hintController.hint_cost);

router.post("/buy", checkAuth, hintController.hint_buy);

module.exports = router;
