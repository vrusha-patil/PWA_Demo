const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const db = require("./config/database");


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const authenticateToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const ownerRoutes = require("./routes/ownerRoutes");

app.get("/",(req,res)=>
{
    res.send("Our Store Rating application API is running....");
});

app.use("/api/auth",authRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});


app.use("/api/admin", adminRoutes);

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

app.use("/api/owner", ownerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

