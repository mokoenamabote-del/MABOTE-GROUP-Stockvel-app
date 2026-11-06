
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const getRedirectPathByRole = (role) => {
    const attemptedPath = location.state?.from?.pathname;

    if (attemptedPath && attemptedPath !== "/login") {
      return attemptedPath;
    }

    if (role === "Member") return "/client-portal";

    if (["Admin", "Management", "Support Staff"].includes(role)) {
      return "/admin";
    }

    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { token, account } = response;

      if (!token || !account?.role) {
        throw new Error("Invalid response received from server.");
      }

      localStorage.setItem("maboteAuthToken", token);
      localStorage.setItem("maboteAccount", JSON.stringify(account));

      navigate(getRedirectPathByRole(account.role), {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Unable to log in. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const openPasswordReset = () => {
    setShowReset(true);
    setError("");
    setMessage("");
  };

  const closePasswordReset = () => {
    setShowReset(false);
    setError("");
    setMessage("");
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>MABOTE GROUP</h1>

        <h2>{showReset ? "FORGOT PASSWORD" : "MEMBER LOGIN"}</h2>

        {error && (
          <div role="alert" className="login-error-message">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="login-help-message">
            {message}
          </div>
        )}

        {!showReset ? (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
                placeholder="Enter your email address"
              />

              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter your password"
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{ width: "auto" }}
                />
                Show Password
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "SIGNING IN..." : "LOGIN"}
              </button>
            </form>

            <button
              type="button"
              className="secondary-button"
              onClick={openPasswordReset}
            >
              FORGOT PASSWORD?
            </button>
          </>
        ) : (
          <div>
            <p>
              Password recovery is temporarily unavailable.
              Please contact MABOTE GROUP administration for assistance.
            </p>

            <button type="button" onClick={closePasswordReset}>
              BACK TO LOGIN
            </button>
          </div>
        )}

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            <strong>CREATE ACCOUNT</strong>
          </Link>
        </p>

        <p className="login-help-message">
          Prepare Today. Support Tomorrow.
        </p>

      </div>
    </div>
  );
}
