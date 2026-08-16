import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <p>Loading...</p>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role
    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "System Administrator") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "Store Owner") {
            return <Navigate to="/owner" replace />;
        }

        if (user.role === "Normal User") {
            return <Navigate to="/user" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;