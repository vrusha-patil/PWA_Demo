import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";

const UserDashboard = () => {
    const { user, logout } = useAuth();

    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    const [selectedStore, setSelectedStore] = useState(null);
    const [rating, setRating] = useState("");
    const [saving, setSaving] = useState(false);

    const loadStores = async (searchText = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/stores/user", {
                params: {
                    search: searchText,
                },
            });

            setStores(response.data.stores || []);
        } catch (err) {
            console.error("Load stores error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load stores."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        loadStores(search);
    };

    const openRating = (store) => {
        setSelectedStore(store);

        setRating(
            store.userRating
                ? String(store.userRating)
                : ""
        );

        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setSelectedStore(null);
        setRating("");
        setError("");
    };
    const submitRating = async () => {
        if (!rating) {
            setError(
                "Please enter a rating between 1 and 5."
            );
            return;
        }

        const ratingNumber = Number(rating);

        if (
            !Number.isInteger(ratingNumber) ||
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            setError(
                "Rating must be a whole number between 1 and 5."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (selectedStore.userRating) {
                await api.put(
                    `/ratings/${selectedStore.id}`,
                    {
                        rating: ratingNumber,
                    }
                );

                setMessage(
                    "Rating updated successfully."
                );
            } else {
                await api.post("/ratings", {
                    storeId: selectedStore.id,
                    rating: ratingNumber,
                });

                setMessage(
                    "Rating submitted successfully."
                );
            }

            setShowModal(false);
            setSelectedStore(null);
            setRating("");

            await loadStores(search);
        } catch (err) {
            console.error("Rating error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to save rating."
            );
        } finally {
            setSaving(false);
        }
    };

    const openPasswordModal = () => {
        setError("");
        setMessage("");
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
    };

    return (
        <div style={styles.page}>

            <header style={styles.header}>

                <div>
                    <h1 style={styles.heading}>
                        Store Rating System
                    </h1>

                    <p style={styles.welcome}>
                        Welcome, {user?.name}
                    </p>
                </div>

                <div style={styles.headerActions}>

                    {/* UPDATE PASSWORD */}

                    <button
                        type="button"
                        onClick={openPasswordModal}
                        style={styles.passwordButton}
                    >
                        Update Password
                    </button>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={logout}
                        style={styles.logout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <div style={styles.card}>

                <h2 style={styles.cardTitle}>
                    Find a Store
                </h2>

                <p style={styles.description}>
                    Search for a store using its name
                    or address.
                </p>

                <form
                    onSubmit={handleSearch}
                    style={styles.searchForm}
                >

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Enter store name or address"
                        style={styles.searchInput}
                    />

                    <button
                        type="submit"
                        style={styles.searchButton}
                    >
                        Search
                    </button>

                </form>

            </div>

            {error && !showModal && !showPasswordModal && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {message && (
                <div style={styles.success}>
                    {message}
                </div>
            )}

            <div style={styles.card}>

                <div style={styles.storeHeader}>

                    <div>
                        <h2 style={styles.cardTitle}>
                            Available Stores
                        </h2>

                        <p style={styles.description}>
                            View ratings and rate stores.
                        </p>
                    </div>

                    <span style={styles.count}>
                        {stores.length} stores
                    </span>

                </div>


                {loading ? (

                    <p style={styles.loading}>
                        Loading stores...
                    </p>

                ) : stores.length === 0 ? (

                    <div style={styles.empty}>

                        <h3>
                            No stores found
                        </h3>

                        <p>
                            Try searching for another store.
                        </p>

                    </div>

                ) : (

                    <div style={styles.tableContainer}>

                        <table style={styles.table}>

                            <thead>
                                <tr>

                                    <th style={styles.th}>
                                        Store Name
                                    </th>

                                    <th style={styles.th}>
                                        Address
                                    </th>

                                    <th style={styles.th}>
                                        Overall Rating
                                    </th>

                                    <th style={styles.th}>
                                        My Rating
                                    </th>

                                    <th style={styles.th}>
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {stores.map((store) => (

                                    <tr key={store.id}>

                                        <td style={styles.td}>
                                            <strong>
                                                {store.name}
                                            </strong>
                                        </td>

                                        <td style={styles.td}>
                                            {store.address}
                                        </td>

                                        <td style={styles.td}>
                                            ⭐{" "}
                                            {store.overallRating ??
                                                "0.00"}
                                        </td>

                                        <td style={styles.td}>

                                            {store.userRating ? (

                                                <span>
                                                    ⭐{" "}
                                                    {
                                                        store.userRating
                                                    }
                                                </span>

                                            ) : (

                                                <span
                                                    style={
                                                        styles.notRated
                                                    }
                                                >
                                                    Not rated
                                                </span>

                                            )}

                                        </td>

                                        <td style={styles.td}>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openRating(store)
                                                }
                                                style={
                                                    styles.rateButton
                                                }
                                            >
                                                {store.userRating
                                                    ? "Update Rating"
                                                    : "Rate Store"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>
            {showPasswordModal && (

                <div
                    style={styles.overlay}
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget
                        ) {
                            closePasswordModal();
                        }
                    }}
                >

                    <div style={styles.passwordModal}>

                        <div
                            style={
                                styles.passwordModalHeader
                            }
                        >

                            <h2
                                style={
                                    styles.passwordModalTitle
                                }
                            >
                                Update Password
                            </h2>

                            <button
                                type="button"
                                onClick={closePasswordModal}
                                style={styles.closeButton}
                                aria-label="Close"
                                title="Close"
                            >
                                ×
                            </button>

                        </div>

                        <div
                            style={
                                styles.passwordModalBody
                            }
                        >

                            <ChangePassword
                                onClose={
                                    closePasswordModal
                                }
                            />

                        </div>

                    </div>

                </div>

            )}

            {showModal && selectedStore && (

                <div
                    style={styles.overlay}
                    onMouseDown={(e) => {
                        if (
                            e.target === e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>

                            <div>

                                <h2
                                    style={
                                        styles.modalTitle
                                    }
                                >
                                    {selectedStore.userRating
                                        ? "Update Rating"
                                        : "Rate Store"}
                                </h2>

                                <p
                                    style={
                                        styles.modalStore
                                    }
                                >
                                    {selectedStore.name}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                style={styles.closeButton}
                                aria-label="Close"
                                title="Close"
                            >
                                ×
                            </button>

                        </div>


                        <div style={styles.modalBody}>

                            <label
                                style={styles.ratingLabel}
                            >
                                Enter rating
                            </label>

                            <input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                value={rating}
                                onChange={(e) =>
                                    setRating(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter a number from 1 to 5"
                                style={styles.ratingInput}
                            />

                            <p style={styles.ratingHint}>
                                Please enter a whole number
                                between 1 and 5.
                            </p>

                            {rating &&
                                Number(rating) >= 1 &&
                                Number(rating) <= 5 && (

                                    <p
                                        style={
                                            styles.starPreview
                                        }
                                    >
                                        {"⭐".repeat(
                                            Number(rating)
                                        )}
                                    </p>

                                )}

                            {error && (
                                <div
                                    style={
                                        styles.modalError
                                    }
                                >
                                    {error}
                                </div>
                            )}

                        </div>


                        <div style={styles.modalFooter}>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={submitRating}
                                disabled={saving}
                                style={styles.submitButton}
                            >
                                {saving
                                    ? "Saving..."
                                    : selectedStore.userRating
                                    ? "Update Rating"
                                    : "Submit Rating"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f6f8",
        padding: "30px",
        boxSizing: "border-box",
        color: "#222",
    },

    header: {
        maxWidth: "1100px",
        margin: "0 auto 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    heading: {
        margin: 0,
        fontSize: "28px",
        color: "#1f2937",
    },

    welcome: {
        margin: "7px 0 0",
        color: "#6b7280",
    },

    passwordButton: {
        background: "#4b5563",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "10px 18px",
        cursor: "pointer",
        fontWeight: "600",
    },

    logout: {
        background: "#1f2937",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "10px 18px",
        cursor: "pointer",
        fontWeight: "600",
    },

    card: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        background: "#fff",
        border: "1px solid #e1e4e8",
        borderRadius: "8px",
        padding: "24px",
        boxSizing: "border-box",
    },

    cardTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#1f2937",
    },

    description: {
        margin: "6px 0 18px",
        color: "#6b7280",
        fontSize: "14px",
    },

    searchForm: {
        display: "flex",
        gap: "10px",
    },

    searchInput: {
        flex: 1,
        padding: "11px 13px",
        border: "1px solid #cfd4da",
        borderRadius: "5px",
        fontSize: "14px",
        boxSizing: "border-box",
    },

    searchButton: {
        padding: "11px 22px",
        border: "none",
        borderRadius: "5px",
        background: "#1f2937",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
    },

    storeHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    count: {
        background: "#f0f1f3",
        padding: "6px 10px",
        borderRadius: "15px",
        fontSize: "13px",
        color: "#555",
    },

    tableContainer: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
    },

    th: {
        textAlign: "left",
        padding: "13px 10px",
        background: "#f8f9fa",
        borderBottom: "2px solid #ddd",
        fontSize: "14px",
        color: "#374151",
    },

    td: {
        padding: "14px 10px",
        borderBottom: "1px solid #eee",
        fontSize: "14px",
    },

    notRated: {
        color: "#777",
    },

    rateButton: {
        background: "#1f2937",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: "13px",
    },

    loading: {
        textAlign: "center",
        padding: "40px",
        color: "#666",
    },

    empty: {
        textAlign: "center",
        padding: "40px",
        color: "#666",
    },

    error: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        padding: "12px 15px",
        background: "#fff0f0",
        border: "1px solid #e0aaaa",
        borderRadius: "6px",
        color: "#a40000",
    },

    success: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        padding: "12px 15px",
        background: "#effaf1",
        border: "1px solid #b7dfbd",
        borderRadius: "6px",
        color: "#216b2a",
    },

    // ==========================================
    // MODALS
    // ==========================================

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000,
    },

    passwordModal: {
        width: "100%",
        maxWidth: "480px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.2)",
        maxHeight: "90vh",
        overflowY: "auto",
    },

    passwordModalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        borderBottom: "1px solid #eee",
    },

    passwordModalTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#1f2937",
    },

    passwordModalBody: {
        padding: "20px",
    },

    modal: {
        width: "100%",
        maxWidth: "430px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.2)",
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px",
        borderBottom: "1px solid #eee",
    },

    modalTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#1f2937",
    },

    modalStore: {
        margin: "5px 0 0",
        color: "#666",
        fontSize: "14px",
    },

    closeButton: {
        width: "32px",
        height: "32px",
        padding: 0,
        border: "none",
        background: "transparent",
        fontSize: "25px",
        color: "#666",
        cursor: "pointer",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    modalBody: {
        padding: "25px 20px",
    },

    ratingLabel: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    },

    ratingInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #cfd4da",
        borderRadius: "5px",
        fontSize: "16px",
        outline: "none",
    },

    ratingHint: {
        margin: "8px 0 0",
        fontSize: "13px",
        color: "#777",
    },

    starPreview: {
        margin: "18px 0 0",
        fontSize: "25px",
    },

    modalError: {
        marginTop: "15px",
        padding: "10px",
        background: "#fff0f0",
        border: "1px solid #e0aaaa",
        borderRadius: "5px",
        color: "#a40000",
        fontSize: "13px",
    },

    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "15px 20px",
        borderTop: "1px solid #eee",
        background: "#fafafa",
    },

    cancelButton: {
        padding: "9px 16px",
        background: "#fff",
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
    },

    submitButton: {
        padding: "9px 16px",
        background: "#1f2937",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default UserDashboard;