
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import ChangePasswordForm from "../components/ChangePasswordForm";
import "./ClientPortal.css";

const readList = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const formatCurrency = (amount) =>
  `R${Number(amount || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "Not recorded";

  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const claimDocumentFields = [
  { key: "deathCertificate", label: "Death certificate" },
  { key: "claimantId", label: "Claimant's ID copy" },
  { key: "deceasedId", label: "Deceased's ID copy" },
  { key: "doctorConfirmation", label: "Doctor's confirmation for the deceased" },
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });

export default function ClientPortal() {
  const navigate = useNavigate();

  const account = (() => {
    try {
      return JSON.parse(localStorage.getItem("maboteAccount") || "null");
    } catch {
      return null;
    }
  })();

  const email = String(account?.email || "").toLowerCase();

  const [applications, setApplications] = useState(() =>
    readList("maboteApplications")
  );

  const members = readList("maboteMembers");

  const [collections, setCollections] = useState(() =>
    readList("maboteCollections")
  );

  const [claims, setClaims] = useState(() =>
    readList("maboteClaims")
  );

  const application = applications.find(
    (item) => String(item.email || "").toLowerCase() === email
  );

  const member = members.find(
    (item) => String(item.email || "").toLowerCase() === email
  );

  const memberNumber = member?.memberNumber || application?.memberNumber;
  const fullName = `${account?.fullName || application?.fullName || "Member"} ${
    account?.surname || application?.surname || ""
  }`.trim();

  const [claimForm, setClaimForm] = useState({
    claimantName: fullName,
    claimantRelationship: "",
    deceasedName: "",
    claimType: "Funeral Grocery Support",
    amount: "",
    date: "",
    reason: "",
  });
  const [claimDocuments, setClaimDocuments] = useState({});
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimActionMessage, setClaimActionMessage] = useState("");
  const [deletingClaimId, setDeletingClaimId] = useState(null);

  const memberCollections = collections
    .filter(
      (item) =>
        String(item.memberNumber || item.membershipNumber || "") ===
          String(memberNumber || "") ||
        String(item.applicationNumber || "") ===
          String(application?.applicationNumber || "")
    )
    .sort(
      (first, second) =>
        new Date(second.paymentDate) - new Date(first.paymentDate)
    );

  const memberClaims = claims.filter(
    (item) =>
      String(item.email || "").toLowerCase() === email ||
      String(item.membershipNumber || "") === String(memberNumber || "")
  );

  useEffect(() => {
    Promise.all([
      apiRequest("/api/applications"),
      apiRequest("/api/contributions"),
      apiRequest("/api/claims"),
    ])
      .then(
        ([applicationResult, contributionResult, claimResult]) => {
          if (Array.isArray(applicationResult.applications)) {
            setApplications(applicationResult.applications);
          }

          if (Array.isArray(contributionResult.contributions)) {
            setCollections(contributionResult.contributions);
          }

          if (Array.isArray(claimResult.claims)) {
            setClaims(claimResult.claims);
          }
        }
      )
      .catch(() => {
        // Keep legacy local records visible while the backend is unavailable.
      });
  }, []);

  const plan = member?.plan || application?.plan || "Awaiting plan selection";

  const monthlyContribution =
    member?.monthlyContribution ||
    member?.planAmount ||
    application?.monthlyContribution ||
    application?.planAmount ||
    0;

  const totalPaid = memberCollections.reduce(
    (total, item) =>
      total + Number(item.amountPaid || item.amount || 0),
    0
  );

  const membershipStatus =
    member?.status || application?.status || "Not submitted";

  const policyStatus =
    member?.policyStatus || application?.policyStatus || "Pending review";

  // Check whether the member's membership has been approved.
  const isApproved =
    String(
      member?.status ||
      application?.status ||
      member?.policyStatus ||
      application?.policyStatus ||
      ""
    ).toLowerCase() === "approved";

  const handleLogout = () => {
    localStorage.removeItem("maboteAuthToken");
    localStorage.removeItem("maboteAuthExpiresAt");
    localStorage.removeItem("maboteAccount");

    navigate("/login");
  };

  const handleClaimFormChange = (event) => {
    const { name, value } = event.target;
    setClaimForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleClaimDocumentChange = (type) => (event) => {
    const file = event.target.files?.[0];
    setClaimDocuments((previous) => ({ ...previous, [type]: file || null }));
    setClaimMessage("");

    if (file && file.size > 3 * 1024 * 1024) {
      setClaimMessage("Each supporting document must be no larger than 3 MB.");
      event.target.value = "";
      setClaimDocuments((previous) => ({ ...previous, [type]: null }));
    }
  };

  const submitClaim = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setClaimMessage("");

    const missingDocument = claimDocumentFields.find(
      ({ key }) => !claimDocuments[key]
    );
    if (missingDocument) {
      setClaimMessage(`Please upload ${missingDocument.label.toLowerCase()}.`);
      return;
    }

    if (!memberNumber) {
      setClaimMessage(
        "A membership number is required before a claim can be submitted. Please contact membership support."
      );
      return;
    }

    setClaimSubmitting(true);
    try {
      const documents = await Promise.all(
        claimDocumentFields.map(async ({ key }) => {
          const file = claimDocuments[key];
          if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
            throw new Error(
              "Supporting documents must be PDF, JPG, or PNG files."
            );
          }

          return {
            type: key,
            name: file.name,
            mimeType: file.type,
            data: await fileToBase64(file),
          };
        })
      );

      const claimToSubmit = {
        id: Date.now(),
        member: fullName,
        membershipNumber: String(memberNumber),
        policyNumber: String(
          member?.policyNumber || application?.policyNumber || ""
        ).trim(),
        plan,
        claimType: claimForm.claimType,
        amount: claimForm.amount.trim(),
        status: "Pending",
        reason: claimForm.reason.trim(),
        date: claimForm.date,
        claimantName: claimForm.claimantName.trim(),
        claimantRelationship: claimForm.claimantRelationship.trim(),
        deceasedName: claimForm.deceasedName.trim(),
        email,
        documents,
      };

      const result = await apiRequest("/api/claims", {
        method: "POST",
        body: JSON.stringify(claimToSubmit),
      });

      setClaims((previous) => [result.claim, ...previous]);
      setClaimDocuments({});
      setClaimForm((previous) => ({
        ...previous,
        claimantRelationship: "",
        deceasedName: "",
        amount: "",
        date: "",
        reason: "",
      }));
      formElement.reset();
      setClaimMessage(
        "Your claim and supporting documents were sent to management for review."
      );
    } catch (error) {
      setClaimMessage(error.message);
    } finally {
      setClaimSubmitting(false);
    }
  };

  const deleteClaim = async (claim) => {
    if (!window.confirm("Are you sure you want to delete this claim?")) {
      return;
    }

    setDeletingClaimId(claim.id);
    setClaimActionMessage("");
    try {
      await apiRequest(`/api/claims/${claim.id}`, { method: "DELETE" });
      setClaims((previous) =>
        previous.filter((item) => item.id !== claim.id)
      );
      setClaimActionMessage("Claim deleted.");
    } catch (error) {
      setClaimActionMessage(error.message);
    } finally {
      setDeletingClaimId(null);
    }
  };

  return (
    <div className="client-portal">
      <header className="portal-header">
        <div>
          <img
            src="/mabote-logo.png"
            alt="MABOTE GROUP PTY(LTD)"
            className="portal-logo"
          />

          <p className="portal-kicker">
            MABOTE GROUP PTY(LTD) / CLIENT PORTAL
          </p>

          <h1>Welcome back, {fullName.split(" ")[0]}.</h1>

          <p>
            One calm place to follow your membership, contributions, and claims.
          </p>
        </div>

        <div className="portal-header-actions">
          <span className="portal-member-pill">
            {memberNumber || "Application in progress"}
          </span>

          <button
            type="button"
            className="portal-logout"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="portal-main">
        <section
          className="portal-status-grid"
          aria-label="Membership overview"
        >
          <article className="portal-status-card portal-status-card--dark">
            <span>Membership</span>
            <strong>{membershipStatus}</strong>
            <small>
              {application?.applicationNumber ||
                "Application reference pending"}
            </small>
          </article>

          <article className="portal-status-card">
            <span>Policy status</span>
            <strong>{policyStatus}</strong>
            <small>
              {member?.policyNumber || "Policy number pending"}
            </small>
          </article>

          <article className="portal-status-card">
            <span>Monthly contribution</span>
            <strong>
              {monthlyContribution
                ? formatCurrency(monthlyContribution)
                : "To be confirmed"}
            </strong>
            <small>{plan}</small>
          </article>

          <article className="portal-status-card portal-status-card--gold">
            <span>Total recorded</span>
            <strong>{formatCurrency(totalPaid)}</strong>
            <small>
              {memberCollections.length} contribution
              {memberCollections.length === 1 ? "" : "s"}
            </small>
          </article>
        </section>

        <section className="portal-content-grid">
          <article className="portal-panel portal-panel--welcome">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">YOUR MEMBERSHIP</p>

                <h2>
                  {application
                    ? "Your application is on file."
                    : "Your portal is ready."}
                </h2>
              </div>

              <span
                className={`portal-status-dot portal-status-dot--${String(
                  membershipStatus
                ).toLowerCase()}`}
              />
            </div>

            <p>
              {isApproved
                ? "Your membership is approved. Keep your contributions up to date and use this portal whenever you need a quick status check."
                : application
                  ? "Your application has been received. You can review your application details while it is awaiting approval."
                  : "Your account is active. Complete your membership application to submit your details and begin the membership approval process."}
            </p>

            <div className="portal-detail-list">
              <div>
                <span>Email</span>
                <strong>{email || "Not available"}</strong>
              </div>

              <div>
                <span>Plan</span>
                <strong>{plan}</strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(
                    member?.approvedDate || application?.applicationDate
                  )}
                </strong>
              </div>
            </div>
          </article>

          {/* NEXT STEP - MEMBERSHIP APPLICATION LINK */}
          <article className="portal-panel portal-panel--next">
            <p className="portal-label">NEXT STEP</p>

            <h2>
              {isApproved
                ? "Keep your contributions current."
                : application
                  ? "Continue your membership application."
                  : "Complete your membership application."}
            </h2>

            <p>
              {isApproved
                ? "Your membership is approved. Use the payment instructions to keep your contributions up to date."
                : "Open your membership application form to complete or review your personal details, select your grocery package and submit your application."}
            </p>

            {isApproved ? (
              <Link
                className="portal-primary-action"
                to="/payments"
              >
                View payment instructions <span>→</span>
              </Link>
            ) : (
              <Link
                className="portal-primary-action"
                to="/member-registration"
              >
                Complete Membership Application <span>→</span>
              </Link>
            )}
          </article>
        </section>

        <section className="portal-lower-grid">
          <article className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">CONTRIBUTIONS</p>
                <h2>Recent activity</h2>
              </div>

              <span className="portal-count">
                {memberCollections.length}
              </span>
            </div>

            {memberCollections.length ? (
              <div className="portal-activity-list">
                {memberCollections.slice(0, 4).map((item) => (
                  <div
                    className="portal-activity-row"
                    key={item.id || item.paymentDate}
                  >
                    <div>
                      <strong>{formatDate(item.paymentDate)}</strong>
                      <span>{item.paymentMethod || "Payment"}</span>
                    </div>

                    <div className="portal-activity-amount">
                      <strong>
                        {formatCurrency(item.amountPaid || item.amount)}
                      </strong>
                      <span>{item.status || "Recorded"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="portal-empty-state">
                No contributions have been recorded against this account yet.
              </p>
            )}
          </article>

          <article className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">CLAIMS</p>
                <h2>Claim activity</h2>
              </div>

              <span className="portal-count">
                {memberClaims.length}
              </span>
            </div>

            <details className="portal-claim-form">
              <summary>Submit an online claim</summary>
              <p>
                Complete the claim details and upload all four supporting
                documents. Management will review your submission.
              </p>

              <form onSubmit={submitClaim}>
                <div className="portal-claim-form-grid">
                  <label>
                    Claimant full name
                    <input
                      name="claimantName"
                      value={claimForm.claimantName}
                      onChange={handleClaimFormChange}
                      required
                    />
                  </label>

                  <label>
                    Relationship to deceased
                    <input
                      name="claimantRelationship"
                      value={claimForm.claimantRelationship}
                      onChange={handleClaimFormChange}
                      required
                    />
                  </label>

                  <label>
                    Deceased full name
                    <input
                      name="deceasedName"
                      value={claimForm.deceasedName}
                      onChange={handleClaimFormChange}
                      required
                    />
                  </label>

                  <label>
                    Claim type
                    <select
                      name="claimType"
                      value={claimForm.claimType}
                      onChange={handleClaimFormChange}
                    >
                      <option>Funeral Grocery Support</option>
                      <option>Funeral Support</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label>
                    Date of death
                    <input
                      name="date"
                      type="date"
                      value={claimForm.date}
                      onChange={handleClaimFormChange}
                      required
                    />
                  </label>

                  <label>
                    Claim amount (optional)
                    <input
                      name="amount"
                      value={claimForm.amount}
                      onChange={handleClaimFormChange}
                      placeholder="e.g. R2,500"
                    />
                  </label>
                </div>

                <label className="portal-claim-reason">
                  Claim details
                  <textarea
                    name="reason"
                    value={claimForm.reason}
                    onChange={handleClaimFormChange}
                    rows="3"
                    required
                  />
                </label>

                <fieldset className="portal-claim-documents">
                  <legend>Required supporting documents</legend>
                  {claimDocumentFields.map(({ key, label }) => (
                    <label key={key}>
                      {label}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={handleClaimDocumentChange(key)}
                        required
                      />
                      <small>PDF, JPG or PNG; maximum 3 MB.</small>
                    </label>
                  ))}
                </fieldset>

                <button
                  className="portal-primary-action"
                  type="submit"
                  disabled={claimSubmitting}
                >
                  {claimSubmitting ? "Submitting claim…" : "Submit claim"}
                </button>
                {claimMessage && (
                  <p className="portal-claim-message" role="status">
                    {claimMessage}
                  </p>
                )}
              </form>
            </details>

            {memberClaims.length ? (
              <div className="portal-activity-list">
                {memberClaims.slice(0, 3).map((claim) => (
                  <div
                    className="portal-activity-row"
                    key={claim.id || claim.date}
                  >
                    <div>
                      <strong>{claim.claimType || "Member claim"}</strong>
                      <span>{formatDate(claim.date)}</span>
                      <span>
                        Policy number: {claim.policyNumber || member?.policyNumber || application?.policyNumber || "Not recorded"}
                      </span>
                    </div>

                    <div className="portal-activity-amount">
                      <strong>
                        {claim.amount || "Amount pending"}
                      </strong>
                      <span>{claim.status || "Pending"}</span>
                      <button
                        className="portal-delete-action"
                        type="button"
                        disabled={deletingClaimId === claim.id}
                        onClick={() => deleteClaim(claim)}
                      >
                        {deletingClaimId === claim.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="portal-empty-state">
                No claims are currently linked to your membership.
              </p>
            )}
            {claimActionMessage && (
              <p className="portal-claim-message" role="status">
                {claimActionMessage}
              </p>
            )}

            <a
              className="portal-text-action"
              href="mailto:info@mabote-group.co.za?subject=Membership%20support"
            >
              Contact membership support <span>↗</span>
            </a>
          </article>
        </section>

        <section className="portal-panel portal-password-panel">
          <ChangePasswordForm />
        </section>

        <section className="portal-footer-actions">
          <Link to="/about">About MABOTE GROUP PTY(LTD)</Link>
          <Link to="/packages">View grocery packages</Link>
          <Link to="/contact">Contact us</Link>
        </section>
      </main>
    </div>
  );
}
