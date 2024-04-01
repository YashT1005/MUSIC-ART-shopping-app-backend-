const express = require("express");
const jwtVerify = require("../middlewares/authMiddleware");
const { postFeedback } = require("../controllers/FeedbackController");

const router = express.Router();

router.route("/feedback").post(jwtVerify, postFeedback);


module.exports = router;