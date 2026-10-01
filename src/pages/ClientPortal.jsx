import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
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
  const [applications, setApplications] = useState(() => readList("maboteApplications"));
  const members = readList("maboteMembers");
  const [collections, setCollections] = useState(() => readList("maboteCollections"));
  const [claims, setClaims] = useState(() => readList("maboteClaims"));

  const application = applications.find(
    (item) => String(item.email || "").toLowerCase() === email
  );
  const member = members.find(
    (item) => String(item.email || "").toLowerCase() === email
  );
  const memberNumber = member?.memberNumber || application?.memberNumber;
  const memberCollections = collections
    .filter(
      (item) =>
        String(item.memberNumber || item.membershipNumber || "") ===
          String(memberNumber || "") ||
        String(item.applicationNumber || "") ===
          String(application?.applicationNumber || "")
    )
    .sort((first, second) => new Date(second.paymentDate) - new Date(first.paymentDate));
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
      .then(([applicationResult, contributionResult, claimResult]) => {
        if (Array.isArray(applicationResult.applications)) {
          setApplications(applicationResult.applications);
        }
        if (Array.isArray(contributionResult.contributions)) {
          setCollections(contributionResult.contributions);
        }
        if (Array.isArray(claimResult.claims)) {
          setClaims(claimResult.claims);
        }
      })
      .catch(() => {
        // Keep legacy local records visible while the backend is unavailable.
      });
  }, []);

  const fullName = `${account?.fullName || application?.fullName || "Member"} ${account?.surname || application?.surname || ""}`.trim();
  const plan = member?.plan || application?.plan || "Awaiting plan selection";
  const monthlyContribution =
    member?.monthlyContribution ||
    member?.planAmount ||
    application?.monthlyContribution ||
    application?.planAmount ||
    0;
  const totalPaid = memberCollections.reduce(
    (total, item) => total + Number(item.amountPaid || item.amount || 0),
    0
  );
  const membershipStatus = member?.status || application?.status || "Not submitted";
  const policyStatus = member?.policyStatus || application?.policyStatus || "Pending review";

  const handleLogout = () => {
    localStorage.removeItem("maboteAuthToken");
    localStorage.removeItem("maboteAuthExpiresAt");
    localStorage.removeItem("maboteAccount");
    navigate("/login");
  };

  return (
    <div className="client-portal">
      <header className="portal-header">
        <div>
          <img src="/mabote-logo.svg" alt="MABOTE GROUP PTY(LTD)" className="portal-logo" />
          <p className="portal-kicker">MABOTE GROUP PTY(LTD) / CLIENT PORTAL</p>
          <h1>Welcome back, {fullName.split(" ")[0]}.</h1>
          <p>One calm place to follow your membership, contributions, and claims.</p>
        </div>
        <div className="portal-header-actions">
          <span className="portal-member-pill">{memberNumber || "Application in progress"}</span>
          <button type="button" className="portal-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className="portal-main">
        <section className="portal-status-grid" aria-label="Membership overview">
          <article className="portal-status-card portal-status-card--dark">
            <span>Membership</span>
            <strong>{membershipStatus}</strong>
            <small>{application?.applicationNumber || "Application reference pending"}</small>
          </article>
          <article className="portal-status-card">
            <span>Policy status</span>
            <strong>{policyStatus}</strong>
            <small>{member?.policyNumber || "Policy number pending"}</small>
          </article>
          <article className="portal-status-card">
            <span>Monthly contribution</span>
            <strong>{monthlyContribution ? formatCurrency(monthlyContribution) : "To be confirmed"}</strong>
            <small>{plan}</small>
          </article>
          <article className="portal-status-card portal-status-card--gold">
            <span>Total recorded</span>
            <strong>{formatCurrency(totalPaid)}</strong>
            <small>{memberCollections.length} contribution{memberCollections.length === 1 ? "" : "s"}</small>
          </article>
        </section>

        <section className="portal-content-grid">
          <article className="portal-panel portal-panel--welcome">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">YOUR MEMBERSHIP</p>
                <h2>{application ? "Your application is on file." : "Your portal is ready."}</h2>
              </div>
              <span className={`portal-status-dot portal-status-dot--${String(membershipStatus).toLowerCase()}`} />
            </div>
            <p>
              {membershipStatus === "Approved"
                ? "Your membership is approved. Keep your contributions up to date and use this portal whenever you need a quick status check."
                : "Your account is active. Submit or confirm your membership application with the MABOTE GROUP PTY(LTD) administrator to unlock your full member record."}
            </p>
            <div className="portal-detail-list">
              <div><span>Email</span><strong>{email || "Not available"}</strong></div>
              <div><span>Plan</span><strong>{plan}</strong></div>
              <div><span>Joined</span><strong>{formatDate(member?.approvedDate || application?.applicationDate)}</strong></div>
            </div>
          </article>

          <article className="portal-panel portal-panel--next">
            <p className="portal-label">NEXT STEP</p>
            <h2>{memberCollections.length ? "Keep your contributions current." : "Complete your first contribution."}</h2>
            <p>Use the official payment instructions and include your application or membership number as the reference.</p>
            <Link className="portal-primary-action" to="/payments">View payment instructions <span>→</span></Link>
          </article>
        </section>

        <section className="portal-lower-grid">
          <article className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">CONTRIBUTIONS</p>
                <h2>Recent activity</h2>
              </div>
              <span className="portal-count">{memberCollections.length}</span>
            </div>
            {memberCollections.length ? (
              <div className="portal-activity-list">
                {memberCollections.slice(0, 4).map((item) => (
                  <div className="portal-activity-row" key={item.id || item.paymentDate}>
                    <div><strong>{formatDate(item.paymentDate)}</strong><span>{item.paymentMethod || "Payment"}</span></div>
                    <div className="portal-activity-amount"><strong>{formatCurrency(item.amountPaid || item.amount)}</strong><span>{item.status || "Recorded"}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="portal-empty-state">No contributions have been recorded against this account yet.</p>
            )}
          </article>

          <article className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-label">CLAIMS</p>
                <h2>Claim activity</h2>
              </div>
              <span className="portal-count">{memberClaims.length}</span>
            </div>
            {memberClaims.length ? (
              <div className="portal-activity-list">
                {memberClaims.slice(0, 3).map((claim) => (
                  <div className="portal-activity-row" key={claim.id || claim.date}>
                    <div><strong>{claim.claimType || "Member claim"}</strong><span>{formatDate(claim.date)}</span></div>
                    <div className="portal-activity-amount"><strong>{claim.amount || "Amount pending"}</strong><span>{claim.status || "Pending"}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="portal-empty-state">No claims are currently linked to your membership.</p>
            )}
            <a className="portal-text-action" href="mailto:info@mabotegroup.co.za?subject=Membership%20support">Contact membership support <span>↗</span></a>
          </article>
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
