import React, { useState } from "react";
import { apiRequest } from "../lib/api";
import "./ChangePasswordForm.css";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      });

      setNewPassword("");
      setConfirmPassword("");
      setMessage(result.message || "Password changed successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password">
      <h3>Change your password</h3>
      <p>Your signed-in session verifies your account. Choose a new password below.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />

        <label htmlFor="confirm-new-password">Confirm new password</label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "CHANGING..." : "CHANGE PASSWORD"}
        </button>
      </form>

      {message && <p className="change-password-message" role="status">{message}</p>}
      {error && <p className="change-password-error" role="alert">{error}</p>}
    </div>
  );
}
