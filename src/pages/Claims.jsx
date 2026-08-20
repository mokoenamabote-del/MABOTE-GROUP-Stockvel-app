import React, { useState } from "react";

const initialClaims = [
  {
    id: 1,
    member: "Nomsa Khumalo",
    membershipNumber: "M-001",
    plan: "Plan A",
    claimType: "Funeral Grocery Support",
    amount: "R1,200",
    status: "Approved",
    reason: "Funeral grocery support",
    date: "2026-08-10",
  },
  {
    id: 2,
    member: "Sipho Moyo",
    membershipNumber: "M-002",
    plan: "Plan B",
    claimType: "Funeral Support",
    amount: "R2,500",
    status: "Pending",
    reason: "Funeral support request",
    date: "2026-08-15",
  },
  {
    id: 3,
    member: "Lindiwe Ndlovu",
    membershipNumber: "M-003",
    plan: "Plan C",
    claimType: "Funeral Grocery Support",
    amount: "R1,800",
    status: "Rejected",
    reason: "Claim documentation incomplete",
    date: "2026-08-17",
  },
];

const emptyClaim = {
  member: "",
  membershipNumber: "",
  plan: "Plan A",
  claimType: "Funeral Grocery Support",
  amount: "",
  reason: "",
  date: "",
};

export default function Claims() {
  const [claims, setClaims] =
    useState(initialClaims);

  const [newClaim, setNewClaim] =
    useState(emptyClaim);

  const [selectedClaim, setSelectedClaim] =
    useState(null);

  const handleChange = (field) => (event) => {
    setNewClaim((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const addClaim = (event) => {
    event.preventDefault();

    if (
      !newClaim.member.trim() ||
      !newClaim.membershipNumber.trim() ||
      !newClaim.amount.trim() ||
      !newClaim.reason.trim() ||
      !newClaim.date
    ) {
      alert(
        "Please complete all required claim information."
      );
      return;
    }

    const nextId = claims.length
      ? Math.max(
          ...claims.map((claim) => claim.id)
        ) + 1
      : 1;

    const claimToAdd = {
      id: nextId,
      member: newClaim.member.trim(),
      membershipNumber:
        newClaim.membershipNumber.trim(),
      plan: newClaim.plan,
      claimType: newClaim.claimType,
      amount: newClaim.amount.trim(),
      status: "Pending",
      reason: newClaim.reason.trim(),
      date: newClaim.date,
    };

    setClaims((previous) => [
      claimToAdd,
      ...previous,
    ]);

    setNewClaim(emptyClaim);

    alert(
      "Claim submitted successfully and is now pending review."
    );
  };

  const updateClaimStatus = (
    id,
    status
  ) => {
    setClaims((previous) =>
      previous.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              status,
            }
          : claim
      )
    );

    setSelectedClaim((previous) =>
      previous && previous.id === id
        ? {
            ...previous,
            status,
          }
        : previous
    );
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return {
        background: "#e8f5e9",
        color: "#2e7d32",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#ffebee",
        color: "#c62828",
      };
    }

    return {
      background: "#fff8e1",
      color: "#f57c00",
    };
  };

  const totalClaims = claims.length;

  const pendingClaims =
    claims.filter(
      (claim) =>
        claim.status === "Pending"
    ).length;

  const approvedClaims =
    claims.filter(
      (claim) =>
        claim.status === "Approved"
    ).length;

  const rejectedClaims =
    claims.filter(
      (claim) =>
        claim.status === "Rejected"
    ).length;

  return (
    <section className="claims-page">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2
            style={{
              marginBottom: "8px",
            }}
          >
            📋 Claims Management
          </h2>

          <p
            style={{
              margin: 0,
            }}
          >
            Submit, review and manage member
            funeral support claims.
          </p>
        </div>

        <div
          style={{
            padding: "14px 20px",
            borderRadius: "12px",
            background: "#f4f6f8",
            fontWeight: "700",
          }}
        >
          {totalClaims} Total Claims
        </div>
      </div>

      {/* ======================================
          CLAIM SUMMARY
      ======================================= */}

      <div
        className="dashboard-grid"
        style={{
          marginBottom: "30px",
        }}
      >

        <article className="dashboard-card">
          <h3>Total Claims</h3>

          <p className="metric-value">
            {totalClaims}
          </p>

          <p>
            All submitted claims
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Pending</h3>

          <p className="metric-value">
            {pendingClaims}
          </p>

          <p>
            Claims awaiting review
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Approved</h3>

          <p className="metric-value">
            {approvedClaims}
          </p>

          <p>
            Approved claims
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Rejected</h3>

          <p className="metric-value">
            {rejectedClaims}
          </p>

          <p>
            Rejected claims
          </p>
        </article>

      </div>

      {/* ======================================
          SUBMIT CLAIM
      ======================================= */}

      <article
        className="dashboard-card dashboard-card--wide"
        style={{
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              marginBottom: "8px",
            }}
          >
            📝 Submit a Claim
          </h3>

          <p
            style={{
              margin: 0,
            }}
          >
            Complete the information below to
            submit a member claim for review.
          </p>
        </div>

        <form
          onSubmit={addClaim}
          className="form-card"
        >

          {/* MEMBER INFORMATION */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                marginBottom: "15px",
              }}
            >
              Member Information
            </h4>

            <div className="form-grid">

              <label>
                Member Name
                <input
                  type="text"
                  value={newClaim.member}
                  onChange={handleChange(
                    "member"
                  )}
                  placeholder="Enter member full name"
                />
              </label>

              <label>
                Membership Number
                <input
                  type="text"
                  value={
                    newClaim.membershipNumber
                  }
                  onChange={handleChange(
                    "membershipNumber"
                  )}
                  placeholder="e.g. M-001"
                />
              </label>

              <label>
                Membership Plan
                <select
                  value={newClaim.plan}
                  onChange={handleChange(
                    "plan"
                  )}
                >
                  <option value="Plan A">
                    Plan A
                  </option>

                  <option value="Plan B">
                    Plan B
                  </option>

                  <option value="Plan C">
                    Plan C
                  </option>
                </select>
              </label>

            </div>
          </div>

          {/* CLAIM INFORMATION */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                marginBottom: "15px",
              }}
            >
              Claim Information
            </h4>

            <div className="form-grid">

              <label>
                Claim Type

                <select
                  value={
                    newClaim.claimType
                  }
                  onChange={handleChange(
                    "claimType"
                  )}
                >
                  <option>
                    Funeral Grocery Support
                  </option>

                  <option>
                    Funeral Support
                  </option>

                  <option>
                    Emergency Support
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </label>

              <label>
                Claim Amount

                <input
                  type="text"
                  value={newClaim.amount}
                  onChange={handleChange(
                    "amount"
                  )}
                  placeholder="e.g. R2,500"
                />
              </label>

              <label>
                Date of Incident

                <input
                  type="date"
                  value={newClaim.date}
                  onChange={handleChange(
                    "date"
                  )}
                />
              </label>

            </div>
          </div>

          {/* REASON */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <h4
              style={{
                marginBottom: "15px",
              }}
            >
              Claim Description
            </h4>

            <label>
              Reason for Claim

              <textarea
                value={newClaim.reason}
                onChange={handleChange(
                  "reason"
                )}
                placeholder="Provide details about the claim and the support required..."
                rows="5"
              />
            </label>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="primary-button"
            style={{
              minWidth: "190px",
            }}
          >
            SUBMIT CLAIM
          </button>

        </form>
      </article>

      {/* ======================================
          CLAIM LIST
      ======================================= */}

      <article
        className="dashboard-card dashboard-card--wide"
      >

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h3>
            Submitted Claims
          </h3>

          <p>
            Review all claims currently recorded
            in the system.
          </p>
        </div>

        <div className="claims-grid">

          {claims.map((claim) => (

            <article
              key={claim.id}
              className="claim-card"
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >

                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    opacity: 0.7,
                  }}
                >
                  CLAIM #{claim.id}
                </span>

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    ...getStatusStyle(
                      claim.status
                    ),
                  }}
                >
                  {claim.status}
                </span>

              </div>

              <h3>
                {claim.member}
              </h3>

              <p>
                <strong>
                  Membership:
                </strong>{" "}
                {claim.membershipNumber}
              </p>

              <p>
                <strong>
                  Plan:
                </strong>{" "}
                {claim.plan}
              </p>

              <p>
                <strong>
                  Claim Type:
                </strong>{" "}
                {claim.claimType}
              </p>

              <p>
                <strong>
                  Amount:
                </strong>{" "}
                {claim.amount}
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {claim.date}
              </p>

              <p>
                <strong>
                  Reason:
                </strong>{" "}
                {claim.reason}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSelectedClaim(
                    claim
                  )
                }
                style={{
                  marginTop: "10px",
                }}
              >
                VIEW CLAIM
              </button>

            </article>

          ))}

        </div>

      </article>

      {/* ======================================
          CLAIM DETAILS MODAL
      ======================================= */}

      {selectedClaim && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
          onClick={() =>
            setSelectedClaim(null)
          }
        >

          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "30px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "15px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Claim #{selectedClaim.id}
                </h2>

                <p
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {selectedClaim.member}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedClaim(
                    null
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  fontSize: "28px",
                  cursor: "pointer",
                }}
                aria-label="Close claim"
              >
                ×
              </button>

            </div>

            <hr
              style={{
                margin: "20px 0",
              }}
            />

            <p>
              <strong>
                Membership Number:
              </strong>{" "}
              {selectedClaim.membershipNumber}
            </p>

            <p>
              <strong>
                Plan:
              </strong>{" "}
              {selectedClaim.plan}
            </p>

            <p>
              <strong>
                Claim Type:
              </strong>{" "}
              {selectedClaim.claimType}
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              {selectedClaim.amount}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {selectedClaim.date}
            </p>

            <p>
              <strong>
                Reason:
              </strong>{" "}
              {selectedClaim.reason}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}

              <span
                style={{
                  display:
                    "inline-block",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  ...getStatusStyle(
                    selectedClaim.status
                  ),
                }}
              >
                {selectedClaim.status}
              </span>
            </p>

            {/* APPROVAL BUTTONS */}

            {selectedClaim.status ===
              "Pending" && (

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap:
                    "wrap",
                  marginTop: "25px",
                }}
              >

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    updateClaimStatus(
                      selectedClaim.id,
                      "Approved"
                    )
                  }
                >
                  APPROVE CLAIM
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateClaimStatus(
                      selectedClaim.id,
                      "Rejected"
                    )
                  }
                >
                  REJECT CLAIM
                </button>

              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setSelectedClaim(null)
              }
              style={{
                marginTop: "15px",
              }}
            >
              CLOSE
            </button>

          </div>

        </div>

      )}

    </section>
  );
}