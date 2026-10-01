import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  fullName: "",
  idNumber: "",
  cellphone: "",
  email: "",
  position: "",
  department: "",
  contractType: "Permanent",
  highestQualification: "",
  experience: "",
  payrollMethod: "EFT / direct deposit",
  payFrequency: "Monthly",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  branchCode: "",
  taxStatus: "",
  notes: "",
};

const fieldGroups = [
  {
    title: "Applicant details",
    fields: [
      ["fullName", "Full name", "text"],
      ["idNumber", "ID number", "text"],
      ["cellphone", "Cellphone", "tel"],
      ["email", "Email address", "email"],
    ],
  },
  {
    title: "Role and experience",
    fields: [
      ["position", "Position applied for", "text"],
      ["department", "Department", "text"],
      ["highestQualification", "Highest qualification", "text"],
      ["experience", "Work experience", "text"],
    ],
  },
];

export default function HRRecruitmentDigital() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(() => Number(localStorage.getItem("mabote-hr-applicant-count") || 0));
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.position.trim()) {
      setMessage("Full name, email address, and position are required.");
      return;
    }

    const applicant = { ...form, id: Date.now(), submittedAt: new Date().toISOString(), status: "New" };
    const existing = JSON.parse(localStorage.getItem("mabote-hr-applicants") || "[]");
    localStorage.setItem("mabote-hr-applicants", JSON.stringify([applicant, ...existing]));
    const nextCount = submitted + 1;
    localStorage.setItem("mabote-hr-applicant-count", String(nextCount));
    setSubmitted(nextCount);
    setForm(initialForm);
    setMessage("Applicant saved successfully.");
  };

  return (
    <section className="settings-page">
      <div className="settings-header">
        <div>
          <p className="eyebrow">HUMAN RESOURCES / DIGITAL INTAKE</p>
          <h2>Digital recruitment application</h2>
          <p>Capture a staff application electronically and keep it ready for HR review.</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="secondary-button" onClick={() => navigate("/admin/hr")}>HR MANAGEMENT</button>
          <button type="button" className="secondary-button" onClick={() => navigate("/admin/staff-recruitment")}>PRINT FORM</button>
        </div>
      </div>

      <article className="settings-card settings-card--wide">
        <div className="settings-card-header">
          <div>
            <h3>New applicant</h3>
            <p>Applications saved here remain available in this browser for HR review.</p>
          </div>
          <strong className="settings-status">{submitted} saved</strong>
        </div>
        <form onSubmit={submitForm}>
          {fieldGroups.map((group) => (
            <fieldset className="digital-form-section" key={group.title}>
              <legend>{group.title}</legend>
              <div className="form-grid">
                {group.fields.map(([name, label, type]) => (
                  <label key={name}>
                    {label}{name === "fullName" || name === "email" || name === "position" ? " *" : ""}
                    <input name={name} type={type} value={form[name]} onChange={updateField} required={name === "fullName" || name === "email" || name === "position"} />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset className="digital-form-section">
            <legend>Employment and payroll</legend>
            <div className="form-grid">
              <label>Contract type<select name="contractType" value={form.contractType} onChange={updateField}><option>Permanent</option><option>Fixed term</option><option>Part-time</option><option>Independent contractor</option></select></label>
              <label>Payroll method<select name="payrollMethod" value={form.payrollMethod} onChange={updateField}><option>EFT / direct deposit</option><option>Cash</option><option>Cheque</option><option>Mobile payment</option><option>Commission only</option></select></label>
              <label>Pay frequency<select name="payFrequency" value={form.payFrequency} onChange={updateField}><option>Weekly</option><option>Fortnightly</option><option>Monthly</option><option>Commission only</option></select></label>
              <label>Tax number / PAYE status<input name="taxStatus" value={form.taxStatus} onChange={updateField} /></label>
              <label>Bank name<input name="bankName" value={form.bankName} onChange={updateField} /></label>
              <label>Account holder<input name="accountHolder" value={form.accountHolder} onChange={updateField} /></label>
              <label>Account number<input name="accountNumber" value={form.accountNumber} onChange={updateField} /></label>
              <label>Branch code<input name="branchCode" value={form.branchCode} onChange={updateField} /></label>
            </div>
          </fieldset>

          <label className="digital-notes">HR notes<textarea name="notes" value={form.notes} onChange={updateField} rows="4" placeholder="Screening notes, references, and follow-up actions" /></label>
          {message && <p className={message.includes("successfully") ? "settings-status" : "form-error"}>{message}</p>}
          <button type="submit" className="primary-button">SAVE DIGITAL APPLICATION</button>
        </form>
      </article>
    </section>
  );
}
