import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

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

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");

    try {
      const result = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: resetEmail.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      setResetMessage(result.message || "Password updated successfully.");
      setShowResetForm(false);
      setEmail(resetEmail.trim());
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setResetError(error.message || "Unable to reset your password.");
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
            setResetEmail(email);
            setResetError("");
            setResetMessage("");
            setShowResetForm((current) => !current);
          }}
        >
          {showResetForm ? "CLOSE PASSWORD RESET" : "FORGOT PASSWORD?"}
        </button>

        {showResetForm && (
          <form onSubmit={handlePasswordReset} style={{ marginTop: "16px" }}>
            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />

            <button type="submit" style={{ marginTop: "12px" }}>
              RESET PASSWORD
            </button>
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