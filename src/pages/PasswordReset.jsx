import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      setCompleted(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <img src="/mabote-logo.svg" alt="MABOTE GROUP" className="login-logo" />
        <h2>Reset Password</h2>

        {completed ? (
          <>
            <p className="login-help-message">
              Your password has been updated. You can now log in with your new password.
            </p>
            <button type="button" onClick={() => navigate("/login")}>
              GO TO LOGIN
            </button>
          </>
        ) : !token ? (
          <>
            <p className="login-error-message">
              This password reset link is invalid or expired. Request a new link from the login page.
            </p>
            <button type="button" onClick={() => navigate("/login")}>
              GO TO LOGIN
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "UPDATING PASSWORD..." : "RESET PASSWORD"}
            </button>

            {error && <p className="login-error-message">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
