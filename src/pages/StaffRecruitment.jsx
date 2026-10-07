import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPrintables.css";

const whatsappNumber = "0663331151";
const whatsappLink = "https://wa.me/27663331151";
const whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappLink)}`;
const contactEmail = "info@mabote-group.co.za";

const recruitmentSections = [
  {
    title: "1. Applicant information",
    fields: ["Full name", "ID number", "Date of birth", "Gender", "Cellphone", "Email address"],
  },
  {
    title: "2. Address and availability",
    fields: ["Residential address", "Town / city", "Province", "Preferred location", "Date available to start", "Employment status"],
  },
  {
    title: "3. Qualifications and experience",
    fields: ["Highest qualification", "Relevant training", "Work experience", "Industry background", "Languages spoken"],
  },
  {
    title: "4. Recruitment details",
    fields: ["Position applied for", "Department", "Contract type", "Expected salary / package", "Motivation for joining", "Reference name"],
  },
];

function BlankLines({ count = 1 }) {
  return Array.from({ length: count }, (_, index) => (
    <span className="blank-line" key={index} />
  ));
}

export default function StaffRecruitment() {
  const navigate = useNavigate();

  return (
    <div className="printables-page">
      <header className="printables-toolbar screen-only">
        <div>
          <p className="eyebrow">HUMAN RESOURCES</p>
          <h1>Staff recruitment</h1>
          <p>Complete the staff intake form, then print or save it as a PDF.</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" onClick={() => navigate("/admin/hr")} className="secondary-button">
            HR management
          </button>
          <button type="button" onClick={() => window.print()} className="primary-button">
            Print / Save PDF
          </button>
        </div>
      </header>

      <main>
        <section className="printable-document recruitment-document active-document">
          <div className="document-heading">
            <div>
              <p className="brand-kicker">MABOTE GROUP PTY(LTD)</p>
              <h2>Agent Recruitment Form</h2>
              <p>Human resource recruitment application</p>
            </div>
            <div className="reference-box">Recruitment no.: <BlankLines /></div>
          </div>

          {recruitmentSections.map((section) => (
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
            <h3>5. Payroll and payment details</h3>
            <div className="recruitment-notes">
              <p><strong>Preferred payroll method:</strong> □ EFT / direct deposit &nbsp; □ Cash &nbsp; □ Cheque &nbsp; □ Mobile payment</p>
              <p><strong>Pay frequency:</strong> □ Weekly &nbsp; □ Fortnightly &nbsp; □ Monthly &nbsp; □ Commission only</p>
            </div>
            <div className="field-grid">
              <div className="form-field"><span>Bank name</span><BlankLines /></div>
              <div className="form-field"><span>Account holder</span><BlankLines /></div>
              <div className="form-field"><span>Account number</span><BlankLines /></div>
              <div className="form-field"><span>Branch code</span><BlankLines /></div>
              <div className="form-field"><span>Account type</span><BlankLines /></div>
              <div className="form-field"><span>Tax number / PAYE status</span><BlankLines /></div>
            </div>
            <p className="form-note">Attach proof of banking details for EFT payments. Payroll method and payment date are subject to the employment agreement.</p>
          </section>

          <section className="form-section">
            <h3>6. Supporting information</h3>
            <div className="recruitment-notes">
              <p>□ Required documents attached: CV / ID / qualifications / references</p>
              <p>□ Candidate has driver&apos;s licence: Yes / No</p>
              <p>□ Candidate is willing to work in field sales, community outreach and recruitment campaigns</p>
            </div>
          </section>

          <section className="form-section declaration-section">
            <h3>7. Declaration</h3>
            <p>I confirm that the information provided in this recruitment form is complete and accurate. I understand that MABOTE GROUP PTY(LTD) may verify my information as part of the recruitment process.</p>
            <p className="checkbox-line">□ I accept the declaration and consent to screening.</p>
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
          <p className="document-footer">For HR use: Reviewed by ____________________ Date ____________________</p>
        </section>
      </main>
    </div>
  );
}
