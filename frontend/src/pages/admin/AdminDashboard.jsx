
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [userSearch, setUserSearch] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userSortBy, setUserSortBy] = useState("id");
    const [userOrder, setUserOrder] = useState("desc");

    const [storeSearch, setStoreSearch] = useState("");
    const [storeSortBy, setStoreSortBy] = useState("id");
    const [storeOrder, setStoreOrder] = useState("desc");

    const [showUserModal, setShowUserModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
    });

    const [storeForm, setStoreForm] = useState({
        ownerId: "",
        name: "",
        email: "",
        address: "",
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchStats(),
                fetchUsers(),
                fetchStores(),
            ]);
        } catch (err) {
            console.error("Dashboard loading error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load admin dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        const response = await api.get("/admin/dashboard");

        setStats({
            totalUsers: Number(response.data.totalUsers || 0),
            totalStores: Number(response.data.totalStores || 0),
            totalRatings: Number(response.data.totalRatings || 0),
        });
    };

    const fetchUsers = async (
        searchValue = userSearch,
        roleValue = userRole,
        sortValue = userSortBy,
        orderValue = userOrder
    ) => {
        const response = await api.get("/admin/users", {
            params: {
                search: searchValue?.trim() || undefined,
                role: roleValue || undefined,
                sortBy: sortValue,
                order: orderValue,
            },
        });

        setUsers(response.data.users || []);
    };

    const fetchStores = async (
        searchValue = storeSearch,
        sortValue = storeSortBy,
        orderValue = storeOrder
    ) => {
        const response = await api.get("/admin/stores", {
            params: {
                search: searchValue?.trim() || undefined,
                sortBy: sortValue,
                order: orderValue,
            },
        });

        setStores(response.data.stores || []);
    };

    const handleUserSearch = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            await fetchUsers();
        } catch (err) {
            console.error("User search error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to search users"
            );
        }
    };

    const handleUserRoleChange = async (e) => {
        const value = e.target.value;

        setUserRole(value);

        try {
            setError("");

            await fetchUsers(
                userSearch,
                value,
                userSortBy,
                userOrder
            );
        } catch (err) {
            console.error("User role filter error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to filter users"
            );
        }
    };

    const handleUserSortChange = async (e) => {
        const value = e.target.value;

        setUserSortBy(value);

        try {
            setError("");

            await fetchUsers(
                userSearch,
                userRole,
                value,
                userOrder
            );
        } catch (err) {
            console.error("User sorting error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to sort users"
            );
        }
    };

    const handleUserOrderChange = async (e) => {
        const value = e.target.value;

        setUserOrder(value);

        try {
            setError("");

            await fetchUsers(
                userSearch,
                userRole,
                userSortBy,
                value
            );
        } catch (err) {
            console.error("User order error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to sort users"
            );
        }
    };

    const handleStoreSearch = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            await fetchStores();
        } catch (err) {
            console.error("Store search error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to search stores"
            );
        }
    };

    const handleStoreSortChange = async (e) => {
        const value = e.target.value;

        setStoreSortBy(value);

        try {
            setError("");

            await fetchStores(
                storeSearch,
                value,
                storeOrder
            );
        } catch (err) {
            console.error("Store sorting error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to sort stores"
            );
        }
    };

    const handleStoreOrderChange = async (e) => {
        const value = e.target.value;

        setStoreOrder(value);

        try {
            setError("");

            await fetchStores(
                storeSearch,
                storeSortBy,
                value
            );
        } catch (err) {
            console.error("Store order error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to sort stores"
            );
        }
    };

    const handleUserChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleStoreChange = (e) => {
        setStoreForm({
            ...storeForm,
            [e.target.name]: e.target.value,
        });
    };

    const openUserModal = () => {
        setError("");

        setUserForm({
            name: "",
            email: "",
            password: "",
            address: "",
            role: "Normal User",
        });

        setShowUserModal(true);
    };

    const openStoreModal = () => {
        setError("");

        setStoreForm({
            ownerId: "",
            name: "",
            email: "",
            address: "",
        });

        setShowStoreModal(true);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            await api.post("/admin/users", userForm);

            setSuccess("User created successfully.");

            setShowUserModal(false);

            setUserForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "Normal User",
            });

            await Promise.all([
                fetchUsers(),
                fetchStats(),
            ]);
        } catch (err) {
            console.error("Create user error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to create user"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            await api.post("/admin/stores", {
                ownerId: Number(storeForm.ownerId),
                name: storeForm.name,
                email: storeForm.email,
                address: storeForm.address,
            });

            setSuccess("Store created successfully.");

            setShowStoreModal(false);

            setStoreForm({
                ownerId: "",
                name: "",
                email: "",
                address: "",
            });

            await Promise.all([
                fetchStores(),
                fetchStats(),
            ]);
        } catch (err) {
            console.error("Create store error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to create store"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewUser = async (userId) => {
        try {
            setError("");

            const response = await api.get(
                `/admin/users/${userId}`
            );

            setSelectedUser(response.data.user);
            setShowUserDetails(true);
        } catch (err) {
            console.error(
                "Fetch user details error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to load user details"
            );
        }
    };

    if (loading) {
        return (
            <div style={styles.centerPage}>
                <div style={styles.loadingBox}>
                    <h2 style={styles.loadingTitle}>
                        Loading dashboard...
                    </h2>

                    <p style={styles.mutedText}>
                        Please wait.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>

                    <div>
                        <h1 style={styles.title}>
                            Store Rating System
                        </h1>

                        <p style={styles.welcome}>
                            Welcome, {user?.name}
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>
            </header>

            <main style={styles.container}>

                {/* PAGE TITLE */}
                <section style={styles.introSection}>
                    <h2 style={styles.pageHeading}>
                        Admin Dashboard
                    </h2>

                    <p style={styles.description}>
                        Manage users, stores and view
                        system information.
                    </p>
                </section>

                {/* MESSAGES */}
                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={styles.successMessage}>
                        {success}
                    </div>
                )}

                {/* STATISTICS */}
                <section style={styles.statsContainer}>

                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>
                            Total Users
                        </p>

                        <p style={styles.statValue}>
                            {stats.totalUsers}
                        </p>
                    </div>

                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>
                            Total Stores
                        </p>

                        <p style={styles.statValue}>
                            {stats.totalStores}
                        </p>
                    </div>

                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>
                            Total Ratings
                        </p>

                        <p style={styles.statValue}>
                            {stats.totalRatings}
                        </p>
                    </div>

                </section>

                {/* USERS */}
                <section style={styles.sectionCard}>

                    <div style={styles.sectionHeader}>

                        <div>
                            <h2 style={styles.sectionTitle}>
                                Users
                            </h2>

                            <p style={styles.sectionDescription}>
                                Search, filter and sort registered users.
                            </p>
                        </div>

                        <button
                            onClick={openUserModal}
                            style={styles.primaryButton}
                        >
                            Add User
                        </button>

                    </div>

                    {/* USER SEARCH */}
                    <form
                        onSubmit={handleUserSearch}
                        style={styles.searchArea}
                    >

                        <input
                            type="text"
                            placeholder="Search by name, email or address"
                            value={userSearch}
                            onChange={(e) =>
                                setUserSearch(
                                    e.target.value
                                )
                            }
                            style={styles.searchInput}
                        />

                        <select
                            value={userRole}
                            onChange={handleUserRoleChange}
                            style={styles.select}
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="Normal User">
                                Normal User
                            </option>

                            <option value="Store Owner">
                                Store Owner
                            </option>

                            <option value="System Administrator">
                                System Administrator
                            </option>
                        </select>

                        <button
                            type="submit"
                            style={styles.secondaryButton}
                        >
                            Search
                        </button>

                    </form>

                    {/* USER SORT */}
                    <div style={styles.sortArea}>

                        <span style={styles.sortLabel}>
                            Sort Users:
                        </span>

                        <select
                            value={userSortBy}
                            onChange={handleUserSortChange}
                            style={styles.select}
                        >
                            <option value="id">
                                ID
                            </option>

                            <option value="name">
                                Name
                            </option>

                            <option value="email">
                                Email
                            </option>

                            <option value="address">
                                Address
                            </option>

                            <option value="role">
                                Role
                            </option>
                        </select>

                        <select
                            value={userOrder}
                            onChange={handleUserOrderChange}
                            style={styles.select}
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>

                    </div>

                    {/* USER TABLE */}
                    {users.length === 0 ? (
                        <div style={styles.emptyState}>
                            No users found.
                        </div>
                    ) : (
                        <div style={styles.tableWrapper}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
                                        <th style={styles.th}>
                                            Name
                                        </th>

                                        <th style={styles.th}>
                                            Email
                                        </th>

                                        <th style={styles.th}>
                                            Address
                                        </th>

                                        <th style={styles.th}>
                                            Role
                                        </th>

                                        <th style={styles.th}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((item) => (
                                        <tr key={item.id}>

                                            <td style={styles.td}>
                                                {item.name}
                                            </td>

                                            <td style={styles.td}>
                                                {item.email}
                                            </td>

                                            <td style={styles.td}>
                                                {item.address}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        styles.roleBadge
                                                    }
                                                >
                                                    {item.role}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                <button
                                                    onClick={() =>
                                                        handleViewUser(
                                                            item.id
                                                        )
                                                    }
                                                    style={
                                                        styles.viewButton
                                                    }
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                {/* STORES */}
                <section style={styles.sectionCard}>

                    <div style={styles.sectionHeader}>

                        <div>
                            <h2 style={styles.sectionTitle}>
                                Stores
                            </h2>

                            <p style={styles.sectionDescription}>
                                Search and sort registered stores.
                            </p>
                        </div>

                        <button
                            onClick={openStoreModal}
                            style={styles.primaryButton}
                        >
                            Add Store
                        </button>

                    </div>

                    {/* STORE SEARCH */}
                    <form
                        onSubmit={handleStoreSearch}
                        style={styles.searchArea}
                    >

                        <input
                            type="text"
                            placeholder="Search by store name, email or address"
                            value={storeSearch}
                            onChange={(e) =>
                                setStoreSearch(
                                    e.target.value
                                )
                            }
                            style={styles.searchInput}
                        />

                        <button
                            type="submit"
                            style={styles.secondaryButton}
                        >
                            Search
                        </button>

                    </form>

                    {/* STORE SORT */}
                    <div style={styles.sortArea}>

                        <span style={styles.sortLabel}>
                            Sort Stores:
                        </span>

                        <select
                            value={storeSortBy}
                            onChange={handleStoreSortChange}
                            style={styles.select}
                        >
                            <option value="id">
                                ID
                            </option>

                            <option value="name">
                                Name
                            </option>

                            <option value="email">
                                Email
                            </option>

                            <option value="address">
                                Address
                            </option>

                            <option value="rating">
                                Rating
                            </option>
                        </select>

                        <select
                            value={storeOrder}
                            onChange={handleStoreOrderChange}
                            style={styles.select}
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>

                    </div>

                    {/* STORE TABLE */}
                    {stores.length === 0 ? (
                        <div style={styles.emptyState}>
                            No stores found.
                        </div>
                    ) : (
                        <div style={styles.tableWrapper}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
                                        <th style={styles.th}>
                                            Store Name
                                        </th>

                                        <th style={styles.th}>
                                            Email
                                        </th>

                                        <th style={styles.th}>
                                            Address
                                        </th>

                                        <th style={styles.th}>
                                            Rating
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stores.map((store) => (
                                        <tr key={store.id}>

                                            <td style={styles.td}>
                                                {store.name}
                                            </td>

                                            <td style={styles.td}>
                                                {store.email}
                                            </td>

                                            <td style={styles.td}>
                                                {store.address}
                                            </td>

                                            <td style={styles.td}>
                                                ⭐{" "}
                                                {store.rating ??
                                                    "0.00"}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>

            {/* ADD USER MODAL */}
            {showUserModal && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>

                            <div>
                                <h2 style={styles.modalTitle}>
                                    Add User
                                </h2>

                                <p style={styles.modalDescription}>
                                    Create a new user account.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowUserModal(false)
                                }
                                disabled={submitting}
                                style={styles.closeButton}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateUser}
                            style={styles.modalForm}
                        >

                            <label style={styles.label}>
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={userForm.name}
                                onChange={handleUserChange}
                                placeholder="Enter name"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleUserChange}
                                placeholder="Enter email"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={userForm.password}
                                onChange={handleUserChange}
                                placeholder="Enter password"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={userForm.address}
                                onChange={handleUserChange}
                                placeholder="Enter address"
                                required
                                rows="3"
                                style={styles.textarea}
                            />

                            <label style={styles.label}>
                                Role
                            </label>

                            <select
                                name="role"
                                value={userForm.role}
                                onChange={handleUserChange}
                                style={styles.formInput}
                            >
                                <option value="Normal User">
                                    Normal User
                                </option>

                                <option value="Store Owner">
                                    Store Owner
                                </option>

                                <option value="System Administrator">
                                    System Administrator
                                </option>
                            </select>

                            <div style={styles.modalActions}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowUserModal(false)
                                    }
                                    disabled={submitting}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={styles.primaryButton}
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ADD STORE MODAL */}
            {showStoreModal && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>

                            <div>
                                <h2 style={styles.modalTitle}>
                                    Add Store
                                </h2>

                                <p style={styles.modalDescription}>
                                    Create a new store and assign
                                    it to a Store Owner.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowStoreModal(false)
                                }
                                disabled={submitting}
                                style={styles.closeButton}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateStore}
                            style={styles.modalForm}
                        >

                            <label style={styles.label}>
                                Store Owner ID
                            </label>

                            <input
                                type="number"
                                name="ownerId"
                                value={storeForm.ownerId}
                                onChange={handleStoreChange}
                                placeholder="Enter Store Owner ID"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={storeForm.name}
                                onChange={handleStoreChange}
                                placeholder="Enter store name"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={storeForm.email}
                                onChange={handleStoreChange}
                                placeholder="Enter store email"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={storeForm.address}
                                onChange={handleStoreChange}
                                placeholder="Enter store address"
                                required
                                rows="3"
                                style={styles.textarea}
                            />

                            <div style={styles.modalActions}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowStoreModal(false)
                                    }
                                    disabled={submitting}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={styles.primaryButton}
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Create Store"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {showStoreModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={styles.modalTitle}>
                                    Add Store
                                </h2>

                                <p style={styles.modalDescription}>
                                    Create a new store and assign it
                                    to a Store Owner.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowStoreModal(false)
                                }
                                disabled={submitting}
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateStore}
                            style={styles.modalForm}
                        >
                            <label style={styles.label}>
                                Store Owner ID
                            </label>

                            <input
                                type="number"
                                name="ownerId"
                                value={storeForm.ownerId}
                                onChange={handleStoreChange}
                                placeholder="Enter Store Owner ID"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={storeForm.name}
                                onChange={handleStoreChange}
                                placeholder="Enter store name"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={storeForm.email}
                                onChange={handleStoreChange}
                                placeholder="Enter store email"
                                required
                                style={styles.formInput}
                            />

                            <label style={styles.label}>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={storeForm.address}
                                onChange={handleStoreChange}
                                placeholder="Enter store address"
                                required
                                rows="3"
                                style={styles.textarea}
                            />

                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowStoreModal(false)
                                    }
                                    disabled={submitting}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={styles.primaryButton}
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Create Store"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUserDetails && selectedUser && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={styles.modalTitle}>
                                    User Details
                                </h2>

                                <p style={styles.modalDescription}>
                                    User information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowUserDetails(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <div style={styles.detailsContent}>

                            {/* USER ID ADDED HERE */}
                            <div style={styles.detailRow}>
                                <strong>User ID</strong>

                                <span>
                                    {selectedUser.id}
                                </span>
                            </div>

                            <div style={styles.detailRow}>
                                <strong>Name</strong>

                                <span>
                                    {selectedUser.name}
                                </span>
                            </div>

                            <div style={styles.detailRow}>
                                <strong>Email</strong>

                                <span>
                                    {selectedUser.email}
                                </span>
                            </div>

                            <div style={styles.detailRow}>
                                <strong>Address</strong>

                                <span>
                                    {selectedUser.address}
                                </span>
                            </div>

                            <div style={styles.detailRow}>
                                <strong>Role</strong>

                                <span>
                                    {selectedUser.role}
                                </span>
                            </div>

                            {selectedUser.store && (
                                <div style={styles.storeDetails}>
                                    <h3 style={styles.storeDetailsTitle}>
                                        Store Information
                                    </h3>

                                    <p>
                                        <strong>
                                            Store Name:
                                        </strong>{" "}
                                        {
                                            selectedUser.store
                                                .storeName
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Store ID:
                                        </strong>{" "}
                                        {
                                            selectedUser.store
                                                .storeId
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Rating:
                                        </strong>{" "}
                                        ⭐{" "}
                                        {
                                            selectedUser.store
                                                .rating ?? "0.00"
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={styles.modalActions}>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowUserDetails(false)
                                }
                                style={styles.cancelButton}
                            >
                                Close
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
        color: "#222",
        boxSizing: "border-box",
    },

    container: {
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "0 0 40px 0",
        boxSizing: "border-box",
    },

    header: {
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e2e5e8",
        boxSizing: "border-box",
    },

    headerInner: {
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "22px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
    },

    title: {
        margin: 0,
        color: "#1f2937",
        fontSize: "26px",
        fontWeight: "700",
    },

    welcome: {
        margin: "6px 0 0 0",
        color: "#6b7280",
        fontSize: "14px",
    },

    logoutButton: {
        padding: "9px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#1f2937",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },

    introSection: {
        padding: "28px 0 20px 0",
    },

    pageHeading: {
        margin: 0,
        color: "#1f2937",
        fontSize: "24px",
        fontWeight: "700",
    },

    description: {
        margin: "6px 0 0 0",
        color: "#6b7280",
        fontSize: "14px",
    },

    statsContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "22px",
    },

    statCard: {
        background: "#ffffff",
        border: "1px solid #e1e5e9",
        borderRadius: "8px",
        padding: "20px",
        boxSizing: "border-box",
    },

    statLabel: {
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
    },

    statValue: {
        margin: "8px 0 0 0",
        color: "#1f2937",
        fontSize: "28px",
        fontWeight: "700",
    },

    sectionCard: {
        background: "#ffffff",
        border: "1px solid #e1e5e9",
        borderRadius: "8px",
        padding: "22px",
        marginBottom: "22px",
        boxSizing: "border-box",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px",
        marginBottom: "18px",
    },

    sectionTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "700",
    },

    sectionDescription: {
        margin: "5px 0 0 0",
        color: "#6b7280",
        fontSize: "13px",
    },

    searchArea: {
        display: "flex",
        gap: "10px",
        marginBottom: "12px",
        width: "100%",
        flexWrap: "wrap",
    },

    searchInput: {
        flex: 1,
        minWidth: "250px",
        padding: "11px 13px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#222",
        background: "#ffffff",
        boxSizing: "border-box",
        outline: "none",
    },

    select: {
        width: "180px",
        padding: "11px 12px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#222",
        background: "#ffffff",
        boxSizing: "border-box",
    },

    sortArea: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px",
        flexWrap: "wrap",
    },

    sortLabel: {
        color: "#374151",
        fontSize: "14px",
        fontWeight: "600",
    },

    primaryButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#1f2937",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    secondaryButton: {
        padding: "10px 17px",
        border: "1px solid #1f2937",
        borderRadius: "6px",
        background: "#ffffff",
        color: "#1f2937",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    viewButton: {
        padding: "7px 13px",
        border: "1px solid #cfd4da",
        borderRadius: "5px",
        background: "#ffffff",
        color: "#374151",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
    },

    roleBadge: {
        display: "inline-block",
        padding: "5px 8px",
        borderRadius: "4px",
        background: "#f1f3f5",
        color: "#374151",
        fontSize: "12px",
        fontWeight: "600",
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        minWidth: "760px",
        borderCollapse: "collapse",
    },

    th: {
        padding: "12px",
        textAlign: "left",
        background: "#fafbfc",
        borderBottom: "2px solid #dfe3e8",
        color: "#374151",
        fontSize: "13px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "13px 12px",
        borderBottom: "1px solid #edf0f2",
        color: "#374151",
        fontSize: "13px",
        verticalAlign: "middle",
    },

    emptyState: {
        padding: "35px 20px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
        border: "1px solid #edf0f2",
        borderRadius: "6px",
    },

    errorMessage: {
        marginBottom: "18px",
        padding: "11px 14px",
        background: "#fff1f1",
        border: "1px solid #f0b5b5",
        borderRadius: "6px",
        color: "#b42318",
        fontSize: "14px",
    },

    successMessage: {
        marginBottom: "18px",
        padding: "11px 14px",
        background: "#f0fdf4",
        border: "1px solid #b7e4c7",
        borderRadius: "6px",
        color: "#166534",
        fontSize: "14px",
    },

    centerPage: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6f8",
    },

    loadingBox: {
        textAlign: "center",
        background: "#ffffff",
        border: "1px solid #e1e5e9",
        borderRadius: "8px",
        padding: "30px 45px",
    },

    loadingTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "20px",
    },

    mutedText: {
        marginTop: "7px",
        color: "#6b7280",
        fontSize: "14px",
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        zIndex: 1000,
    },

    modal: {
        width: "100%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.18)",
    },

    modalHeader: {
        padding: "20px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid #e5e7eb",
    },

    modalTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "700",
    },

    modalDescription: {
        margin: "5px 0 0 0",
        color: "#6b7280",
        fontSize: "13px",
        lineHeight: "1.5",
    },

    closeButton: {
        border: "none",
        background: "transparent",
        color: "#6b7280",
        fontSize: "27px",
        lineHeight: "20px",
        cursor: "pointer",
        padding: "0 2px",
    },

    modalForm: {
        padding: "22px",
    },

    label: {
        display: "block",
        marginBottom: "6px",
        marginTop: "14px",
        color: "#374151",
        fontSize: "13px",
        fontWeight: "600",
    },

    formInput: {
        width: "100%",
        padding: "11px 12px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#222",
        background: "#ffffff",
        boxSizing: "border-box",
        outline: "none",
    },

    textarea: {
        width: "100%",
        padding: "11px 12px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#222",
        background: "#ffffff",
        boxSizing: "border-box",
        resize: "vertical",
        fontFamily: "inherit",
        outline: "none",
    },

    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "22px",
        paddingTop: "18px",
        borderTop: "1px solid #e5e7eb",
    },

    cancelButton: {
        padding: "10px 16px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        background: "#ffffff",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },

    detailsContent: {
        padding: "22px",
    },

    detailRow: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "12px 0",
        borderBottom: "1px solid #edf0f2",
        color: "#374151",
        fontSize: "14px",
        wordBreak: "break-word",
    },

    storeDetails: {
        marginTop: "20px",
        padding: "16px",
        background: "#f8f9fa",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        color: "#374151",
        fontSize: "14px",
    },

    storeDetailsTitle: {
        margin: "0 0 12px 0",
        fontSize: "16px",
        color: "#1f2937",
    },
};

export default AdminDashboard;

