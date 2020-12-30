const express = require("express");

const timeController = require("../controllers/time");

const router = express.Router();

//Routes and what to happen when hit
router.get("/api/timer", timeController.getTimeApi);

router.get("/timer", timeController.getTimePage);

module.exports = router;