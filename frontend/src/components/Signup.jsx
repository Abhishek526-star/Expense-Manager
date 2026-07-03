
import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Signup = ({ API_URL = "http://localhost:4000" }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            await axios.post(
                `${API_URL}/api/user/register`,
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.cardContainer}>
                <div className={loginStyles.header}>
                    <div className={loginStyles.avatar}>
                        <User className="w-10 h-10 text-white" />
                    </div>

                    <h1 className={loginStyles.headerTitle}>
                        Create Account
                    </h1>

                    <p className={loginStyles.headerSubtitle}>
                        Join Expense Tracker
                    </p>
                </div>

                <div className={loginStyles.formContainer}>
                    {error && (
                        <div className={loginStyles.errorContainer}>
                            <span className={loginStyles.errorText}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div className="mb-6">
                            <label className={loginStyles.label}>
                                Full Name
                            </label>

                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <User className="w-5 h-5" />
                                </div>

                                <input
                                    type="text"
                                    className={loginStyles.input}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}

                        <div className="mb-6">
                            <label className={loginStyles.label}>
                                Email
                            </label>

                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <Mail className="w-5 h-5" />
                                </div>

                                <input
                                    type="email"
                                    className={loginStyles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}

                        <div className="mb-6">
                            <label className={loginStyles.label}>
                                Password
                            </label>

                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <Lock className="w-5 h-5" />
                                </div>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={loginStyles.input}
                                    placeholder="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={loginStyles.passwordToggle}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}

                        <div className="mb-6">
                            <label className={loginStyles.label}>
                                Confirm Password
                            </label>

                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <Lock className="w-5 h-5" />
                                </div>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className={loginStyles.input}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className={loginStyles.passwordToggle}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className={loginStyles.checkboxContainer}>
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={loginStyles.checkbox}
                            />

                            <label
                                htmlFor="remember"
                                className={loginStyles.checkboxLabel}
                            >
                                Remember Me
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${loginStyles.button} ${isLoading
                                    ? loginStyles.buttonDisabled
                                    : ""
                                }`}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <div className={loginStyles.signUpContainer}>
                        <p className={loginStyles.signUpText}>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className={loginStyles.signUpLink}
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

