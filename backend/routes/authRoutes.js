const express = require("express");
const router = express.Router();


const authenticateToken = require("../middleware/authMiddleware");

const { registerUser,
    loginUser,
    updatePassword
} = require("../controllers/authController");

router.post("/register",registerUser);
router.post("/login",loginUser);

router.put(
    "/password",
    authenticateToken,
    updatePassword
);

module.exports=router;