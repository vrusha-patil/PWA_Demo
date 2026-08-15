const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllStores
} = require("../controllers/storeController");


router.get(
    "/",
    authenticateToken,
    authorizeRoles("Normal User"),
    getAllStores
);


module.exports = router;