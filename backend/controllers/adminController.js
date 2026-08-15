const db = require("../config/database");

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

    const { name, email, password, address, role } = req.body;

    // Required field validation
    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({
            message: "All fields are required"
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

    // Password validation
    // 8-16 characters
    // At least one uppercase letter
    // At least one special character
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
        });
    }

    // Admin is allowed to create Normal Users and Admin Users
    if (
        role !== "Normal User" &&
        role !== "System Administrator"
    ) {
        return res.status(400).json({
            message:
                "Role must be either Normal User or System Administrator"
        });
    }

    // Check if email already exists
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

        // Hash password
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


module.exports = {
    getDashboardStats,
    createUserByAdmin
};