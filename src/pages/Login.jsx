import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(
    searchParams.get("reset") === "1"
  );
  const [resetMethod, setResetMethod] = useState("current-password");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("maboteAuthToken", result.token);
      localStorage.setItem("maboteAccount", JSON.stringify(result.account));
      navigate(["Admin", "Management"].includes(result.account?.role) ? "/admin" : "/portal");
    } catch (error) {
      if (error.status === 401) {
        alert(
          "We could not log you in. Check your email and password, or create an account first."
        );
      } else {
        alert(error.message);
      }
    }
  };

  const handlePasswordResetRequest = async (event) => {
    event?.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const result = await apiRequest("/api/auth/password-reset-requests", {
        method: "POST",
        body: JSON.stringify({
          email: resetEmail.trim(),
        }),
      });

      setResetMessage(
        result.message ||
          "If an account exists for that email, a verification code will be sent."
      );
      setResetCodeSent(true);
    } catch (error) {
      setResetError(error.message || "Unable to reset your password.");
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const result = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: resetEmail.trim(),
          code: resetCode.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      setEmail(resetEmail.trim());
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
      setResetCodeSent(false);
      setShowResetForm(false);
      setResetMessage(result.message || "Password updated successfully. You can now log in.");
    } catch (error) {
      setResetError(error.message || "Unable to reset your password.");
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordChangeWithoutCode = async (event) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const result = await apiRequest("/api/auth/change-password-with-current-password", {
        method: "POST",
        body: JSON.stringify({
          email: resetEmail.trim(),
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      setEmail(resetEmail.trim());
      setPassword("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowResetForm(false);
      setResetMessage(result.message || "Password changed successfully. You can now log in.");
    } catch (error) {
      setResetError(error.message || "Unable to change your password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <img src="/mabote-logo.svg" alt="MABOTE GROUP" className="login-logo" />

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
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
                setShowPassword(event.target.checked)
              }
            />

            Show Password
          </label>

          <button type="submit">
            LOGIN
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            const opening = !showResetForm;
            setResetEmail(email);
            setResetCode("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setResetCodeSent(false);
            setResetMethod("current-password");
            setResetError("");
            setResetMessage("");
            setShowResetForm(opening);
          }}
        >
          {showResetForm ? "CLOSE PASSWORD RESET" : "RESET PASSWORD"}
        </button>

        {showResetForm && (
          <form
            onSubmit={
              resetMethod === "current-password"
                ? handlePasswordChangeWithoutCode
                : resetCodeSent
                  ? handlePasswordReset
                  : handlePasswordResetRequest
            }
            style={{ marginTop: "16px" }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setResetMethod("current-password");
                  setResetCodeSent(false);
                  setResetCode("");
                  setCurrentPassword("");
                  setResetError("");
                  setResetMessage("");
                }}
                disabled={resetLoading}
              >
                USE CURRENT PASSWORD
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetMethod("email-code");
                  setResetCodeSent(false);
                  setResetCode("");
                  setCurrentPassword("");
                  setResetError("");
                  setResetMessage("");
                }}
                disabled={resetLoading}
              >
                I FORGOT MY PASSWORD
              </button>
            </div>

            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              autoComplete="email"
              readOnly={resetMethod === "email-code" && resetCodeSent}
              required
            />

            {resetMethod === "current-password" ? (
              <>
                <p className="login-help-message">
                  No email code is needed. Enter your current password to verify your account and set a new one.
                </p>

                <label htmlFor="reset-current-password">Current Password</label>
                <input
                  id="reset-current-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />

                <label htmlFor="reset-new-password">New Password</label>
                <input
                  id="reset-new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />

                <label htmlFor="reset-confirm-password">Confirm New Password</label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </>
            ) : resetCodeSent ? (
              <>
                <p className="login-help-message">
                  Enter the 6-digit verification code sent to your email, then choose a new password.
                </p>

                <label htmlFor="reset-code">Verification Code</label>
                <input
                  id="reset-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(event) =>
                    setResetCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                />

                <label htmlFor="reset-new-password">New Password</label>
                <input
                  id="reset-new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />

                <label htmlFor="reset-confirm-password">Confirm New Password</label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </>
            ) : null}

            <button
              type="submit"
              style={{ marginTop: "12px" }}
              disabled={resetLoading}
            >
              {resetLoading
                ? resetMethod === "current-password" || resetCodeSent
                  ? "UPDATING..."
                  : "SENDING CODE..."
                : resetMethod === "current-password"
                  ? "CHANGE PASSWORD"
                  : resetCodeSent
                    ? "RESET PASSWORD"
                    : "SEND VERIFICATION CODE"}
            </button>

            {resetMethod === "email-code" && resetCodeSent && (
              <button
                type="button"
                onClick={handlePasswordResetRequest}
                disabled={resetLoading}
              >
                RESEND CODE
              </button>
            )}
          </form>
        )}

        {resetMessage && (
          <p style={{ color: "#0b7a35", marginTop: "12px", fontWeight: 700 }}>{resetMessage}</p>
        )}

        {resetError && (
          <p style={{ color: "#a61d1d", marginTop: "12px", fontWeight: 700 }}>{resetError}</p>
        )}

        <p>Don't have an account?</p>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          CREATE ACCOUNT
        </button>
      </div>
    </section>
  );
}