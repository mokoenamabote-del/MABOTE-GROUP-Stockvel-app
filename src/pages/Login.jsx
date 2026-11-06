
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const getRedirectPathByRole = (role) => {
    const attemptedPath = location.state?.from?.pathname;

    if (attemptedPath && attemptedPath !== "/login") {
      return attemptedPath;
    }

    if (role === "Member") {
      return "/client-portal";
    }

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
      localStorage.setItem(
        "maboteAccount",
        JSON.stringify(account)
      );

      navigate(getRedirectPathByRole(account.role), {
        replace: true,
      });

    } catch (err) {
      setError(
        err.message ||
        "Unable to log in. Check your email and password."
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

      <h2>MABOTE GROUP LOGIN</h2>

      {error && (
        <div
          role="alert"
          style={{
            color: "red",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          style={{
            color: "green",
            marginBottom: "1rem",
          }}
        >
          {message}
        </div>
      )}

      {!showReset ? (

        <>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) =>
                    setShowPassword(e.target.checked)
                  }
                />{" "}
                Show Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
              }}
            >
              {loading ? "Signing in..." : "LOGIN"}
            </button>

          </form>

          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              onClick={openPasswordReset}
              style={{
                width: "100%",
                padding: "0.65rem",
              }}
            >
              FORGOT PASSWORD?
            </button>
          </div>
        </>

      ) : (

        <div style={{ marginTop: "1rem" }}>

          <button
            type="button"
            onClick={closePasswordReset}
            style={{
              width: "100%",
              padding: "0.65rem",
            }}
          >
            BACK TO LOGIN
          </button>

          <h3>FORGOT PASSWORD</h3>

          <p>
            Password recovery is temporarily unavailable.
            A secure recovery service will be added to
            MABOTE GROUP.
          </p>

          <p>
            You will be able to create a new password
            without entering your current password.
          </p>

        </div>

      )}

      <div style={{ marginTop: "1.5rem" }}>
        Don't have an account?{" "}
        <Link to="/register">
          CREATE ACCOUNT
        </Link>
      </div>

    </div>
  );
}
