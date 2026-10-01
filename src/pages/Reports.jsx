import React, { useState } from "react";

export default function Reports() {
  const [refreshKey, setRefreshKey] = useState(0);

  const getApplications = () => {
    try {
      const savedApplications = localStorage.getItem(
        "maboteApplications"
      );

      const applications = savedApplications
        ? JSON.parse(savedApplications)
        : [];

      return Array.isArray(applications) ? applications : [];
    } catch (error) {
      console.error("Unable to load applications:", error);
      return [];
    }
  };

  const applications = getApplications();

  const approvedMembers = applications.filter(
    (member) => member.status === "Approved"
  );

  const pendingMembers = applications.filter(
    (member) =>
      !member.status || member.status === "Pending"
  );

  const rejectedMembers = applications.filter(
    (member) => member.status === "Rejected"
  );

  const getPlanPrice = (plan) => {
    if (plan === "Plan A") return 250;
    if (plan === "Plan B") return 450;
    if (plan === "Plan C") return 350;

    return 0;
  };

  const totalMonthlyContributions =
    approvedMembers.reduce(
      (total, member) =>
        total + getPlanPrice(member.plan),
      0
    );

  const planACount = applications.filter(
    (member) => member.plan === "Plan A"
  ).length;

  const planBCount = applications.filter(
    (member) => member.plan === "Plan B"
  ).length;

  const planCCount = applications.filter(
    (member) => member.plan === "Plan C"
  ).length;

  const totalBeneficiaries = applications.reduce(
    (total, member) =>
      total +
      (Array.isArray(member.beneficiaries)
        ? member.beneficiaries.length
        : 0),
    0
  );

  const refreshReport = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <section
      className="reports-page"
      key={refreshKey}
      style={{
        paddingBottom: "40px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "#071a52",
          color: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          borderBottom: "5px solid #d4af37",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#ffffff",
            }}
          >
            MABOTE GROUP HOLDINGS REPORTS
          </h2>

          <p
            style={{
              marginBottom: 0,
              color: "#d4af37",
              fontWeight: "bold",
            }}
          >
            Insurance Matrix & Membership Report
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={refreshReport}
            style={{
              padding: "10px 18px",
              marginRight: "10px",
              background: "#071a52",
              color: "#ffffff",
              border: "2px solid #d4af37",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            REFRESH
          </button>

          <button
            type="button"
            onClick={printReport}
            style={{
              padding: "10px 18px",
              background: "#d4af37",
              color: "#071a52",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            PRINT REPORT
          </button>
        </div>
      </div>

      {/* SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginTop: "25px",
        }}
      >
        <SummaryCard
          title="Total Applications"
          value={applications.length}
          description="All applications received"
        />

        <SummaryCard
          title="Approved Members"
          value={approvedMembers.length}
          description="Approved memberships"
        />

        <SummaryCard
          title="Pending Applications"
          value={pendingMembers.length}
          description="Awaiting approval"
        />

        <SummaryCard
          title="Rejected Applications"
          value={rejectedMembers.length}
          description="Not approved"
        />

        <SummaryCard
          title="Beneficiaries"
          value={totalBeneficiaries}
          description="Beneficiaries recorded"
        />

        <SummaryCard
          title="Monthly Contributions"
          value={`R${totalMonthlyContributions.toLocaleString()}`}
          description="Expected from approved members"
        />
      </div>

      {/* PLAN SUMMARY */}

      <div
        style={{
          marginTop: "25px",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.10)",
        }}
      >
        <h2
          style={{
            color: "#071a52",
            borderBottom: "2px solid #d4af37",
            paddingBottom: "10px",
          }}
        >
          Membership Plan Summary
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <PlanCard
            plan="Plan A"
            count={planACount}
            price="R250"
            description="Super Package"
          />

          <PlanCard
            plan="Plan B"
            count={planBCount}
            price="R450"
            description="Executive Package + Inkomo"
          />

          <PlanCard
            plan="Plan C"
            count={planCCount}
            price="R350"
            description="Custom Plan"
          />
        </div>
      </div>

      {/* INSURANCE MATRIX */}

      <div
        style={{
          marginTop: "25px",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.10)",
        }}
      >
        <h2
          style={{
            color: "#071a52",
            borderBottom: "2px solid #d4af37",
            paddingBottom: "10px",
          }}
        >
          Member Insurance Matrix
        </h2>

        {applications.length === 0 ? (
          <div
            style={{
              padding: "30px",
              background: "#f4f6f9",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>No member applications available</h3>

            <p>
              Complete a Member Application first.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1100px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#071a52",
                    color: "#ffffff",
                  }}
                >
                  <th style={cellStyle}>
                    Application No.
                  </th>

                  <th style={cellStyle}>
                    Policy No.
                  </th>

                  <th style={cellStyle}>
                    Member Name
                  </th>

                  <th style={cellStyle}>
                    ID Number
                  </th>

                  <th style={cellStyle}>
                    Plan
                  </th>

                  <th style={cellStyle}>
                    Contribution
                  </th>

                  <th style={cellStyle}>
                    Status
                  </th>

                  <th style={cellStyle}>
                    Beneficiaries
                  </th>

                  <th style={cellStyle}>
                    Application Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.map(
                  (member, index) => {
                    const status =
                      member.status || "Pending";

                    const beneficiaryCount =
                      Array.isArray(
                        member.beneficiaries
                      )
                        ? member.beneficiaries.length
                        : 0;

                    return (
                      <tr
                        key={
                          member.applicationNumber ||
                          index
                        }
                      >
                        <td style={cellStyle}>
                          {member.applicationNumber ||
                            "-"}
                        </td>

                        <td style={cellStyle}>
                          {member.policyNumber ||
                            "-"}
                        </td>

                        <td style={cellStyle}>
                          {member.fullName || ""}{" "}
                          {member.surname || ""}
                        </td>

                        <td style={cellStyle}>
                          {member.idNumber || "-"}
                        </td>

                        <td style={cellStyle}>
                          {member.plan || "-"}
                        </td>

                        <td style={cellStyle}>
                          R
                          {getPlanPrice(
                            member.plan
                          ).toLocaleString()}
                        </td>

                        <td style={cellStyle}>
                          <StatusBadge
                            status={status}
                          />
                        </td>

                        <td style={cellStyle}>
                          {beneficiaryCount} / 8
                        </td>

                        <td style={cellStyle}>
                          {member.applicationDate
                            ? new Date(
                                member.applicationDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POLICY SUMMARY */}

      <div
        style={{
          marginTop: "25px",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.10)",
        }}
      >
        <h2
          style={{
            color: "#071a52",
            borderBottom: "2px solid #d4af37",
            paddingBottom: "10px",
          }}
        >
          Policy Summary
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <ReportCard
            title="Approved Policies"
            value={approvedMembers.length}
            note="Active approved memberships"
          />

          <ReportCard
            title="Pending Policies"
            value={pendingMembers.length}
            note="Applications awaiting decision"
          />

          <ReportCard
            title="Rejected Policies"
            value={rejectedMembers.length}
            note="Applications not approved"
          />

          <ReportCard
            title="Expected Monthly Income"
            value={`R${totalMonthlyContributions.toLocaleString()}`}
            note="Based on approved members"
          />
        </div>
      </div>

      {/* FOOTER */}

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          padding: "20px",
          color: "#071a52",
          fontWeight: "bold",
        }}
      >
        MABOTE GROUP HOLDINGS © 2026
      </div>
    </section>
  );
}

function SummaryCard({
  title,
  value,
  description,
}) {
  return (
    <article
      style={{
        background: "#ffffff",
        border: "1px solid #d4af37",
        borderRadius: "10px",
        padding: "20px",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px",
          color: "#071a52",
          fontSize: "1rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0 0 5px",
          color: "#071a52",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {value}
      </p>

      <p
        style={{
          margin: 0,
          color: "#666666",
          fontSize: "0.9rem",
        }}
      >
        {description}
      </p>
    </article>
  );
}

function PlanCard({
  plan,
  count,
  price,
  description,
}) {
  return (
    <article
      style={{
        border: "1px solid #d4af37",
        borderRadius: "8px",
        padding: "20px",
        background: "#fffdf5",
      }}
    >
      <h3
        style={{
          color: "#071a52",
          marginTop: 0,
        }}
      >
        {plan}
      </h3>

      <p
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#071a52",
          margin: "10px 0",
        }}
      >
        {count}
      </p>

      <p>
        <strong>{price}</strong> per member
      </p>

      <p
        style={{
          color: "#666666",
        }}
      >
        {description}
      </p>
    </article>
  );
}

function ReportCard({
  title,
  value,
  note,
}) {
  return (
    <article
      style={{
        padding: "20px",
        border: "1px solid #d4af37",
        borderRadius: "8px",
        background: "#fffdf5",
      }}
    >
      <h4
        style={{
          color: "#071a52",
          marginTop: 0,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#071a52",
          margin: "10px 0",
        }}
      >
        {value}
      </p>

      <p
        style={{
          color: "#666666",
          marginBottom: 0,
        }}
      >
        {note}
      </p>
    </article>
  );
}

function StatusBadge({ status }) {
  let background = "#f0ad4e";

  if (status === "Approved") {
    background = "#2e7d32";
  }

  if (status === "Rejected") {
    background = "#c62828";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        background,
        color: "#ffffff",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}

const cellStyle = {
  padding: "12px",
  border: "1px solid #dddddd",
  textAlign: "left",
  verticalAlign: "top",
};