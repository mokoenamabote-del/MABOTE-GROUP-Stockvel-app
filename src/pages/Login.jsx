import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { saveAuthSession } from "../lib/auth";
import "./Auth.css";

const ADMIN_EMAIL = "info@mabotegroup.co.za";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveAuthSession(result.token, keepLoggedIn, keepLoggedIn ? 36500 : 0);
      navigate("/admin");
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

  const handleForgotPassword = () => {
    const requestedEmail = email.trim() || "[enter my email address]";
    const subject = encodeURIComponent("MABOTE GROUP HOLDINGS password reset request");
    const body = encodeURIComponent(
      `Hello MABOTE GROUP HOLDINGS administrator,\n\nPlease help me reset the password for: ${requestedEmail}\n\nThank you.`
    );

    setForgotMessage(
      `Please email ${ADMIN_EMAIL} to request a password reset. Your email address has been included in the request.`
    );

    if (navigator.clipboard) {
      navigator.clipboard.writeText(ADMIN_EMAIL).catch(() => {});
    }

    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-brand">
            <div className="auth-brand-mark">MG</div>
            <div className="auth-brand-text">
              <strong>MABOTE</strong>
              <span>GROUP</span>
            </div>
          </div>

          <h2>
            Prepare today.<br />
            <span>Support tomorrow.</span>
          </h2>

          <p>
            Access your stockvel account and keep your contributions organised,
            secure and on track with meaningful family preparation.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <strong>3</strong>
              <span>Plans</span>
            </div>
            <div className="auth-stat">
              <strong>R80</strong>
              <span>Join fee</span>
            </div>
            <div className="auth-stat">
              <strong>∞</strong>
              <span>Access</span>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-header">
            <span>Member portal</span>
            <h3>Welcome back</h3>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <label htmlFor="email">
              Email Address
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <label className="auth-check">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              Show Password
            </label>

            <label className="auth-check">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(event) => setKeepLoggedIn(event.target.checked)}
              />
              Keep me logged in permanently
            </label>

            <button type="submit" className="auth-primary-btn">
              Login to Dashboard
            </button>
          </form>

          <button type="button" className="auth-forgot" onClick={handleForgotPassword}>
            Contact admin for password reset
          </button>

          {forgotMessage && <p className="login-help-message">{forgotMessage}</p>}

          <div className="auth-note">
            Don’t have an account? <button type="button" onClick={() => navigate("/register")}>Create one</button>
          </div>
        </div>
      </div>
    </section>
  );
}