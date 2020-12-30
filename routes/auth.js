const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();


//Routes and what to happen when hit
router.get("/", authController.getIndex);

router.get("/frontpage", authController.getFront);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;