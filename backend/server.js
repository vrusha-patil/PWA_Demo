const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const db = require("./config/database");


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const authenticateToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");



app.use("/api/auth",authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/",(req,res)=>
{
    res.send("Our Store Rating application API is running....");
});

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

app.get(
    "/api/admin-test",
    authenticateToken,
    authorizeRoles("System Administrator"),
    (req, res) => {
        res.json({
            message: "Welcome System Administrator",
            user: req.user
        });
    }
);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

