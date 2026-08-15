import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/PasswordInput";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        try {

            setLoading(true);

            const response = await login(
                formData.email,
                formData.password
            );

            const role = response.user.role;

            if (role === "System Administrator") {
                navigate("/admin");
            }
            else if (role === "Store Owner") {
                navigate("/owner");
            }
            else if (role === "Normal User") {
                navigate("/user");
            }
            else {
                setError("Invalid user role.");
            }

        }
        catch (err) {

            console.error("Login error:", err);

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your details."
            );

        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* Left side */}
            <div className="auth-info">

                <div className="auth-info-content">

                    <h1>
                        Store Rating
                        <br />
                        System
                    </h1>

                    <p>
                        Find stores, view ratings and share
                        your experience with other users.
                    </p>

                </div>

            </div>


            {/* Right side */}
            <div className="auth-form-side">

                <div className="auth-card">

                    <div className="form-heading">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to your account
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <PasswordInput
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>


                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Register here
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;