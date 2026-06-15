const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMidlleware = require("../middlewares/auth.middleware");
// register route on /api/auth/register

router.post("/register", authController.userRegisterController);

// user login route on /api/auth/login

router.post("/login", authController.userLoginController);

// user profile fetch route on /api/auth/profile
router.get("/profile", authMidlleware,authController.fetchUserData)

// user logout route on /api/auth/user-logout
router.post("/user-logout", authMidlleware, authController.userLogoutController);

module.exports = router;