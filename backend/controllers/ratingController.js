const db = require("../config/database");

const createRating = (req, res) => {

    const { storeId, rating } = req.body || {};

    const userId = req.user.id;

    // Required fields
    if (!storeId || rating === undefined) {
        return res.status(400).json({
            message: "Store ID and rating are required"
        });
    }

    // Rating must be a whole integer between 1 and 5
    if (
        !Number.isInteger(Number(rating)) ||
        Number(rating) < 1 ||
        Number(rating) > 5
    ) {
        return res.status(400).json({
            message: "Rating must be a whole integer between 1 and 5"
        });
    }

    // Check if store exists
    const storeSql = `
        SELECT id
        FROM stores
        WHERE id = ?
    `;

    db.query(storeSql, [storeId], (err, storeResult) => {

        if (err) {
            console.error(
                "Store check error:",
                err.message
            );

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (storeResult.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Check if user already rated this store
        const existingSql = `
            SELECT id
            FROM ratings
            WHERE user_id = ?
            AND store_id = ?
        `;

        db.query(
            existingSql,
            [userId, storeId],
            (err, existingResult) => {

                if (err) {
                    console.error(
                        "Existing rating check error:",
                        err.message
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (existingResult.length > 0) {
                    return res.status(409).json({
                        message: "You have already rated this store"
                    });
                }

                // Insert rating
                const insertSql = `
                    INSERT INTO ratings
                    (user_id, store_id, rating)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [userId, storeId, Number(rating)],
                    (err, result) => {

                        if (err) {
                            console.error(
                                "Create rating error:",
                                err.message
                            );

                            return res.status(500).json({
                                message: "Failed to submit rating"
                            });
                        }

                        // Recalculate store average rating
                        const updateStoreRatingSql = `
                            UPDATE stores
                            SET rating = (
                                SELECT AVG(rating)
                                FROM ratings
                                WHERE store_id = ?
                            )
                            WHERE id = ?
                        `;

                        db.query(
                            updateStoreRatingSql,
                            [storeId, storeId],
                            (err) => {

                                if (err) {
                                    console.error(
                                        "Update store rating error:",
                                        err.message
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Rating submitted but failed to update store average"
                                    });
                                }

                                res.status(201).json({
                                    message:
                                        "Rating submitted successfully",
                                    ratingId: result.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};


const updateRating = (req, res) => {

    const { storeId } = req.params;

    const { rating } = req.body || {};

    const userId = req.user.id;

    // Rating required
    if (rating === undefined) {
        return res.status(400).json({
            message: "Rating is required"
        });
    }

    if (
        !Number.isInteger(Number(rating)) ||
        Number(rating) < 1 ||
        Number(rating) > 5
    ) {
        return res.status(400).json({
            message: "Rating must be a whole integer between 1 and 5"
        });
    }

    // Check user's existing rating
    const checkSql = `
        SELECT id
        FROM ratings
        WHERE user_id = ?
        AND store_id = ?
    `;

    db.query(
        checkSql,
        [userId, storeId],
        (err, results) => {

            if (err) {
                console.error(
                    "Check rating error:",
                    err.message
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // User has not rated this store
            if (results.length === 0) {
                return res.status(404).json({
                    message: "You have not rated this store yet"
                });
            }

            // Update user's rating
            const updateSql = `
                UPDATE ratings
                SET rating = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
                AND store_id = ?
            `;

            db.query(
                updateSql,
                [Number(rating), userId, storeId],
                (err) => {

                    if (err) {
                        console.error(
                            "Update rating error:",
                            err.message
                        );

                        return res.status(500).json({
                            message: "Failed to update rating"
                        });
                    }

                    // Recalculate store average rating
                    const updateStoreRatingSql = `
                        UPDATE stores
                        SET rating = (
                            SELECT AVG(rating)
                            FROM ratings
                            WHERE store_id = ?
                        )
                        WHERE id = ?
                    `;

                    db.query(
                        updateStoreRatingSql,
                        [storeId, storeId],
                        (err) => {

                            if (err) {
                                console.error(
                                    "Update store rating error:",
                                    err.message
                                );

                                return res.status(500).json({
                                    message:
                                        "Rating updated but failed to update store average"
                                });
                            }

                            res.status(200).json({
                                message:
                                    "Rating updated successfully"
                            });
                        }
                    );
                }
            );
        }
    );
};


module.exports = {
    createRating,
    updateRating
};