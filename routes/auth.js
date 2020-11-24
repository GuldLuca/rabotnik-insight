const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get("/", authController.getIndex);

router.get("/frontpage", authController.getFront);

router.post("/", authController.postLogin);

router.post("/", authController.postSignup);

module.exports = router;