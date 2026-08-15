import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import PasswordInput from "../../components/PasswordInput";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.address ||
            !formData.password
        ) {
            setError("All fields are required.");
            return;
        }

        if (
            formData.name.length < 20 ||
            formData.name.length > 60
        ) {
            setError(
                "Name must be between 20 and 60 characters."
            );
            return;
        }

        if (formData.address.length > 400) {
            setError(
                "Address cannot exceed 400 characters."
            );
            return;
        }

        if (
            formData.password.length < 8 ||
            formData.password.length > 16
        ) {
            setError(
                "Password must be between 8 and 16 characters."
            );
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
            setError(
                "Password must contain at least one uppercase letter."
            );
            return;
        }

        if (!/[^A-Za-z0-9]/.test(formData.password)) {
            setError(
                "Password must contain at least one special character."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/register",
                formData
            );

            setSuccess(
                response.data.message ||
                "Registration successful."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                password: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        }
        catch (err) {

            console.error(
                "Registration error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                        Create an account to discover stores
                        and share your ratings.
                    </p>

                </div>

            </div>


            {/* Right side */}
            <div className="auth-form-side">

                <div className="auth-card register-card">

                    <div className="form-heading">

                        <h2>
                            Create account
                        </h2>

                        <p>
                            Register as a normal user
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                maxLength={60}
                            />

                            <small>
                                20–60 characters
                            </small>

                        </div>


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

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                maxLength={400}
                                rows={3}
                            />

                            <small>
                                Maximum 400 characters
                            </small>

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
                                maxLength={16}
                                autoComplete="new-password"
                            />

                            <small>
                                8–16 characters, one uppercase
                                letter and one special character
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>


                    <div className="auth-footer">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;