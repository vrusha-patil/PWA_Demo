const express = require("express");

const router =express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardStats ,
    createUserByAdmin
} = require("../controllers/adminController");

router.get("/dashboard",authenticateToken,
    authorizeRoles("System Administrator"),
    getDashboardStats);

router.post(
    "/users",
    authenticateToken,
    authorizeRoles("System Administrator"),
    createUserByAdmin
);
module.exports = router;
