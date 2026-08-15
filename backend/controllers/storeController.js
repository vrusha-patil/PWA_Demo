const db = require("../config/database");

const getAllStores = (req, res) => {

    const { name, address, sortBy, order } = req.query;

    let sql = `
        SELECT
            id,
            name,
            email,
            address,
            rating
        FROM stores
    `;

    const conditions = [];
    const values = [];

    // Search by store name
    if (name) {
        conditions.push("name LIKE ?");
        values.push(`%${name}%`);
    }

    // Search by address
    if (address) {
        conditions.push("address LIKE ?");
        values.push(`%${address}%`);
    }

    // Add WHERE conditions
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Allowed sorting fields
    const allowedSortFields = [
        "name",
        "email",
        "address",
        "rating"
    ];

    const selectedSort = allowedSortFields.includes(sortBy)
        ? sortBy
        : "name";

    const selectedOrder =
        order && order.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    sql += ` ORDER BY ${selectedSort} ${selectedOrder}`;

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error(
                "Fetch stores error:",
                err.message
            );

            return res.status(500).json({
                message: "Failed to fetch stores"
            });
        }

        res.status(200).json({
            stores: results
        });
    });
};


// ==========================================
// GET ALL STORES FOR NORMAL USER
// ==========================================

const getAllStoresForUser = (req, res) => {

    const userId = req.user.id;

    const {
        name,
        address,
        search,
        sortBy,
        order
    } = req.query;

    let sql = `
        SELECT
            s.id,
            s.name,
            s.address,
            s.rating AS overallRating,
            r.rating AS userRating
        FROM stores s
        LEFT JOIN ratings r
            ON s.id = r.store_id
            AND r.user_id = ?
    `;

    const conditions = [];
    const values = [userId];

    // Search using the search box
    if (search) {
        conditions.push(
            "(s.name LIKE ? OR s.address LIKE ?)"
        );

        const searchValue = `%${search}%`;

        values.push(searchValue);
        values.push(searchValue);
    }

    // Search by store name
    if (name) {
        conditions.push("s.name LIKE ?");
        values.push(`%${name}%`);
    }

    // Search by address
    if (address) {
        conditions.push("s.address LIKE ?");
        values.push(`%${address}%`);
    }

    // WHERE conditions
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Allowed sorting
    let selectedSort;

    if (sortBy === "rating" || sortBy === "overallRating") {
        selectedSort = "s.rating";
    } else if (sortBy === "address") {
        selectedSort = "s.address";
    } else {
        selectedSort = "s.name";
    }

    const selectedOrder =
        order && order.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    sql += ` ORDER BY ${selectedSort} ${selectedOrder}`;

    db.query(
        sql,
        values,
        (err, results) => {

            if (err) {
                console.error(
                    "Fetch stores for user error:",
                    err.message
                );

                return res.status(500).json({
                    message: "Failed to fetch stores"
                });
            }

            res.status(200).json({
                stores: results
            });
        }
    );
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getAllStores,
    getAllStoresForUser
};