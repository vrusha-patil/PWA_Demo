import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StoreOwnerDashboard from "./pages/owner/StoreOwnerDashboard";
import UserDashboard from "./pages/user/UserDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRole="System Administrator"
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute
                            allowedRole="Normal User"
                        >
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute
                            allowedRole="Store Owner"
                        >
                            <StoreOwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;