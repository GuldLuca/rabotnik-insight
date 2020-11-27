const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get("/", authController.getIndex);

router.get("/frontpage", authController.getFront);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

module.exports = router;