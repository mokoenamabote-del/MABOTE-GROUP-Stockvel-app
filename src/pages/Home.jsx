import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const whatsappLink = "https://wa.me/27663331151";
const contactEmail = "info@mabote-group.co.za";

export default function Home() {
  return (
    <div className="mabote-home">

      {/* ================= HEADER ================= */}
      <header className="home-header">
        <div className="home-container header-inner">

          <Link to="/" className="brand">
            <span className="brand-name">MABOTE</span>
            <span className="brand-group">GROUP</span>
          </Link>

          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            <Link to="/login" className="login-button">
              Member Login
            </Link>

            <Link to="/register" className="join-button">
              Become a Member
            </Link>
          </div>

        </div>
      </header>


      <main>

        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="hero-glow hero-glow-one"></div>
          <div className="hero-glow hero-glow-two"></div>

          <div className="home-container hero-content">

            <div className="hero-text">

              <div className="hero-kicker">
                <span className="kicker-line"></span>
                FUNERAL GROCERY STOCKVEL
              </div>

              <span className="hero-label">
                MABOTE GROUP HOLDINGS
              </span>

              <h1>
                Prepare Today.
                <br />
                <span>Support Tomorrow.</span>
              </h1>

              <p className="hero-lead">
                A structured funeral grocery membership approach
                designed to help families plan ahead and prepare
                for qualifying funeral grocery needs.
              </p>

              <div className="hero-buttons">
                <Link to="/register" className="primary-button">
                  Become a Member
                  <span>→</span>
                </Link>

                <Link to="/packages" className="secondary-button">
                  View Plans
                </Link>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Structured Membership</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Family Focused</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Community Driven</span>
                </div>
              </div>

            </div>


            {/* HERO FEATURE CARD */}
            <div className="hero-visual">

              <div className="hero-card">

                <div className="hero-card-top">
                  <div>
                    <span className="small-label">
                      MABOTE GROUP HOLDINGS
                    </span>

                    <strong>
                      FAMILY PREPARATION
                    </strong>
                  </div>

                  <div className="hero-card-mark">
                    MG
                  </div>
                </div>

                <div className="hero-card-content">

                  <div className="premium-circle">
                    <div className="circle-inner">
                      MG
                    </div>
                  </div>

                  <span className="card-eyebrow">
                    PLAN AHEAD
                  </span>

                  <h2>
                    Preparation brings
                    <br />
                    <span>peace of mind.</span>
                  </h2>

                  <p>
                    Build a structured membership plan today
                    so your family can be better prepared for
                    qualifying funeral grocery needs.
                  </p>

                  <Link
                    to="/how-it-works"
                    className="card-link"
                  >
                    See the Process →
                  </Link>

                </div>

                <div className="hero-card-footer">
                  <span>PLAN</span>
                  <span>PREPARE</span>
                  <span>SUPPORT</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ================= INTRO ================= */}
        <section className="intro-section">

          <div className="home-container">

            <div className="intro-grid">

              <div className="section-heading">

                <span>WELCOME TO MABOTE GROUP HOLDINGS</span>

                <h2>
                  Planning for tomorrow
                  <br />
                  <strong>starts today.</strong>
                </h2>

              </div>

              <div className="intro-copy">
                <p>
                  MABOTE GROUP HOLDINGS is built around a simple principle:
                  families should have an opportunity to prepare
                  before difficult circumstances arise.
                </p>

                <p>
                  Our funeral grocery stockvel approach provides
                  structured membership packages that help members
                  plan, contribute and prepare according to the
                  applicable membership terms.
                </p>

                <Link to="/about" className="text-link">
                  Learn More About MABOTE GROUP HOLDINGS →
                </Link>
              </div>

            </div>


            {/* BENEFITS */}
            <div className="benefit-grid">

              <div className="benefit-card">
                <div className="benefit-top">
                  <span className="benefit-number">01</span>
                  <span className="benefit-symbol">◆</span>
                </div>

                <h3>Plan Ahead</h3>

                <p>
                  Give yourself and your family a structured
                  way to prepare for future funeral grocery needs.
                </p>
              </div>


              <div className="benefit-card featured-benefit">
                <div className="benefit-top">
                  <span className="benefit-number">02</span>
                  <span className="benefit-symbol">◆</span>
                </div>

                <h3>Choose Your Package</h3>

                <p>
                  Review the available membership options and
                  select the package that best suits your needs.
                </p>
              </div>


              <div className="benefit-card">
                <div className="benefit-top">
                  <span className="benefit-number">03</span>
                  <span className="benefit-symbol">◆</span>
                </div>

                <h3>Stay Prepared</h3>

                <p>
                  Maintain your membership contributions and
                  follow the applicable membership requirements.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ================= STATS ================= */}
        <section className="stats-section">
          <div className="home-container">
            <div className="stats-grid">
              <div className="stat-card">
                <strong>3</strong>
                <span>Membership Plans</span>
              </div>

              <div className="stat-card">
                <strong>R80</strong>
                <span>Registration Fee</span>
              </div>

              <div className="stat-card">
                <strong>4</strong>
                <span>Simple Steps</span>
              </div>

              <div className="stat-card">
                <strong>100%</strong>
                <span>Prepared Support</span>
              </div>
            </div>
          </div>
        </section>


        {/* ================= SERVICES ================= */}
        <section className="services-section">

          <div className="home-container">

            <div className="section-heading centered">

              <span>WHAT WE OFFER</span>

              <h2>
                Structured support for
                <br />
                <strong>family preparation.</strong>
              </h2>

              <p>
                MABOTE GROUP HOLDINGS brings together practical membership
                options designed around preparation, planning and
                funeral grocery support.
              </p>

            </div>


            <div className="services-grid">

              <div className="service-card">
                <div className="service-icon">01</div>

                <h3>Funeral Grocery Support</h3>

                <p>
                  Membership packages are structured around
                  qualifying funeral grocery requirements.
                </p>

                <Link to="/packages">
                  Explore Plans →
                </Link>
              </div>


              <div className="service-card">
                <div className="service-icon">02</div>

                <h3>Family Preparation</h3>

                <p>
                  Plan ahead and give your household a more
                  organised approach to difficult circumstances.
                </p>

                <Link to="/how-it-works">
                  See the Process →
                </Link>
              </div>


              <div className="service-card">
                <div className="service-icon">03</div>

                <h3>Membership Management</h3>

                <p>
                  Members can register, maintain their information
                  and access their membership journey.
                </p>

                <Link to="/membership">
                  Membership Overview →
                </Link>
              </div>


              <div className="service-card">
                <div className="service-icon">04</div>

                <h3>Community Focus</h3>

                <p>
                  We believe responsible preparation can strengthen
                  families and communities.
                </p>

                <Link to="/about">
                  About MABOTE →
                </Link>
              </div>

            </div>

          </div>

        </section>


        {/* ================= WHY MABOTE ================= */}
        <section className="why-section">

          <div className="home-container">

            <div className="why-grid">

              <div className="why-title">

                <span>WHY MABOTE GROUP HOLDINGS?</span>

                <h2>
                  Built around
                  <br />
                  <strong>people, planning &amp; trust.</strong>
                </h2>

                <p>
                  Our approach is centred on helping members
                  understand their membership and prepare
                  responsibly.
                </p>

                <Link to="/about" className="primary-button">
                  Learn More
                </Link>

              </div>


              <div className="why-list">

                <div className="why-item">
                  <div className="why-icon">✓</div>

                  <div>
                    <h3>Family Focused</h3>

                    <p>
                      We place family preparation at the centre
                      of our membership approach.
                    </p>
                  </div>
                </div>


                <div className="why-item">
                  <div className="why-icon">✓</div>

                  <div>
                    <h3>Clear Membership Options</h3>

                    <p>
                      Members can review available packages and
                      understand the applicable membership terms.
                    </p>
                  </div>
                </div>


                <div className="why-item">
                  <div className="why-icon">✓</div>

                  <div>
                    <h3>Responsible Planning</h3>

                    <p>
                      We encourage members to prepare in advance
                      rather than wait until a crisis occurs.
                    </p>
                  </div>
                </div>


                <div className="why-item">
                  <div className="why-icon">✓</div>

                  <div>
                    <h3>Professional Approach</h3>

                    <p>
                      Our goal is to provide members with clear
                      information and a professional experience.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= PACKAGES ================= */}
        <section className="packages-preview">

          <div className="home-container">

            <div className="section-heading centered">

              <span>OUR MEMBERSHIP PACKAGES</span>

              <h2>
                Choose the option
                <br />
                <strong>that suits your needs.</strong>
              </h2>

              <p>
                Explore the available MABOTE GROUP HOLDINGS funeral grocery
                membership packages and review the applicable
                benefits and requirements.
              </p>

            </div>


            <div className="package-preview-grid">

              <div className="package-preview-card">

                <div className="package-card-head">
                  <span>PLAN A</span>
                  <strong>01</strong>
                </div>

                <h3>Super Grocery</h3>

                <p>
                  A grocery-focused membership option designed
                  around qualifying funeral grocery needs.
                </p>

                <div className="package-inclusions" aria-label="Plan A includes">
                  <span>Vegetables</span>
                  <span>Meat cutter</span>
                  <span>Catering equipment</span>
                </div>

                <Link to="/packages">
                  Explore Plan →
                </Link>

              </div>


              <div className="package-preview-card featured">

                <div className="featured-ribbon">
                  POPULAR OPTION
                </div>

                <div className="package-card-head">
                  <span>PLAN B</span>
                  <strong>02</strong>
                </div>

                <h3>Executive</h3>

                <p>
                  An enhanced membership option with additional
                  support according to the applicable package terms.
                </p>

                <div className="package-inclusions" aria-label="Plan B includes">
                  <span>Cow</span>
                  <span>Mobile toilet</span>
                  <span>Vegetables</span>
                </div>

                <Link to="/packages">
                  Compare Packages →
                </Link>

              </div>


              <div className="package-preview-card">

                <div className="package-card-head">
                  <span>PLAN C</span>
                  <strong>03</strong>
                </div>

                <h3>Custom Support</h3>

                <p>
                  A flexible option for members who require a
                  different package structure.
                </p>

                <div className="package-inclusions" aria-label="Plan C includes">
                  <span>Cow</span>
                  <span>Mobile toilet</span>
                  <span>Full catering</span>
                </div>

                <Link to="/packages">
                  Explore Plan →
                </Link>

              </div>

            </div>


            <div className="center-button">

              <Link
                to="/packages"
                className="primary-button"
              >
                Compare Plans →
              </Link>

            </div>

          </div>

        </section>


        {/* ================= PRICING ================= */}
        <section className="pricing-section">
          <div className="home-container">
            <div className="section-heading centered">
              <span>OUR PACKAGES</span>

              <h2>
                Flexible options for
                <br />
                <strong>every stage of life.</strong>
              </h2>

              <p>
                Choose a membership structure that matches your household goals and level of preparation.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <div className="pricing-header">
                  <span>PLAN A</span>
                  <h3>Essential</h3>
                </div>

                <div className="price-box">
                  <strong>R300</strong>
                  <small>Package price</small>
                </div>

                <ul>
                  <li>Funeral grocery essentials</li>
                  <li>Household support items</li>
                  <li>Member preparation focus</li>
                </ul>

                <Link to="/packages" className="pricing-button">View Plan</Link>
              </article>

              <article className="pricing-card featured-pricing">
                <div className="pricing-badge">Most Popular</div>

                <div className="pricing-header">
                  <span>PLAN B</span>
                  <h3>Executive</h3>
                </div>

                <div className="price-box">
                  <strong>R350</strong>
                  <small>Package price</small>
                </div>

                <ul>
                  <li>Expanded grocery support</li>
                  <li>Cow and toilet support</li>
                  <li>Enhanced family coverage</li>
                </ul>

                <Link to="/packages" className="pricing-button">View Package</Link>
              </article>

              <article className="pricing-card">
                <div className="pricing-header">
                  <span>PLAN C</span>
                  <h3>Premium</h3>
                </div>

                <div className="price-box">
                  <strong>R450</strong>
                  <small>Package price</small>
                </div>

                <ul>
                  <li>Premium catering support</li>
                  <li>Additional family support</li>
                  <li>More complete preparation</li>
                </ul>

                <Link to="/packages" className="pricing-button">View Package</Link>
              </article>
            </div>
          </div>
        </section>


        {/* ================= FAQ ================= */}
        <section className="faq-section">
          <div className="home-container faq-grid">
            <div className="section-heading">
              <span>GOOD TO KNOW</span>

              <h2>
                Clear answers before
                <br />
                <strong>you choose.</strong>
              </h2>

              <p>
                Understand the basics of membership, packages and
                the preparation process before you get started.
              </p>
            </div>

            <div className="faq-list">
              <details open>
                <summary>What does membership include?</summary>
                <p>
                  Membership includes the applicable grocery package and
                  additional benefits listed for the selected plan.
                </p>
              </details>

              <details>
                <summary>Which package is right for my family?</summary>
                <p>
                  Review the package contents and choose the option that
                  best matches your household preparation needs.
                </p>
              </details>

              <details>
                <summary>How do I become a member?</summary>
                <p>
                  Complete the registration form, review the package terms
                  and follow the applicable contribution process.
                </p>
              </details>
            </div>
          </div>
        </section>


        {/* ================= TESTIMONIALS ================= */}
        <section className="testimonials-section">
          <div className="home-container">
            <div className="section-heading centered">
              <span>WHAT MEMBERS SAY</span>

              <h2>
                Trusted by families who
                <br />
                <strong>value preparation.</strong>
              </h2>
            </div>

            <div className="testimonial-grid">
              <article className="testimonial-card">
                <p>
                  “The process feels organised and respectful. It gave my family a clearer way to prepare.”
                </p>
                <div className="testimonial-meta">
                  <strong>Thabo M.</strong>
                  <span>Member</span>
                </div>
              </article>

              <article className="testimonial-card">
                <p>
                  “I liked how simple the membership options were to understand. It made planning easier.”
                </p>
                <div className="testimonial-meta">
                  <strong>Nomsa K.</strong>
                  <span>Member</span>
                </div>
              </article>

              <article className="testimonial-card">
                <p>
                  “The package information was clear, and the support approach felt practical and trustworthy.”
                </p>
                <div className="testimonial-meta">
                  <strong>James R.</strong>
                  <span>Subscriber</span>
                </div>
              </article>
            </div>
          </div>
        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section className="process-section">

          <div className="process-decoration process-decoration-one"></div>
          <div className="process-decoration process-decoration-two"></div>

          <div className="home-container">

            <div className="section-heading centered light-heading">

              <span>HOW IT WORKS</span>

              <h2>
                Four simple steps.
                <br />
                <strong>One prepared family.</strong>
              </h2>

              <p>
                Becoming a MABOTE GROUP HOLDINGS member follows a simple
                process designed to make registration and
                membership easier to understand.
              </p>

            </div>


            <div className="process-grid">

              <div className="process-step">
                <span className="process-number">01</span>

                <div className="process-line"></div>

                <h3>Register</h3>

                <p>
                  Complete your membership application with the
                  required information.
                </p>
              </div>


              <div className="process-step">
                <span className="process-number">02</span>

                <div className="process-line"></div>

                <h3>Select</h3>

                <p>
                  Choose the membership package that best suits
                  your needs and review its conditions.
                </p>
              </div>


              <div className="process-step">
                <span className="process-number">03</span>

                <div className="process-line"></div>

                <h3>Contribute</h3>

                <p>
                  Maintain the applicable monthly membership
                  contribution according to the package terms.
                </p>
              </div>


              <div className="process-step">
                <span className="process-number">04</span>

                <div className="process-line"></div>

                <h3>Stay Prepared</h3>

                <p>
                  Keep your membership information up to date
                  and follow the applicable procedures.
                </p>
              </div>

            </div>


            <div className="process-button">

              <Link
                to="/how-it-works"
                className="secondary-button"
              >
                See the Process →
              </Link>

            </div>

          </div>

        </section>


        {/* ================= VALUES ================= */}
        <section className="values-section">

          <div className="home-container">

            <div className="section-heading centered">

              <span>OUR APPROACH</span>

              <h2>
                What MABOTE GROUP HOLDINGS
                <br />
                <strong>stands for.</strong>
              </h2>

            </div>


            <div className="values-grid">

              <div className="value-card">
                <span>01</span>
                <h3>Integrity</h3>
                <p>
                  We value honest and clear communication
                  with our members.
                </p>
              </div>

              <div className="value-card">
                <span>02</span>
                <h3>Transparency</h3>
                <p>
                  Members should understand their package,
                  contributions and applicable requirements.
                </p>
              </div>

              <div className="value-card">
                <span>03</span>
                <h3>Service</h3>
                <p>
                  We aim to provide a professional and
                  supportive membership experience.
                </p>
              </div>

              <div className="value-card">
                <span>04</span>
                <h3>Community</h3>
                <p>
                  Strong communities begin with families
                  that prepare together.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="cta-section">

          <div className="cta-pattern"></div>

          <div className="home-container cta-content">

            <div className="cta-text">

              <span>START PREPARING TODAY</span>

              <h2>
                Your family.
                <br />
                Your preparation.
                <br />
                <strong>Your MABOTE GROUP HOLDINGS.</strong>
              </h2>

              <p>
                Take the first step toward structured funeral
                grocery preparation for your family.
              </p>

            </div>


            <div className="cta-buttons">

              <Link
                to="/register"
                className="primary-button"
              >
                Become a Member →
              </Link>

              <Link
                to="/contact"
                className="outline-button"
              >
                Talk to Us
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-button"
              >
                WhatsApp 0663331151
              </a>

            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="home-whatsapp-link"
            >
              <span className="whatsapp-qr-mark">WA</span>
              <span>
                <strong>Chat with MABOTE GROUP HOLDINGS</strong>
                <small>WhatsApp us on 0663331151</small>
                <small>{contactEmail}</small>
              </span>
            </a>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-gold-line"></div>

        <div className="home-container footer-grid">

          <div className="footer-brand">

            <Link to="/" className="brand">
              <span className="brand-name">MABOTE</span>
              <span className="brand-group">GROUP</span>
            </Link>

            <p className="footer-tagline">
              Prepare Today. Support Tomorrow.
            </p>

            <p className="footer-description">
              Funeral grocery stockvel membership focused on
              preparation, planning and community support.
            </p>

          </div>


          <div className="footer-links">

            <h4>Company</h4>

            <Link to="/about">About Us</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/contact">Contact Us</Link>

          </div>


          <div className="footer-links">

            <h4>Membership</h4>

            <Link to="/packages">Packages</Link>
            <Link to="/register">Join Now</Link>
            <Link to="/login">Member Login</Link>
            <Link to="/contact">Member Support</Link>

          </div>


          <div className="footer-links">

            <h4>Information</h4>

            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact</Link>

          </div>

        </div>


        <div className="footer-bottom">

          <div className="home-container footer-bottom-inner">

            <p>
              © {new Date().getFullYear()} MABOTE GROUP HOLDINGS.
              All rights reserved.
            </p>

            <p>
              Funeral Grocery Stockvel
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}