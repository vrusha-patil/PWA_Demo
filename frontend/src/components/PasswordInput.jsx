import { useState } from "react";

const PasswordInput = ({
    id,
    name,
    value,
    onChange,
    placeholder,
    maxLength,
    autoComplete,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={styles.wrapper}>
            <input
                id={id}
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                autoComplete={autoComplete}
                style={styles.input}
            />

            <button
                type="button"
                onClick={() =>
                    setShowPassword((previous) => !previous)
                }
                style={styles.eyeButton}
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
            >
                {showPassword ? (
                    /* Eye off */
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                        <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 9.27 3.11 10.5 8a11.83 11.83 0 0 1-2.04 3.73" />
                        <path d="M6.61 6.61C4.62 7.83 3.1 9.66 1.5 12c1.23 4.89 5.5 8 10.5 8a9.77 9.77 0 0 0 3.12-.51" />
                    </svg>
                ) : (
                    /* Eye */
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
};

const styles = {
    wrapper: {
        position: "relative",
        width: "100%",
    },

    input: {
        width: "100%",
        height: "45px",
        padding: "12px 45px 12px 13px",
        border: "1px solid #cfd4da",
        borderRadius: "6px",
        background: "#fff",
        color: "#222",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
    },

    eyeButton: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "30px",
        height: "30px",
        padding: 0,
        border: "none",
        background: "transparent",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
};

export default PasswordInput;