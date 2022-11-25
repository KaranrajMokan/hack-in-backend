var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");
var levelController = require("../controllers/levelController");

router.post("/", checkAuth, levelController.level_status);

router.get("/all", checkAuth, levelController.level_status_all);

router.post("/detail", checkAuth, levelController.level_detail);

router.post("/completion", checkAuth, levelController.level_completion);

router.post("/checkuser", checkAuth, levelController.check_user_password);

//router.post("/final", checkAuth, levelController.botwar);

module.exports = router;
