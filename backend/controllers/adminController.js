const db = require("../config/database");
const bcrypt = require("bcryptjs");


const getDashboardStats = (req,res)=>
{
    const queries ={
        users : "select count(*) as totalUsers from users",
        stores : "select count(*) as totalStores from stores",
        ratings : "select count(*) as totalRatings from ratings"
    };

db.query(queries.users, (err, userResult) => {

        if (err) {
            console.error("Error fetching users count:", err.message);

            return res.status(500).json({
                message: "Failed to fetch total users"
            });
        }

        db.query(queries.stores, (err, storeResult) => {

            if (err) {
                console.error("Error fetching stores count:", err.message);

                return res.status(500).json({
                    message: "Failed to fetch total stores"
                });
            }

            db.query(queries.ratings, (err, ratingResult) => {

                if (err) {
                    console.error("Error fetching ratings count:", err.message);

                    return res.status(500).json({
                        message: "Failed to fetch total ratings"
                    });
                }

                res.status(200).json({
                    totalUsers: userResult[0].totalUsers,
                    totalStores: storeResult[0].totalStores,
                    totalRatings: ratingResult[0].totalRatings
                });
            });
        });
    });
};

const createUserByAdmin = (req, res) => {

    const { name, email, password, address, role } = req.body || {};

   
    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    if (address.length > 400) {
        return res.status(400).json({
            message: "Address cannot exceed 400 characters"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    if (
        role !== "Normal User" &&
        role !== "System Administrator"&&
        role !== "Store Owner"

    ) {
        return res.status(400).json({
            message:
                "Role must be either Normal User or System Administrator, or Store Owner"
        });
    }

    const checkEmailSql =
        "SELECT id FROM users WHERE email = ?";

    db.query(checkEmailSql, [email], (err, result) => {

        if (err) {
            console.error("Email check error:", err.message);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const sql = `
            INSERT INTO users
            (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword, address, role],
            (err, result) => {

                if (err) {
                    console.error(
                        "Create user error:",
                        err.message
                    );

                    return res.status(500).json({
                        message: "Failed to create user"
                    });
                }

                res.status(201).json({
                    message: "User created successfully",
                    userId: result.insertId
                });
            }
        );
    });
};

const createStore = (req, res) => {

    const { ownerId, name, email, address } = req.body || {};

    // Required fields
    if (!ownerId || !name || !email || !address) {
        return res.status(400).json({
            message: "Owner ID, name, email and address are required"
        });
    }

    // Owner ID validation
    if (!Number.isInteger(Number(ownerId))) {
        return res.status(400).json({
            message: "Owner ID must be a valid integer"
        });
    }

    // Name validation: 20-60 characters
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be between 20 and 60 characters"
        });
    }

    // Address validation: maximum 400 characters
    if (address.length > 400) {
        return res.status(400).json({
            message: "Address cannot exceed 400 characters"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    // Check whether owner exists and has Store Owner role
    const ownerSql = `
        SELECT id
        FROM users
        WHERE id = ?
        AND role = 'Store Owner'
    `;

    db.query(ownerSql, [Number(ownerId)], (err, ownerResult) => {

        if (err) {
            console.error("Owner check error:", err.message);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (ownerResult.length === 0) {
            return res.status(404).json({
                message: "Store Owner not found"
            });
        }

        // Check duplicate store email
        const checkEmailSql =
            "SELECT id FROM stores WHERE email = ?";

        db.query(checkEmailSql, [email], (err, result) => {

            if (err) {
                console.error("Email check error:", err.message);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Store email already registered"
                });
            }

            // Create store
            const sql = `
                INSERT INTO stores
                (owner_id, name, email, address, rating)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    Number(ownerId),
                    name,
                    email,
                    address,
                    0.00
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Create store error:",
                            err.message
                        );

                        return res.status(500).json({
                            message: "Failed to create store"
                        });
                    }

                    res.status(201).json({
                        message: "Store created successfully",
                        storeId: result.insertId,
                        ownerId: Number(ownerId)
                    });
                }
            );
        });
    });
};
const getAllStores = (req, res) => {

    const { name, email, address, sortBy, order } = req.query;

    let sql = `
        SELECT
            id,
            owner_id,
            name,
            email,
            address,
            rating
        FROM stores
    `;

    const conditions = [];
    const values = [];

    // Name filter
    if (name) {
        conditions.push("name LIKE ?");
        values.push(`%${name}%`);
    }

    // Email filter
    if (email) {
        conditions.push("email LIKE ?");
        values.push(`%${email}%`);
    }

    // Address filter
    if (address) {
        conditions.push("address LIKE ?");
        values.push(`%${address}%`);
    }

    // WHERE
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Allowed sorting columns
    const allowedSortFields = [
        "id",
        "name",
        "email",
        "address",
        "rating"
    ];

    const selectedSort = allowedSortFields.includes(sortBy)
        ? sortBy
        : "id";

    const selectedOrder =
        order && order.toLowerCase() === "asc"
            ? "ASC"
            : "DESC";

    sql += ` ORDER BY ${selectedSort} ${selectedOrder}`;

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error("Fetch stores error:", err.message);

            return res.status(500).json({
                message: "Failed to fetch stores"
            });
        }

        res.status(200).json({
            stores: results
        });
    });
};

const getAllUsers = (req, res) => {

    const { name, email, address, role, sortBy, order } = req.query;

    let sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
    `;

    const conditions = [];
    const values = [];

    // Name filter
    if (name) {
        conditions.push("name LIKE ?");
        values.push(`%${name}%`);
    }

    // Email filter
    if (email) {
        conditions.push("email LIKE ?");
        values.push(`%${email}%`);
    }

    // Address filter
    if (address) {
        conditions.push("address LIKE ?");
        values.push(`%${address}%`);
    }

    // Role filter
    if (role) {

        const allowedRoles = [
            "Normal User",
            "System Administrator",
            "Store Owner"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        conditions.push("role = ?");
        values.push(role);
    }

    // Add WHERE conditions
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Sorting
    const allowedSortFields = [
        "id",
        "name",
        "email",
        "address",
        "role"
    ];

    const selectedSort = allowedSortFields.includes(sortBy)
        ? sortBy
        : "id";

    const selectedOrder =
        order && order.toLowerCase() === "asc"
            ? "ASC"
            : "DESC";

    sql += ` ORDER BY ${selectedSort} ${selectedOrder}`;

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error("Fetch users error:", err.message);

            return res.status(500).json({
                message: "Failed to fetch users"
            });
        }

        res.status(200).json({
            users: results
        });
    });
};

const getUserById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error("Fetch user error:", err.message);

            return res.status(500).json({
                message: "Failed to fetch user"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: results[0]
        });
    });
};

module.exports = {
    getDashboardStats,
    createUserByAdmin,
    createStore,
    getAllStores,
    getAllUsers,
    getUserById
};