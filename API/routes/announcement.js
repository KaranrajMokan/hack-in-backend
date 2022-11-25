var express = require("express");
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");
var announcementController = require("../controllers/announcementController");

router.post("/update", checkAuth, announcementController.update_announcement);

router.get("/", checkAuth, announcementController.get_details);

module.exports = router;
