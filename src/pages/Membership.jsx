import React from "react";
import { Link } from "react-router-dom";
import "./Membership.css";

const benefits = [
  {
    number: "01",
    title: "Plan Ahead",
    text: "Prepare for future funeral grocery needs with a clear structure and regular contributions.",
  },
  {
    number: "02",
    title: "Structured Support",
    text: "Each membership package is designed to bring order, clarity, and practical support.",
  },
  {
    number: "03",
    title: "Community Care",
    text: "Members join a community-minded approach that focuses on dignity, care, and family support.",
  },
  {
    number: "04",
    title: "Simple Process",
    text: "From registration to contributor updates, the membership flow is designed to be easy to follow.",
  },
];

export default function Membership() {
  return (
    <div className="membership-page">
      <header className="membership-header">
        <div className="membership-container membership-nav">
          <Link to="/" className="membership-logo">
            <span className="logo-mark">MG</span>
            <span>
              <strong>MABOTE</strong>
              <small>GROUP</small>
            </span>
          </Link>

          <nav className="membership-menu">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/membership" className="active">Membership</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="membership-actions">
            <Link to="/login" className="login-button">Member Login</Link>
            <Link to="/register" className="join-button">Join Now</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="membership-hero">
          <div className="membership-container membership-hero-content">
            <div>
              <span className="membership-eyebrow">JOIN MABOTE GROUP PTY(LTD)</span>
              <h1>Become a <span>Member</span></h1>
              <p>
                Join a community-focused funeral grocery stockvel designed to help members prepare
                for difficult times through organised contributions and meaningful support.
              </p>

              <div className="membership-hero-buttons">
                <Link to="/register" className="gold-button">Register Now</Link>
                <Link to="/how-it-works" className="outline-button">How It Works</Link>
              </div>
            </div>

            <div className="membership-hero-card">
              <div className="hero-card-icon">MG</div>
              <h3>MABOTE GROUP PTY(LTD)</h3>
              <p>Funeral Grocery Stockvel</p>
              <div className="hero-card-line"></div>
              <strong>Plan Ahead • Share Today • Support Tomorrow</strong>
            </div>
          </div>
        </section>

        <section className="membership-fee-section">
          <div className="membership-container">
            <div className="fee-card">
              <div className="fee-icon">R</div>
              <div>
                <span>REGISTRATION FEE</span>
                <h2>R80</h2>
                <p>A once-off registration fee is required when joining MABOTE GROUP PTY(LTD).</p>
              </div>
              <Link to="/register" className="fee-button">Start Registration</Link>
            </div>
          </div>
        </section>

        <section className="membership-section">
          <div className="membership-container">
            <div className="section-heading">
              <span>WHY JOIN</span>
              <h2>Why become a MABOTE member?</h2>
              <p>Membership is about preparing together and supporting one another during difficult times.</p>
            </div>

            <div className="membership-benefits">
              {benefits.map((benefit) => (
                <div key={benefit.number} className="benefit-card">
                  <div className="benefit-number">{benefit.number}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="membership-light-section">
          <div className="membership-container two-column">
            <div className="info-box">
              <span className="section-label">MEMBERSHIP</span>
              <h2>Who can join?</h2>
              <p>
                MABOTE GROUP PTY(LTD) is designed for individuals and community members who want to prepare
                for funeral-related grocery support through a structured stockvel arrangement.
              </p>
              <ul>
                <li>Individuals who want to plan ahead</li>
                <li>Community members</li>
                <li>Families looking for organised support</li>
                <li>People committed to regular contributions</li>
              </ul>
            </div>

            <div className="info-highlight">
              <div className="highlight-symbol">✓</div>
              <h3>Membership commitment</h3>
              <p>Members are expected to provide accurate information and maintain their contributions.</p>
            </div>
          </div>
        </section>

        <section className="membership-cta">
          <div className="membership-container">
            <div>
              <span>READY TO PREPARE?</span>
              <h2>Take the first step toward a stronger future.</h2>
              <p>Become part of a group committed to responsibility, planning, and support.</p>
            </div>
            <Link to="/register" className="cta-button">Apply Now</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
