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


module.exports = {
    getAllStores
};