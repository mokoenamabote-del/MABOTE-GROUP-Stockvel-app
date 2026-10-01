import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact-page">
      <div className="contact-container">

        <div className="contact-heading">
          <span>CONTACT MABOTE GROUP HOLDINGS</span>

          <h1>
            We are here to
            <br />
            <strong>assist you.</strong>
          </h1>

          <p>
            Have a question about membership, packages or
            how MABOTE GROUP HOLDINGS works? Send us a message and
            our team will assist you.
          </p>
        </div>

        <div className="contact-grid">

          <div className="contact-info">

            <div className="contact-info-card">
              <div className="contact-icon">☎</div>

              <div>
                <h3>Phone</h3>
                <p>Contact MABOTE GROUP HOLDINGS for assistance.</p>
                <a href="tel:+27663331151">
                  +27 66 333 1151
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">✉</div>

              <div>
                <h3>Email</h3>
                <p>Send us your enquiry by email.</p>
                <a href="mailto:info@mabotegroup.co.za">
                  info@mabotegroup.co.za
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">⌂</div>

              <div>
                <h3>Location</h3>
                <p>
                  MABOTE GROUP HOLDINGS
                  <br />
                  South Africa
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">◷</div>

              <div>
                <h3>Business Hours</h3>
                <p>
                  Monday – Friday
                  <br />
                  08:00 – 17:00
                </p>
              </div>
            </div>

          </div>

          <div className="contact-form-card">

            <h2>Send Us a Message</h2>

            <p>
              Complete the form below and we will respond
              as soon as possible.
            </p>

            {submitted ? (
              <div className="contact-success">

                <div className="success-icon">✓</div>

                <h3>Message Received</h3>

                <p>
                  Thank you for contacting MABOTE GROUP HOLDINGS.
                  Your enquiry has been submitted.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>

              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                <div className="form-row">

                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    placeholder="What can we help you with?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows="6"
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                >
                  Send Message
                </button>

              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
