const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createRating,
    updateRating
} = require("../controllers/ratingController");


// ===============================
// SUBMIT RATING
// ===============================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Normal User"),
    createRating
);


// ===============================
// MODIFY RATING
// ===============================

router.put(
    "/:storeId",
    authenticateToken,
    authorizeRoles("Normal User"),
    updateRating
);


module.exports = router;