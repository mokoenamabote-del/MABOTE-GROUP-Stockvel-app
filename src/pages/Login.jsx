
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

  const [resetData, setResetData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
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
    setResetCodeSent(false);
    setResetData({
      email: formData.email,
      code: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setMessage("");
  };

  const closePasswordReset = () => {
    setShowReset(false);
    setResetCodeSent(false);
    setError("");
    setMessage("");
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    setResetLoading(true);

    try {
      const response = await apiRequest(
        "/api/auth/password-reset-requests",
        {
          method: "POST",
          body: JSON.stringify({ email: resetData.email }),
        }
      );

      setResetCodeSent(true);
      setMessage(
        response.message ||
          "If an account exists for that email, a verification code will be sent."
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to request a reset code.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !resetData.email ||
      !resetData.code ||
      !resetData.newPassword ||
      !resetData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (resetData.newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setResetLoading(true);

    try {
      const response = await apiRequest(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify(resetData),
        }
      );

      setMessage(response.message || "Password changed successfully.");
      setResetData({
        email: resetData.email,
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
      setResetCodeSent(false);
      setShowReset(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
    } finally {
      setResetLoading(false);
    }
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
          <>
            <form
              onSubmit={
                resetCodeSent
                  ? handleResetSubmit
                  : handleRequestResetCode
              }
            >
              <label htmlFor="resetEmail">Registered Email Address</label>

              <input
                id="resetEmail"
                name="email"
                type="email"
                required
                value={resetData.email}
                onChange={handleResetChange}
                placeholder="Enter your registered email"
                autoComplete="username"
                disabled={resetLoading || resetCodeSent}
              />

              {resetCodeSent && (
                <>
                  <label htmlFor="resetCode">Email verification code</label>
                  <input
                    id="resetCode"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={resetData.code}
                    onChange={handleResetChange}
                    placeholder="Enter the 6-digit code"
                    autoComplete="one-time-code"
                    disabled={resetLoading}
                  />

                  <label htmlFor="newPassword">Create New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    disabled={resetLoading}
                  />

                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={resetData.confirmPassword}
                    onChange={handleResetChange}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    disabled={resetLoading}
                  />
                </>
              )}

              <button type="submit" disabled={resetLoading}>
                {resetLoading
                  ? resetCodeSent
                    ? "SAVING PASSWORD..."
                    : "SENDING CODE..."
                  : resetCodeSent
                    ? "RESET PASSWORD"
                    : "SEND VERIFICATION CODE"}
              </button>
            </form>

            {resetCodeSent && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setResetCodeSent(false);
                  setResetData((previous) => ({
                    ...previous,
                    code: "",
                  }));
                  setMessage("");
                  setError("");
                }}
                disabled={resetLoading}
              >
                USE A DIFFERENT EMAIL
              </button>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={closePasswordReset}
              disabled={resetLoading}
            >
              BACK TO LOGIN
            </button>
          </>
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
