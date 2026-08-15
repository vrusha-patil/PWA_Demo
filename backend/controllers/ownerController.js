const db = require("../config/database");

const getOwnerDashboard = (req, res) => {

    const ownerId = req.user.id;

    const sql = `
        SELECT
            s.id AS storeId,
            s.name AS storeName,
            s.email AS storeEmail,
            s.address AS storeAddress,
            COALESCE(AVG(r.rating), 0) AS averageRating,
            COUNT(r.id) AS totalRatings
        FROM stores s
        LEFT JOIN ratings r
            ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address
    `;

    db.query(sql, [ownerId], (err, results) => {

        if (err) {
            console.error(
                "Owner dashboard error:",
                err.message
            );

            return res.status(500).json({
                message: "Failed to fetch owner dashboard"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No store assigned to this Store Owner"
            });
        }

        const store = results[0];

        const ratingsSql = `
            SELECT
                u.id AS userId,
                u.name AS userName,
                u.email AS userEmail,
                r.rating,
                r.created_at
            FROM ratings r
            INNER JOIN users u
                ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
        `;

        db.query(
            ratingsSql,
            [store.storeId],
            (err, ratingResults) => {

                if (err) {
                    console.error(
                        "Owner ratings error:",
                        err.message
                    );

                    return res.status(500).json({
                        message: "Failed to fetch store ratings"
                    });
                }

                return res.status(200).json({
                    store: {
                        id: store.storeId,
                        name: store.storeName,
                        email: store.storeEmail,
                        address: store.storeAddress,
                        averageRating:
                            Number(store.averageRating).toFixed(2),
                        totalRatings:
                            Number(store.totalRatings)
                    },
                    ratings: ratingResults
                });
            }
        );
    });
};


module.exports = {
    getOwnerDashboard
};