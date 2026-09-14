import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">

      {/* HEADER */}
      <header className="about-header">
        <div className="about-logo">
          <span className="about-logo-mark">MG</span>
          <div>
            <strong>MABOTE GROUP</strong>
            <small>Funeral Grocery Stockvel</small>
          </div>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About Us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/membership">Membership</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="about-header-actions">
          <Link to="/login" className="about-login">Member Login</Link>
          <Link to="/register" className="about-join">Join Now</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-kicker">ABOUT MABOTE GROUP</span>

          <h1>
            Preparing today
            <br />
            for tomorrow's needs.
          </h1>

          <p>
            MABOTE GROUP is a community-focused funeral grocery stockvel
            designed to help members prepare for important family needs
            through structured membership and grocery support.
          </p>

          <div className="about-hero-buttons">
            <Link to="/register" className="gold-btn">
              Become a Member
            </Link>

            <Link to="/how-it-works" className="outline-btn">
              How It Works
            </Link>
          </div>
        </div>

        <div className="about-hero-card">
          <div className="about-monogram">MG</div>
          <h3>MABOTE GROUP</h3>
          <p>Plan Ahead • Share Today • Support Tomorrow</p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section">
        <div className="about-section-heading">
          <span>WHO WE ARE</span>
          <h2>Built around preparation, support and community.</h2>
        </div>

        <div className="about-two-column">
          <div>
            <p>
              MABOTE GROUP provides a structured funeral grocery stockvel
              approach for individuals and families who want to prepare
              financially and practically for funeral-related grocery needs.
            </p>

            <p>
              Our approach is based on collective participation, clear
              membership arrangements and practical support when qualifying
              needs arise.
            </p>

            <p>
              We believe that preparation can reduce pressure on families
              during difficult times and help communities support one
              another with dignity.
            </p>
          </div>

          <div className="about-highlight">
            <span>OUR PURPOSE</span>
            <h3>
              To make preparation simpler, clearer and more organised for
              our members and their families.
            </h3>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-mission">
        <div className="mission-card">
          <div className="mission-icon">01</div>
          <span>OUR MISSION</span>
          <h3>Practical support when families need it most.</h3>
          <p>
            To provide a reliable and organised membership platform that
            helps members plan for funeral grocery needs while promoting
            responsibility, transparency and community support.
          </p>
        </div>

        <div className="mission-card featured">
          <div className="mission-icon">02</div>
          <span>OUR VISION</span>
          <h3>A stronger community prepared for tomorrow.</h3>
          <p>
            We aim to build a trusted community where members can plan ahead,
            participate responsibly and access structured support according
            to their membership terms.
          </p>
        </div>
      </section>

      {/* WHAT WE STAND FOR */}
      <section className="about-values">
        <div className="about-section-heading center">
          <span>WHAT WE STAND FOR</span>
          <h2>Our values guide the way we serve.</h2>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-number">01</div>
            <h3>Integrity</h3>
            <p>
              We believe in honest communication and responsible
              administration.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">02</div>
            <h3>Transparency</h3>
            <p>
              Members should understand their membership, contributions and
              applicable terms.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">03</div>
            <h3>Community</h3>
            <p>
              We believe collective participation can create meaningful
              support for families.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">04</div>
            <h3>Service</h3>
            <p>
              We aim to provide a professional and respectful member
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="about-approach">
        <div className="approach-content">
          <span>OUR APPROACH</span>

          <h2>
            Simple membership.
            <br />
            Clear expectations.
            <br />
            Community support.
          </h2>

          <p>
            From joining MABOTE GROUP to managing your membership and
            understanding available support, our goal is to keep the process
            straightforward and easy to understand.
          </p>

          <Link to="/how-it-works" className="gold-btn">
            Learn How It Works
          </Link>
        </div>

        <div className="approach-points">
          <div>
            <strong>01</strong>
            <span>Choose a suitable membership package</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Complete your membership information</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Maintain your membership contributions</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Receive support according to the applicable terms</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <span>JOIN THE COMMUNITY</span>

        <h2>
          Prepare today.
          <br />
          Support tomorrow.
        </h2>

        <p>
          Explore our packages or start your MABOTE GROUP membership today.
        </p>

        <div>
          <Link to="/packages" className="outline-btn light">
            View Packages
          </Link>

          <Link to="/register" className="gold-btn">
            Join MABOTE GROUP
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <div>
          <strong>MABOTE GROUP</strong>
          <p>Funeral Grocery Stockvel</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/membership">Membership</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} MABOTE GROUP. All rights reserved.
        </p>
      </footer>

    </div>
  );
}