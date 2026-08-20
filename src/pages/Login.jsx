import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getSavedAccount = () => {
    const savedAccount = localStorage.getItem("maboteAccount");

    if (!savedAccount) {
      return null;
    }

    try {
      return JSON.parse(savedAccount);
    } catch (error) {
      localStorage.removeItem("maboteAccount");
      return null;
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const account = getSavedAccount();

    if (!account) {
      alert(
        "No MABOTE GROUP account was found. Please create an account first."
      );

      navigate("/register");
      return;
    }

    const enteredEmail = email.trim().toLowerCase();
    const savedEmail = String(account.email || "")
      .trim()
      .toLowerCase();

    const savedPassword = String(account.password || "");

    if (
      enteredEmail === savedEmail &&
      password === savedPassword
    ) {
      localStorage.setItem("maboteLoggedIn", "true");

      alert("Login successful!");

      navigate("/admin");
      return;
    }

    alert("Incorrect email or password.");
  };

  const handleForgotPassword = () => {
    const account = getSavedAccount();

    if (!account) {
      alert(
        "No MABOTE GROUP account was found. Please create an account first."
      );

      navigate("/register");
      return;
    }

    const resetEmail = window.prompt(
      "Enter your registered email address:"
    );

    if (!resetEmail) {
      return;
    }

    const registeredEmail = String(account.email || "")
      .trim()
      .toLowerCase();

    if (
      resetEmail.trim().toLowerCase() !==
      registeredEmail
    ) {
      alert("That email address is not registered.");
      return;
    }

    const newPassword = window.prompt(
      "Enter your new password (minimum 6 characters):"
    );

    if (!newPassword) {
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    account.password = newPassword;

    localStorage.setItem(
      "maboteAccount",
      JSON.stringify(account)
    );

    alert(
      "Password changed successfully.\n\nYou can now login with your new password."
    );
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>MABOTE GROUP</h1>

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
          onClick={handleForgotPassword}
        >
          FORGOT PASSWORD?
        </button>

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