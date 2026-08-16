const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createRating,
    updateRating
} = require("../controllers/ratingController");

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Normal User"),
    createRating
);

router.put(
    "/:storeId",
    authenticateToken,
    authorizeRoles("Normal User"),
    updateRating
);


module.exports = router;