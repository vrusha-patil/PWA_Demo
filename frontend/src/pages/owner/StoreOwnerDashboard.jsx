import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";

const StoreOwnerDashboard = () => {
    const { user, logout } = useAuth();

    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/owner/dashboard"
                );

                setStore(response.data.store);

                setRatings(
                    response.data.ratings || []
                );
            } catch (err) {
                console.error(
                    "Dashboard error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const openPasswordModal = () => {
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <h2>
                    Loading dashboard...
                </h2>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <header style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Store Owner Dashboard
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
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {error && (

                <div style={styles.errorCard}>

                    <h2>
                        Unable to load store
                    </h2>

                    <p style={styles.error}>
                        {error}
                    </p>

                </div>

            )}

            {!error && store && (

                <>

                    <section style={styles.storeCard}>

                        <h2 style={styles.storeName}>
                            {store.name}
                        </h2>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {store.email}
                        </p>

                        <p>
                            <strong>
                                Address:
                            </strong>{" "}
                            {store.address}
                        </p>

                    </section>

                    <section
                        style={styles.statsContainer}
                    >

                        <div style={styles.statCard}>

                            <h3>
                                Overall Rating
                            </h3>

                            <p
                                style={
                                    styles.statValue
                                }
                            >
                                ⭐{" "}
                                {store.averageRating}
                            </p>

                        </div>


                        <div style={styles.statCard}>

                            <h3>
                                Total Ratings
                            </h3>

                            <p
                                style={
                                    styles.statValue
                                }
                            >
                                {store.totalRatings}
                            </p>

                        </div>

                    </section>

                    <section style={styles.ratingsCard}>

                        <h2>
                            Ratings Received
                        </h2>

                        {ratings.length === 0 ? (

                            <div style={styles.empty}>

                                <p>
                                    No ratings received yet.
                                </p>

                            </div>

                        ) : (

                            <div
                                style={
                                    styles.tableWrapper
                                }
                            >

                                <table
                                    style={
                                        styles.table
                                    }
                                >

                                    <thead>

                                        <tr>

                                            <th
                                                style={
                                                    styles.th
                                                }
                                            >
                                                User
                                            </th>

                                            <th
                                                style={
                                                    styles.th
                                                }
                                            >
                                                Email
                                            </th>

                                            <th
                                                style={
                                                    styles.th
                                                }
                                            >
                                                Rating
                                            </th>

                                            <th
                                                style={
                                                    styles.th
                                                }
                                            >
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {ratings.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={`${item.userId}-${item.created_at}-${index}`}
                                                >

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        {
                                                            item.userName
                                                        }
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        {
                                                            item.userEmail
                                                        }
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        ⭐{" "}
                                                        {
                                                            item.rating
                                                        }
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        {new Date(
                                                            item.created_at
                                                        ).toLocaleDateString()}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </>

            )}

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

                        {/* MODAL HEADER */}

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
                                onClick={
                                    closePasswordModal
                                }
                                style={
                                    styles.closeButton
                                }
                                aria-label="Close"
                                title="Close"
                            >
                                ×
                            </button>

                        </div>


                        {/* MODAL BODY */}

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

        </div>
    );
};


const styles = {

    page: {
        minHeight: "100vh",
        padding: "30px",
        background: "#f5f5f5",
        color: "#222",
        boxSizing: "border-box",
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

    title: {
        margin: 0,
        fontSize: "28px",
        color: "#222",
    },

    welcome: {
        margin: "8px 0 0",
        color: "#666",
    },

    passwordButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#4b5563",
        color: "#fff",
        fontWeight: "600",
    },

    logoutButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#222",
        color: "#fff",
        fontWeight: "600",
    },

    storeCard: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
    },

    storeName: {
        marginTop: 0,
        marginBottom: "20px",
    },

    statsContainer: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        display: "flex",
        gap: "20px",
    },

    statCard: {
        flex: 1,
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
    },

    statValue: {
        fontSize: "28px",
        fontWeight: "bold",
        margin: 0,
    },

    ratingsCard: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
    },

    tableWrapper: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "15px",
    },

    th: {
        textAlign: "left",
        padding: "12px",
        borderBottom: "2px solid #ddd",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #eee",
    },

    empty: {
        padding: "25px 0",
        color: "#666",
    },

    errorCard: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
    },

    error: {
        color: "#b42318",
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        color: "#222",
    },

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
};

export default StoreOwnerDashboard;