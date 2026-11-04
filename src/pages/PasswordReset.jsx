import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <section className="login-container">
      <div className="login-box">
        <h1>MABOTE GROUP HOLDINGS</h1>
        <h2>Reset Password</h2>
        <p className="login-help-message">
          Password reset links are no longer used. Go to login and request a
          verification code to reset your password.
        </p>
        <button type="button" onClick={() => navigate("/login")}>
          GO TO LOGIN
        </button>
      </div>
    </section>
  );
}
