const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getOwnerDashboard
} = require("../controllers/ownerController");


router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("Store Owner"),
    getOwnerDashboard
);


module.exports = router;