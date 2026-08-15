const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


const {
    getAllStoresForUser
} = require("../controllers/storeController");

router.get(
    "/user",
    authenticateToken,
    authorizeRoles("Normal User"),
    getAllStoresForUser
);

module.exports = router;