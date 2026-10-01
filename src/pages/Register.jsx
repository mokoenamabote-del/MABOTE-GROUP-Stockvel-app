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

      alert("MABOTE GROUP HOLDINGS account created successfully. You can now log in.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #061a3a 0%, #0a2f6c 50%, #102d5f 100%)",
        padding: "40px 20px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "20px",
          border: "1px solid rgba(212,175,55,0.4)",
          boxShadow: "0 28px 60px rgba(6, 25, 58, 0.28)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0b2a5b 0%, #12397a 100%)",
            color: "#fff",
            padding: "26px 30px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#d9b553", fontWeight: 800 }}>MABOTE GROUP HOLDINGS</div>
          <h1 style={{ margin: "12px 0 0", fontSize: "2.2rem", letterSpacing: "-1px" }}>Create Your Account</h1>
        </div>

        <div style={{ padding: "30px" }}>
          <div style={{ marginBottom: "20px", color: "#53657d", lineHeight: 1.7 }}>
            Join a structured funeral grocery stockvel and prepare with confidence for the future.
          </div>

          <form onSubmit={handleRegister} style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
              <div>
                <label htmlFor="fullName" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#163465" }}>Full Name</label>
                <input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="given-name" required style={inputStyle} />
              </div>

              <div>
                <label htmlFor="surname" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#163465" }}>Surname</label>
                <input id="surname" type="text" placeholder="Enter your surname" value={surname} onChange={(event) => setSurname(event.target.value)} autoComplete="family-name" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#163465" }}>Email Address</label>
              <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required style={inputStyle} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
              <div>
                <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#163465" }}>Password</label>
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Create password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={6} required style={inputStyle} />
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#163465" }}>Confirm Password</label>
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={6} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2e4563", cursor: "pointer" }}>
                <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
                Show Password
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2e4563", cursor: "pointer" }}>
                <input type="checkbox" checked={showConfirmPassword} onChange={(event) => setShowConfirmPassword(event.target.checked)} />
                Show Confirm Password
              </label>
            </div>

            <button type="submit" style={primaryButtonStyle}>Create Account</button>
          </form>

          <div style={{ textAlign: "center", marginTop: "22px", color: "#465b77" }}>
            Already have an account?
            <button type="button" onClick={() => navigate("/login")} style={{ ...secondaryButtonStyle, marginLeft: "10px" }}>Login</button>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 14px",
  borderRadius: "10px",
  border: "1px solid #dfe6ef",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: "#10233f",
};

const primaryButtonStyle = {
  padding: "15px 18px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(180deg, #d7aa3c 0%, #bf8f1b 100%)",
  color: "#fff",
  fontWeight: 800,
  fontSize: "15px",
  letterSpacing: "0.04em",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #d7aa3c",
  background: "transparent",
  color: "#10233f",
  cursor: "pointer",
  fontWeight: 700,
};