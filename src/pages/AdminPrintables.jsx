import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPrintables.css";

const whatsappNumber = "0663331151";
const whatsappLink = "https://wa.me/27663331151";
const whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappLink)}`;
const contactEmail = "info@mabotegroup.co.za";

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
  const [activeDocument, setActiveDocument] = useState("application");

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="printables-page">
      <header className="printables-toolbar screen-only">
        <div>
          <p className="eyebrow">ADMIN DOCUMENT CENTRE</p>
          <h1>Flyer & application form</h1>
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
          className={activeDocument === "flyer" ? "active" : ""}
          onClick={() => setActiveDocument("flyer")}
        >
          Promotional flyer
        </button>
      </nav>

      <main>
        <section className={`printable-document application-document ${activeDocument === "application" ? "active-document" : ""}`}>
          <div className="document-heading">
            <div>
              <p className="brand-kicker">MABOTE GROUP</p>
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
            <p>I declare that the information provided in this application is true and correct. I understand that it will be used for MABOTE GROUP membership administration.</p>
            <p className="checkbox-line">□ I accept and agree to the declaration.</p>
            <div className="signature-grid">
              <div>Applicant signature <BlankLines /></div>
              <div>Date <BlankLines /></div>
            </div>
          </section>
          <div className="document-contact">
            <div>
              <strong>WhatsApp: {whatsappNumber}</strong>
              <a href={whatsappLink} target="_blank" rel="noreferrer">Chat with MABOTE GROUP on WhatsApp</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP on WhatsApp" />
          </div>
          <p className="document-footer">For office use: Received by ____________________ Date ____________________</p>
        </section>

        <section className={`printable-document flyer-document ${activeDocument === "flyer" ? "active-document" : ""}`}>
          <div className="flyer-topline">MABOTE GROUP</div>
          <div className="flyer-content">
            <p className="flyer-label">BUILD TOGETHER. PROTECT EACH OTHER.</p>
            <h2>Stronger together,<br /><span>prepared for tomorrow.</span></h2>
            <p className="flyer-copy">Join MABOTE GROUP and make consistent monthly contributions toward meaningful support, funeral grocery benefits and a connected community.</p>
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
              <span>CONTACT MABOTE GROUP</span>
              <span>WhatsApp {whatsappNumber}</span>
              <a href={whatsappLink}>Chat with us on WhatsApp</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <img src={whatsappQrUrl} alt="Scan to chat with MABOTE GROUP on WhatsApp" />
            </div>
          </div>
          <div className="flyer-bottomline">STOCKVEL & FUNERAL GROCERY SCHEME</div>
        </section>
      </main>
    </div>
  );
}