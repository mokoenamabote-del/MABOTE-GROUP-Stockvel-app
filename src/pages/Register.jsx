import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    const cleanFullName = fullName.trim();
    const cleanSurname = surname.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullName || !cleanSurname) {
      alert("Please enter your full name and surname.");
      return;
    }

    if (!cleanEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: cleanFullName,
          surname: cleanSurname,
          email: cleanEmail,
          password,
        }),
      });

      alert("MABOTE GROUP account created successfully. You can now log in.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>MABOTE GROUP</h1>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <label htmlFor="fullName">
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            autoComplete="given-name"
            required
          />

          <label htmlFor="surname">
            Surname
          </label>

          <input
            id="surname"
            type="text"
            placeholder="Enter your surname"
            value={surname}
            onChange={(event) =>
              setSurname(event.target.value)
            }
            autoComplete="family-name"
            required
          />

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
            placeholder="Create password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength={6}
            required
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
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

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            autoComplete="new-password"
            minLength={6}
            required
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showConfirmPassword}
              onChange={(event) =>
                setShowConfirmPassword(
                  event.target.checked
                )
              }
            />

            Show Confirm Password
          </label>

          <button type="submit">
            CREATE ACCOUNT
          </button>
        </form>

        <p>Already have an account?</p>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>
      </div>
    </section>
  );
}