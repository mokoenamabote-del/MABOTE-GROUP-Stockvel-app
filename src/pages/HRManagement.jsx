import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultPayroll = {
  methods: ["EFT / direct deposit"],
  frequency: "Monthly",
  payDate: "",
  currency: "ZAR (R)",
  payrollContact: "",
};

const defaultAgentContract = {
  agentName: "",
  agentEmail: "",
  startDate: "",
  commissionRate: "R________ per verified member",
  leadTarget: "300",
  companyRepresentative: "",
};

const hrLinks = [
  {
    title: "Permanent staff records",
    description: "Add and manage confirmed permanent staff records and roles.",
    action: "OPEN PERMANENT STAFF",
    path: "/settings",
  },
  {
    title: "Recruitment intake",
    description: "Capture applications digitally or print the paper HR intake form.",
    action: "OPEN DIGITAL INTAKE",
    path: "/admin/hr/recruitment",
  },
  {
    title: "HR documents",
    description: "Print member-facing forms separately from staff paperwork.",
    action: "OPEN PRINT MATERIALS",
    path: "/admin/print-materials",
  },
];

export default function HRManagement() {
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState(() => {
    try {
      return { ...defaultPayroll, ...JSON.parse(localStorage.getItem("mabote-hr-payroll") || "{}")} ;
    } catch {
      return defaultPayroll;
    }
  });
  const [saved, setSaved] = useState(false);
  const [agentContract, setAgentContract] = useState(() => {
    try {
      return {
        ...defaultAgentContract,
        ...JSON.parse(localStorage.getItem("mabote-hr-agent-contract") || "{}"),
      };
    } catch {
      return defaultAgentContract;
    }
  });

  useEffect(() => {
    localStorage.setItem("mabote-hr-payroll", JSON.stringify(payroll));
  }, [payroll]);

  const toggleMethod = (method) => {
    setPayroll((previous) => ({
      ...previous,
      methods: previous.methods.includes(method)
        ? previous.methods.filter((item) => item !== method)
        : [...previous.methods, method],
    }));
  };

  const updatePayroll = (event) => {
    const { name, value } = event.target;
    setPayroll((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  };

  const savePayroll = (event) => {
    event.preventDefault();
    localStorage.setItem("mabote-hr-payroll", JSON.stringify(payroll));
    setSaved(true);
  };

  const updateAgentContract = (event) => {
    const { name, value } = event.target;
    setAgentContract((previous) => ({ ...previous, [name]: value }));
  };

  const saveAgentContract = (event) => {
    event.preventDefault();
    localStorage.setItem("mabote-hr-agent-contract", JSON.stringify(agentContract));
  };

  const printAgentContract = () => {
    window.print();
  };

  return (
    <section className="settings-page">
      <div className="settings-header">
        <div>
          <p className="eyebrow">ADMINISTRATION / HUMAN RESOURCES</p>
          <h2>HR management</h2>
          <p>Manage staff, recruitment, payroll, and HR documents from one place.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate("/admin")}>BACK TO DASHBOARD</button>
      </div>

      <div className="settings-grid">
        {hrLinks.map((link) => (
          <article className="settings-card" key={link.title}>
            <h3>{link.title}</h3>
            <p>{link.description}</p>
            <button type="button" className="primary-button" onClick={() => navigate(link.path)}>{link.action}</button>
          </article>
        ))}
      </div>

      <article className="settings-card settings-card--wide">
        <div className="settings-card-header">
          <div>
            <h3>Payroll setup</h3>
            <p>Set the available payroll methods and the normal payment schedule for staff.</p>
          </div>
          {saved && <span className="settings-status">Saved</span>}
        </div>
        <form onSubmit={savePayroll}>
          <fieldset className="payroll-methods">
            <legend>Available payroll methods</legend>
            {["EFT / direct deposit", "Cash", "Cheque", "Mobile payment", "Commission only"].map((method) => (
              <label key={method}>
                <input
                  type="checkbox"
                  checked={payroll.methods.includes(method)}
                  onChange={() => toggleMethod(method)}
                />
                {method}
              </label>
            ))}
          </fieldset>
          <div className="form-grid">
            <label>
              Pay frequency
              <select name="frequency" value={payroll.frequency} onChange={updatePayroll}>
                <option>Weekly</option>
                <option>Fortnightly</option>
                <option>Monthly</option>
                <option>Commission only</option>
              </select>
            </label>
            <label>
              Normal pay date
              <input name="payDate" value={payroll.payDate} onChange={updatePayroll} placeholder="e.g. Last working day" />
            </label>
            <label>
              Payroll currency
              <input name="currency" value={payroll.currency} onChange={updatePayroll} />
            </label>
            <label>
              Payroll contact
              <input name="payrollContact" value={payroll.payrollContact} onChange={updatePayroll} placeholder="HR or payroll administrator" />
            </label>
          </div>
          <button type="submit" className="primary-button">SAVE PAYROLL SETUP</button>
        </form>
      </article>

      <article className="settings-card settings-card--wide agent-contract-editor">
        <div className="settings-card-header">
          <div>
            <h3>Temporary agent contract draft</h3>
            <p>Prepare a commission-only agreement for legal review and signing.</p>
          </div>
          <span className="settings-status">Draft</span>
        </div>

        <form onSubmit={saveAgentContract}>
          <div className="form-grid">
            <label>
              Agent full name
              <input name="agentName" value={agentContract.agentName} onChange={updateAgentContract} required />
            </label>
            <label>
              Agent email
              <input name="agentEmail" type="email" value={agentContract.agentEmail} onChange={updateAgentContract} required />
            </label>
            <label>
              Engagement start date
              <input name="startDate" type="date" value={agentContract.startDate} onChange={updateAgentContract} required />
            </label>
            <label>
              Commission amount or rate
              <input name="commissionRate" value={agentContract.commissionRate} onChange={updateAgentContract} required />
            </label>
            <label>
              Verified member lead target
              <input name="leadTarget" type="number" min="1" value={agentContract.leadTarget} onChange={updateAgentContract} required />
            </label>
            <label>
              Company representative
              <input name="companyRepresentative" value={agentContract.companyRepresentative} onChange={updateAgentContract} required />
            </label>
          </div>
          <div className="contract-actions">
            <button type="submit" className="primary-button">SAVE CONTRACT DRAFT</button>
            <button type="button" className="secondary-button" onClick={printAgentContract}>PRINT CONTRACT</button>
          </div>
        </form>

        <div className="agent-contract-document">
          <p className="contract-draft-label">DRAFT FOR LEGAL REVIEW</p>
          <h4>TEMPORARY COMMISSION-BASED AGENT AGREEMENT</h4>
          <p>This Temporary Commission-Based Agent Agreement (the “Agreement”) is made between MABOTE GROUP PTY(LTD) (the “Company”) and {agentContract.agentName || "[Agent full name]"} (the “Agent”), with an intended start date of {agentContract.startDate || "[Start date]"}.</p>
          <ol>
            <li><strong>Temporary appointment.</strong> The Company appoints the Agent on a temporary basis to conduct lawful outreach, introduce prospective members, and submit member leads. This Agreement does not create a permanent position or promise continued work.</li>
            <li><strong>Commission-only compensation.</strong> The Agent will earn {agentContract.commissionRate || "[commission amount or rate]"} for each lead that the Company verifies, accepts, and records as an eligible member under its current procedures. No salary, hourly wage, or commission is earned for rejected, duplicate, fraudulent, cancelled, or unverified leads. Payment timing and any required tax deductions must comply with applicable law.</li>
            <li><strong>Pathway to permanent vacancy.</strong> After the Agent secures {agentContract.leadTarget || "300"} verified eligible member leads, the Agent may be considered for an available permanent vacancy. Reaching the target creates an eligibility milestone only; it does not automatically create employment. Any permanent appointment requires a separate written offer, satisfactory performance and compliance review, an available vacancy, and any checks required by law.</li>
            <li><strong>Agent responsibilities.</strong> The Agent must provide accurate information, obtain consent before collecting personal information, follow the Company’s scripts and policies, avoid misleading promises, protect confidential information, and comply with applicable consumer-protection, privacy, employment, and anti-bribery laws.</li>
            <li><strong>Independent status and no authority.</strong> The parties must confirm the Agent’s legal status under applicable law. Unless a separate written agreement states otherwise, the Agent has no authority to bind the Company, collect money on its behalf, incur expenses, or represent that permanent employment is guaranteed.</li>
            <li><strong>Labour-law compliance.</strong> This temporary arrangement must be applied consistently with the South African Labour Relations Act 66 of 1995, including the rules for fixed-term work and temporary services where they apply, and the Basic Conditions of Employment Act 75 of 1997. The actual working relationship, not only this document’s title, determines whether the Agent is an employee or an independent contractor. If the Agent is legally an employee, applicable minimum conditions, written particulars, fair labour practices, working-time rules, remuneration protections, and termination protections must be honoured. Nothing in this Agreement removes or reduces a right that cannot lawfully be waived.</li>
            <li><strong>Term and termination.</strong> This temporary engagement begins on the date above and may be ended by either party on written notice, or immediately for fraud, misconduct, material breach, or unlawful conduct. Verified commissions earned before termination remain subject to the verification and payment terms in this Agreement.</li>
            <li><strong>Entire understanding.</strong> This draft is subject to legal review and the Company’s final policies. Any amendment, permanent appointment, or additional benefit must be recorded in a separate written document signed by both parties.</li>
          </ol>
          <div className="contract-signatures">
            <p>Agent: {agentContract.agentName || "[Agent full name]"}<br />Signature: ____________________ Date: ____________</p>
            <p>For MABOTE GROUP PTY(LTD): {agentContract.companyRepresentative || "[Company representative]"}<br />Signature: ____________________ Date: ____________</p>
          </div>
          <p className="contract-disclaimer">This is a business draft, not legal advice. Have a qualified South African employment lawyer review the classification under the Labour Relations Act 66 of 1995, the Basic Conditions of Employment Act 75 of 1997, commission and tax treatment, privacy obligations, termination terms, and permanent-vacancy wording before use.</p>
        </div>
      </article>
    </section>
  );
}
