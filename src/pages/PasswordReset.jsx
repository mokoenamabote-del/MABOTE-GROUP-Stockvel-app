import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(
    location.search
  );

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage(
        "This password reset link is invalid or missing."
      );
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await apiRequest(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            newPassword,
            confirmPassword,
          }),
        }
      );

      setMessage(
        result.message ||
          "Password updated successfully. You can now log in."
      );

      setSuccess(true);

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to reset your password. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>MABOTE GROUP HOLDINGS</h1>

        <h2>Reset Password</h2>

        {!success ? (
          <>
            <p className="login-help-message">
              Choose a new password for your
              MABOTE GROUP account.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                required
              />

              <label htmlFor="confirm-password">
                Confirm New Password
              </label>

              <input
                id="confirm-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                required
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) =>
                    setShowPassword(
                      event.target.checked
                    )
                  }
                />

                Show Password
              </label>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "UPDATING..."
                  : "UPDATE PASSWORD"}
              </button>
            </form>

            {errorMessage && (
              <p
                className="login-error-message"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </>
        ) : (
          <>
            <p
              className="login-help-message"
              role="status"
            >
              {message}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              GO TO LOGIN
            </button>
          </>
        )}

        {!success && (
          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            BACK TO LOGIN
          </button>
        )}
      </div>
    </section>
  );
}