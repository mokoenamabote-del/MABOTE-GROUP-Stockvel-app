import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setHasError(false);
    setIsSaving(true);

    try {
      const result = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword,
        }),
      });
      setMessage(result.message);
      setIsComplete(true);
    } catch (error) {
      setMessage(error.message);
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>MABOTE GROUP HOLDINGS</h1>
        <h2>Reset Password</h2>

        {!token ? (
          <p className="login-error-message" role="alert">
            This password reset link is invalid. Request a new link from the login page.
          </p>
        ) : isComplete ? (
          <>
            <p className="login-help-message" role="status">{message}</p>
            <Link to="/login">Return to login</Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button type="submit" disabled={isSaving}>
              {isSaving ? "SAVING..." : "SAVE NEW PASSWORD"}
            </button>

            {message && (
              <p
                className={hasError ? "login-error-message" : "login-help-message"}
                role={hasError ? "alert" : "status"}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
