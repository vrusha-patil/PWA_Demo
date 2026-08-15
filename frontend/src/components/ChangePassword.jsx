import { useState } from "react";
import api from "../services/api";

const EyeIcon = ({ visible }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M2.5 12C4.5 7.8 8 5.5 12 5.5C16 5.5 19.5 7.8 21.5 12C19.5 16.2 16 18.5 12 18.5C8 18.5 4.5 16.2 2.5 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.8"
            />

            {!visible && (
                <path
                    d="M4 4L20 20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
};

const PasswordField = ({
    label,
    value,
    onChange,
    placeholder,
    visible,
    setVisible,
    disabled,
}) => {
    return (
        <div style={styles.field}>
            <label style={styles.label}>
                {label}
            </label>

            <div style={styles.passwordWrapper}>
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    style={styles.input}
                />

                <button
                    type="button"
                    onClick={() =>
                        setVisible((previous) => !previous)
                    }
                    disabled={disabled}
                    aria-label={
                        visible
                            ? `Hide ${label}`
                            : `Show ${label}`
                    }
                    style={styles.eyeButton}
                >
                    <EyeIcon visible={visible} />
                </button>
            </div>
        </div>
    );
};

const ChangePassword = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccess("");

        if (!currentPassword.trim()) {
            setError(
                "Please enter your current password."
            );
            return;
        }

        if (!newPassword) {
            setError(
                "Please enter your new password."
            );
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setError(
                "New password must be 8-16 characters and contain at least one uppercase letter and one special character."
            );
            return;
        }

        if (!confirmPassword) {
            setError(
                "Please confirm your new password."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirmation password do not match."
            );
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        try {
            setLoading(true);

            
            const response = await api.put(
                "/auth/password",
                {
                    currentPassword,
                    newPassword,
                }
            );

            setSuccess(
                response.data?.message ||
                    "Password updated successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            /*
             * Close after the user has time
             * to see the success message.
             */
            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 1200);
        } catch (err) {
            console.error(
                "Change password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={styles.form}
        >
            <p style={styles.description}>
                Enter your current password and choose a
                new password.
            </p>

            <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={(e) =>
                    setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
                visible={showCurrentPassword}
                setVisible={setShowCurrentPassword}
                disabled={loading}
            />

            <PasswordField
                label="New Password"
                value={newPassword}
                onChange={(e) =>
                    setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                visible={showNewPassword}
                setVisible={setShowNewPassword}
                disabled={loading}
            />

            <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                    setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                visible={showConfirmPassword}
                setVisible={setShowConfirmPassword}
                disabled={loading}
            />

            <p style={styles.hint}>
                Password must be 8-16 characters and contain
                at least one uppercase letter and one special
                character.
            </p>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {success && (
                <div style={styles.success}>
                    {success}
                </div>
            )}

            <div style={styles.actions}>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    style={styles.cancelButton}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.updateButton,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading
                            ? "not-allowed"
                            : "pointer",
                    }}
                >
                    {loading
                        ? "Updating..."
                        : "Update Password"}
                </button>
            </div>
        </form>
    );
};

const styles = {
    form: {
        width: "100%",
        boxSizing: "border-box",
    },

    description: {
        margin: "0 0 20px",
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: "1.5",
    },

    field: {
        marginBottom: "16px",
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    },

    passwordWrapper: {
        position: "relative",
        width: "100%",
    },

    input: {
        width: "100%",
        height: "46px",
        boxSizing: "border-box",
        padding: "11px 44px 11px 12px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#222",
        background: "#fff",
        outline: "none",
    },

    eyeButton: {
        position: "absolute",
        top: "50%",
        right: "9px",
        transform: "translateY(-50%)",
        width: "32px",
        height: "32px",
        padding: 0,
        border: "none",
        background: "transparent",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },

    hint: {
        margin: "-3px 0 16px",
        color: "#6b7280",
        fontSize: "12px",
        lineHeight: "1.5",
    },

    error: {
        marginBottom: "16px",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #e5b5b5",
        background: "#fff5f5",
        color: "#a40000",
        fontSize: "13px",
        lineHeight: "1.4",
    },

    success: {
        marginBottom: "16px",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #b7dfbd",
        background: "#effaf1",
        color: "#216b2a",
        fontSize: "13px",
        lineHeight: "1.4",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        paddingTop: "16px",
        borderTop: "1px solid #eee",
    },

    cancelButton: {
        padding: "10px 16px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        background: "#fff",
        color: "#374151",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    updateButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#1f2937",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
    },
};

export default ChangePassword;