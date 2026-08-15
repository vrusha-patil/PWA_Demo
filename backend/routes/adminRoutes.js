const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    createUserByAdmin,
    createStore,
    getAllStores,
    getAllUsers,
    getUserById
} = require("../controllers/adminController");


router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("System Administrator"),
    getDashboardStats
);


router.post(
    "/users",
    authenticateToken,
    authorizeRoles("System Administrator"),
    createUserByAdmin
);

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("System Administrator"),
    getAllUsers
);


router.get(
    "/users/:id",
    authenticateToken,
    authorizeRoles("System Administrator"),
    getUserById
);


router.post(
    "/stores",
    authenticateToken,
    authorizeRoles("System Administrator"),
    createStore
);

router.get(
    "/stores",
    authenticateToken,
    authorizeRoles("System Administrator"),
    getAllStores
);


module.exports = router;