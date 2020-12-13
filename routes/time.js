const express = require('express');

const timeController = require('../controllers/time');

const router = express.Router();

router.get("/api/timer", timeController.getTime);

router.get("/timer", timeController.getTimePage);

module.exports = router;