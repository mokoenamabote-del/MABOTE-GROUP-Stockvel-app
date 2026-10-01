import React from "react";
import { Link } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Register",
    text: "Complete your member application with the required personal and contact information.",
  },
  {
    number: "02",
    title: "Choose a Plan",
    text: "Select a funeral grocery package that fits your needs and budget.",
  },
  {
    number: "03",
    title: "Contribute",
    text: "Maintain your monthly contributions according to the selected package terms.",
  },
  {
    number: "04",
    title: "Stay Prepared",
    text: "Keep your details updated and understand the support process whenever needed.",
  },
];

export default function HowItWorks() {
  return (
    <div className="how-page">
      <header className="how-header">
        <div className="how-container header-row">
          <Link to="/" className="how-brand">
            <span className="brand-mark">MG</span>
            <div>
              <strong>MABOTE</strong>
              <small>GROUP</small>
            </div>
          </Link>

          <nav className="how-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/how-it-works" className="active">How It Works</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="how-actions">
            <Link to="/login" className="secondary-link">Member Login</Link>
            <Link to="/register" className="primary-link">Join Now</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="how-hero">
          <div className="how-container hero-layout">
            <div>
              <span className="eyebrow">HOW IT WORKS</span>
              <h1>Simple steps for a safer future.</h1>
              <p>
                MABOTE GROUP HOLDINGS makes membership simple and clear so members can prepare in a
                structured, organised way.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="primary-link">Become a Member</Link>
                <Link to="/register" className="outline-link">Apply Now</Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="card-badge">MEMBERSHIP</div>
              <h3>Prepared families build strong communities.</h3>
              <p>From registration to monthly contributions, every step is designed to be clear.</p>
            </div>
          </div>
        </section>

        <section className="how-steps">
          <div className="how-container">
            <div className="section-heading">
              <span>OUR PROCESS</span>
              <h2>Four easy steps.</h2>
            </div>

            <div className="steps-grid">
              {steps.map((step) => (
                <article key={step.number} className="step-card">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="info-panel">
          <div className="how-container two-column">
            <div>
              <span className="eyebrow dark">WHY THIS MATTERS</span>
              <h2>Planning ahead brings peace of mind.</h2>
              <p>
                A structured membership approach helps people prepare responsibly instead of waiting
                until a difficult moment arrives.
              </p>
            </div>

            <div className="info-box">
              <h3>What members should know</h3>
              <ul>
                <li>Review package terms before joining.</li>
                <li>Keep your personal details current.</li>
                <li>Maintain regular contributions as required.</li>
                <li>Understand the support process before you need it.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
