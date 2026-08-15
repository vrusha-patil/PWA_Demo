const bcrypt = require("bcryptjs");
const db =require("../config/database");

const registerUser =async(req,res)=> {
    try{
        const {name,email,address,password} =req.body || {};

        if(!name || !email || !address || !password )
        {
            return res.status(400).json({
                message : "All Fields are required...."
            });
        }

        if(name.length < 20 || name.length >60)
        {
            return res.status(400).json({
                message : "Name must be between 20-60 characters ....."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
        {
            return res.status(400).json({
                message:"Email is not valid , please enter valid email....."
            })
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({
                message: "Password must be between 8 - 16 characters"
            });
        }

        const uppercaseRegex = /[A-Z]/;

        if (!uppercaseRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter"
            });
        }

        const specialCharacterRegex = /[^A-Za-z0-9]/;

        if (!specialCharacterRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }

    const checkEmailQuery = "SELECT id FROM users WHERE email = ?";

        db.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

    
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

            db.query(
                insertQuery,
                [name, email, hashedPassword, address, "Normal User"],
                (err, result) => {
                    if (err) {
                        console.error("Error creating user:", err);
                        return res.status(500).json({
                            message: "Can't register user"
                        });
                    }

                    return res.status(201).json({
                        message: "User registered successfully....",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error....."
        });
    }
};


const jwt = require("jsonwebtoken");
const loginUser = async(req , res)=> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
}

const query = "SELECT * FROM users WHERE email = ?";

        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error("Login database error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }
if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

return res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updatePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body || {};

        // Required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required"
            });
        }

        // New password length
        if (
            newPassword.length < 8 ||
            newPassword.length > 16
        ) {
            return res.status(400).json({
                message:
                    "Password must be between 8 - 16 characters"
            });
        }

        // Uppercase validation
        const uppercaseRegex = /[A-Z]/;

        if (!uppercaseRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must contain at least one uppercase letter"
            });
        }

        // Special character validation
        const specialCharacterRegex =
            /[^A-Za-z0-9]/;

        if (!specialCharacterRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must contain at least one special character"
            });
        }

        // Get current password from database
        const query = `
            SELECT password
            FROM users
            WHERE id = ?
        `;

        db.query(
            query,
            [userId],
            async (err, results) => {

                if (err) {
                    console.error(
                        "Fetch password error:",
                        err.message
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                const user = results[0];

                // Verify current password
                const passwordMatch =
                    await bcrypt.compare(
                        currentPassword,
                        user.password
                    );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message:
                            "Current password is incorrect"
                    });
                }

                // Prevent using the same password
                const samePassword =
                    await bcrypt.compare(
                        newPassword,
                        user.password
                    );

                if (samePassword) {
                    return res.status(400).json({
                        message:
                            "New password must be different from current password"
                    });
                }

                // Hash new password
                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );

                // Update password
                const updateQuery = `
                    UPDATE users
                    SET password = ?
                    WHERE id = ?
                `;

                db.query(
                    updateQuery,
                    [hashedPassword, userId],
                    (err) => {

                        if (err) {
                            console.error(
                                "Update password error:",
                                err.message
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to update password"
                            });
                        }

                        return res.status(200).json({
                            message:
                                "Password updated successfully"
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "Update password error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {registerUser,
    loginUser,
    updatePassword
};