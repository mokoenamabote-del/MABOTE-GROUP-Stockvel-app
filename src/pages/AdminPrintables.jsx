import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminPrintables.css";

const whatsappNumber = "0663331151";
const whatsappLink = "https://wa.me/27663331151";
const whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappLink)}`;
const contactEmail = "info@mabotegroup.co.za";

const brochurePackages = [
  {
    name: "Plan A",
    title: "Full Grocery",
    price: "R300",
    description: "A complete funeral grocery package for practical, dependable catering support.",
    contents: ["Catering ingredients", "Baking supplies", "Drinks", "Clean-up material"],
    accent: "sun",
  },
  {
    name: "Plan B",
    title: "Full Grocery + Cow",
    price: "R350",
    description: "The full grocery package with added support for larger funeral gatherings.",
    contents: ["Everything in Plan A", "1 × Cow", "1 × Mobile toilet"],
    accent: "coral",
  },
  {
    name: "Plan C",
    title: "Premium Catering",
    price: "R450",
    description: "Our most complete option for families planning a full-service gathering.",
    contents: ["Everything in Plan B", "Additional catering items", "Premium support"],
    accent: "mint",
  },
];

const applicationSections = [
  {
    title: "1. Personal Details",
    fields: ["Full name", "Surname", "ID number", "Date of birth", "Gender", "Marital status"],
  },
  {
    title: "2. Contact Details",
    fields: ["Cellphone", "Alternative number", "Email address", "Residential address", "Town", "Postal code"],
  },
  {
    title: "3. Employment Details",
    fields: ["Employment status", "Occupation"],
  },
  {
    title: "4. Membership Plan",
    fields: ["Selected plan", "Monthly contribution", "Compulsory registration fee: R80"],
  },
];

function BlankLines({ count = 1 }) {
  return Array.from({ length: count }, (_, index) => (
    <span className="blank-line" key={index} />
  ));
}

export default function AdminPrintables() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDocument, setActiveDocument] = useState("application");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedDocument = params.get("doc");

    if (requestedDocument === "application" || requestedDocument === "claim" || requestedDocument === "flyer" || requestedDocument === "brochure") {
      setActiveDocument(requestedDocument);
    }
  }, [location.search]);

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="printables-page">
      <header className="printables-toolbar screen-only">
        <div>
          <p className="eyebrow">ADMIN DOCUMENT CENTRE</p>
          <h1>Print materials</h1>
          <p>Choose a document, then print or save it as a PDF.</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" onClick={() => navigate("/admin")} className="secondary-button">
            Dashboard
          </button>
          <button type="button" onClick={printDocument} className="primary-button">
            Print / Save PDF
          </button>
        </div>
      </header>

      <nav className="document-tabs screen-only" aria-label="Printable documents">
        <button
          type="button"
          className={activeDocument === "application" ? "active" : ""}
          onClick={() => setActiveDocument("application")}
        >
          Application form
        </button>
        <button
          type="button"
          className={activeDocument === "claim" ? "active" : ""}
          onClick={() => setActiveDocument("claim")}
        >
          Claim form
        </button>
        <button
          type="button"
          className={activeDocument === "flyer" ? "active" : ""}
          onClick={() => setActiveDocument("flyer")}
        >
          Promotional flyer
        </button>
        <button
          type="button"
          className={activeDocument === "brochure" ? "active" : ""}
          onClick={() => setActiveDocument("brochure")}
        >
          Tri-fold brochure
        </button>
      </nav>

      <main>
        <section className={`printable-document application-document ${activeDocument === "application" ? "active-document" : ""}`}>
          <div className="document-heading">
            <div>
              <p className="brand-kicker">MABOTE GROUP PTY(LTD)</p>
              <h2>Membership Application Form</h2>
              <p>Stockvel & funeral grocery scheme</p>
            </div>
            <div className="reference-box">Application no.: <BlankLines /></div>
          </div>

          {applicationSections.map((section) => (
            <section className="form-section" key={section.title}>
              <h3>{section.title}</h3>
              <div className="field-grid">
                {section.fields.map((field) => (
                  <div className="form-field" key={field}>
                    <span>{field}</span>
                    <BlankLines />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="form-section">
            <h3>5. Payment & banking details</h3>
            <div className="field-grid">
              <div className="form-field"><span>Payment method</span><BlankLines /></div>
              <div className="form-field"><span>Bank name</span><BlankLines /></div>
              <div className="form-field"><span>Account holder</span><BlankLines /></div>
              <div className="form-field"><span>Account number</span><BlankLines /></div>
              <div className="form-field"><span>Branch code</span><BlankLines /></div>
            </div>
            <p className="form-note">Payment method: EFT / Cash / Debit Order. Bank account must be held with a South African bank.</p>
          </section>

          <section className="form-section">
            <h3>6. Beneficiaries</h3>
            <div className="beneficiary-table">
              <div>Full name</div><div>ID number</div><div>Relationship</div><div>Percentage</div>
              {Array.from({ length: 6 }, (_, index) => (
                <React.Fragment key={index}>
                  <BlankLines /><BlankLines /><BlankLines /><BlankLines />
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className="form-section declaration-section">
            <h3>7. Declaration</h3>
            <p>I declare that the information provided in this application is true and correct. I understand that it will be used for MABOTE GROUP PTY(LTD) membership administration.</p>
            <p className="checkbox-line">□ I accept and agree to the declaration.</p>
            <div className="signature-grid">
              <div>Applicant signature <BlankLines /></div>
              <div>Date <BlankLines /></div>
            </div>
          </section>
          <div className="document-contact">
            <div>
              <strong>WhatsApp: {whatsappNumber}</strong>
              <a href={whatsappLink} target="_blank" rel="noreferrer">Chat with MABOTE GROUP PTY(LTD) on WhatsApp</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP PTY(LTD) on WhatsApp" />
          </div>
          <p className="document-footer">For office use: Received by ____________________ Date ____________________</p>
        </section>

        <section className={`printable-document claim-document ${activeDocument === "claim" ? "active-document" : ""}`}>
          <div className="document-heading">
            <div>
              <p className="brand-kicker">MABOTE GROUP PTY(LTD)</p>
              <h2>Claim Form</h2>
              <p>Funeral grocery support claim request</p>
            </div>
            <div className="reference-box">Claim no.: <BlankLines /></div>
          </div>

          <section className="form-section">
            <h3>1. Member details</h3>
            <div className="field-grid">
              <div className="form-field"><span>Member full name</span><BlankLines /></div>
              <div className="form-field"><span>Membership number</span><BlankLines /></div>
              <div className="form-field"><span>Plan</span><BlankLines /></div>
              <div className="form-field"><span>ID number</span><BlankLines /></div>
              <div className="form-field"><span>Cellphone</span><BlankLines /></div>
              <div className="form-field"><span>Email address</span><BlankLines /></div>
            </div>
          </section>

          <section className="form-section">
            <h3>2. Claim information</h3>
            <div className="field-grid">
              <div className="form-field"><span>Claim type</span><BlankLines /></div>
              <div className="form-field"><span>Claim amount requested</span><BlankLines /></div>
              <div className="form-field"><span>Date of incident</span><BlankLines /></div>
              <div className="form-field"><span>Date submitted</span><BlankLines /></div>
            </div>
          </section>

          <section className="form-section">
            <h3>3. Details of claim</h3>
            <div className="claim-description-box">
              <BlankLines count={10} />
            </div>
          </section>

          <section className="form-section">
            <h3>4. Supporting documents</h3>
            <div className="supporting-list">
              <p>□ Death certificate / supporting proof</p>
              <p>□ Member ID copy</p>
              <p>□ Proof of account details</p>
              <p>□ Any additional supporting documentation</p>
            </div>
          </section>

          <section className="form-section declaration-section">
            <h3>5. Declaration</h3>
            <p>I declare that the information provided in this claim form is true and correct. I understand that MABOTE GROUP PTY(LTD) may verify this information and use it for claim processing.</p>
            <p className="checkbox-line">□ I confirm the above information is correct.</p>
            <div className="signature-grid">
              <div>Member signature <BlankLines /></div>
              <div>Date <BlankLines /></div>
            </div>
          </section>

          <div className="document-contact">
            <div>
              <strong>WhatsApp: {whatsappNumber}</strong>
              <a href={whatsappLink} target="_blank" rel="noreferrer">Chat with MABOTE GROUP PTY(LTD) on WhatsApp</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP PTY(LTD) on WhatsApp" />
          </div>
          <p className="document-footer">For office use: Reviewed by ____________________ Date ____________________</p>
        </section>

        <section className={`printable-document flyer-document ${activeDocument === "flyer" ? "active-document" : ""}`}>
          <div className="flyer-topline">MABOTE GROUP PTY(LTD)</div>
          <div className="flyer-content">
            <p className="flyer-label">BUILD TOGETHER. PROTECT EACH OTHER.</p>
            <h2>Stronger together,<br /><span>prepared for tomorrow.</span></h2>
            <p className="flyer-copy">Join MABOTE GROUP PTY(LTD) and make consistent monthly contributions toward meaningful support, funeral grocery benefits and a connected community.</p>
            <div className="flyer-features">
              <div><strong>01</strong><span>Affordable monthly plans</span></div>
              <div><strong>02</strong><span>Funeral grocery support</span></div>
              <div><strong>03</strong><span>Community-led protection</span></div>
            </div>
            <div className="flyer-callout">
              <strong>Membership plans from R350 per month</strong>
              <span>Ask an administrator for an application form.</span>
            </div>
            <div className="flyer-contact">
              <span>CONTACT MABOTE GROUP PTY(LTD)</span>
              <span>WhatsApp {whatsappNumber}</span>
              <a href={whatsappLink}>Chat with us on WhatsApp</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP PTY(LTD) on WhatsApp" />
            </div>
          </div>
          <div className="flyer-bottomline">STOCKVEL & FUNERAL GROCERY SCHEME</div>
        </section>

        <section className={`printable-document brochure-document ${activeDocument === "brochure" ? "active-document" : ""}`}>
          <div className="brochure-sheet brochure-outside">
            <article className="brochure-panel brochure-panel--contact">
              <img src="/mabote-logo.svg" alt="MABOTE GROUP PTY(LTD)" className="brochure-logo" />
              <p className="brochure-overline">MABOTE GROUP PTY(LTD)</p>
              <h2>Support that shows up when it matters.</h2>
              <p>We bring members together through consistent contributions, practical funeral grocery benefits and community care.</p>
              <div className="brochure-rule" />
              <strong>Stockvel & funeral grocery scheme</strong>
            </article>
            <article className="brochure-panel brochure-panel--join">
              <p className="brochure-overline">HOW IT WORKS</p>
              <h3>Join with purpose.</h3>
              <ol>
                <li><span>01</span>Choose the package that fits your family.</li>
                <li><span>02</span>Complete your membership application.</li>
                <li><span>03</span>Contribute monthly and stay protected.</li>
              </ol>
              <div className="brochure-join-note">Simple contributions. Meaningful support.</div>
            </article>
            <article className="brochure-panel brochure-panel--back">
              <p className="brochure-overline">LET'S TALK</p>
              <h3>Ready to join MABOTE GROUP PTY(LTD)?</h3>
              <p>Speak to an administrator for an application form, membership guidance and confirmed payment details.</p>
              <div className="brochure-contact-block">
                <strong>WhatsApp {whatsappNumber}</strong>
                <a href={whatsappLink}>Chat with us on WhatsApp</a>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
              <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP PTY(LTD) on WhatsApp" />
              <small>Prices and package contents are subject to confirmation by MABOTE GROUP PTY(LTD).</small>
            </article>
          </div>

          <div className="brochure-sheet brochure-inside">
            {brochurePackages.map((pkg) => (
              <article className={`brochure-panel brochure-package brochure-package--${pkg.accent}`} key={pkg.name}>
                <div className="brochure-package-topline">
                  <span>{pkg.name}</span>
                  <strong>{pkg.price}</strong>
                </div>
                <p className="brochure-overline">FUNERAL GROCERY PACKAGE</p>
                <h2>{pkg.title}</h2>
                <p>{pkg.description}</p>
                <div className="brochure-includes-title">PACKAGE INCLUDES</div>
                <ul>
                  {pkg.contents.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="brochure-package-footer">Monthly contribution <strong>{pkg.price}</strong></div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}