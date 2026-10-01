import React, { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const BLUE = "#062A63";
const DARK_BLUE = "#041D45";
const GOLD = "#D4AF37";
const LIGHT = "#F5F7FB";

export default function Members() {
  const [applications, setApplications] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const result = await apiRequest("/api/applications");
      const remoteApplications = Array.isArray(result.applications)
        ? result.applications
        : [];
      const localApplications = JSON.parse(
        localStorage.getItem("maboteApplications") || "[]"
      );
      const mergedApplications = [
        ...remoteApplications,
        ...(Array.isArray(localApplications) ? localApplications : []).filter(
          (localApplication) =>
            !remoteApplications.some(
              (remoteApplication) =>
                remoteApplication.applicationNumber ===
                localApplication.applicationNumber
            )
        ),
      ];

      setApplications(mergedApplications);
    } catch (error) {
      try {
        const saved = JSON.parse(
          localStorage.getItem("maboteApplications") || "[]"
        );
        setApplications(Array.isArray(saved) ? saved : []);
      } catch {
        setApplications([]);
      }
    }
  };

  const updateApplication = async (applicationNumber, changes) => {
    try {
      await apiRequest(`/api/applications/${applicationNumber}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
    } catch (error) {
      console.error("Unable to update application on the server:", error);
    }

    const updated = applications.map((application) =>
      application.applicationNumber === applicationNumber
        ? { ...application, ...changes }
        : application
    );

    setApplications(updated);

    localStorage.setItem(
      "maboteApplications",
      JSON.stringify(updated)
    );
  };

  const updateStatus = async (applicationNumber, newStatus) => {
    const member = applications.find(
      (application) =>
        application.applicationNumber === applicationNumber
    );

    if (!member) return;

    const fullName =
      `${member.fullName || ""} ${member.surname || ""}`.trim();

    /*
     * APPROVE MEMBER
     */
    if (newStatus === "Approved") {
      let savedMembers = [];

      try {
        savedMembers = JSON.parse(
          localStorage.getItem("maboteMembers") || "[]"
        );

        if (!Array.isArray(savedMembers)) {
          savedMembers = [];
        }
      } catch (error) {
        savedMembers = [];
      }

      const existingMember = savedMembers.find(
        (savedMember) =>
          savedMember.applicationNumber ===
          member.applicationNumber
      );

      const approvedMember = {
        ...member,
        status: "Approved",
        policyStatus: member.policyStatus || "Active",
        memberNumber:
          existingMember?.memberNumber ||
          `MAB-M-${Date.now().toString().slice(-6)}`,
        approvedDate:
          existingMember?.approvedDate ||
          new Date().toISOString(),
      };

      let updatedMembers;

      if (existingMember) {
        updatedMembers = savedMembers.map((savedMember) =>
          savedMember.applicationNumber ===
          member.applicationNumber
            ? approvedMember
            : savedMember
        );
      } else {
        updatedMembers = [
          ...savedMembers,
          approvedMember,
        ];
      }

      localStorage.setItem(
        "maboteMembers",
        JSON.stringify(updatedMembers)
      );
    }

    /*
     * REJECT MEMBER
     */
    if (newStatus === "Rejected") {
      let savedMembers = [];

      try {
        savedMembers = JSON.parse(
          localStorage.getItem("maboteMembers") || "[]"
        );

        if (!Array.isArray(savedMembers)) {
          savedMembers = [];
        }
      } catch (error) {
        savedMembers = [];
      }

      const updatedMembers = savedMembers.filter(
        (savedMember) =>
          savedMember.applicationNumber !==
          member.applicationNumber
      );

      localStorage.setItem(
        "maboteMembers",
        JSON.stringify(updatedMembers)
      );
    }

    const changes = {
      status: newStatus,
    };

    if (newStatus === "Approved") {
      changes.policyStatus =
        member.policyStatus || "Active";
    }

    if (newStatus === "Rejected") {
      changes.policyStatus = "Not Active";
    }

    await updateApplication(
      applicationNumber,
      changes
    );

    if (newStatus === "Approved") {
      setResponseMessage(
        `Dear ${fullName || "Member"}, your MABOTE GROUP HOLDINGS membership application has been approved. Your application reference is ${applicationNumber}. Your policy is now active. Welcome to MABOTE GROUP HOLDINGS.`
      );
    }

    if (newStatus === "Rejected") {
      setResponseMessage(
        `Dear ${fullName || "Member"}, we regret to inform you that your MABOTE GROUP HOLDINGS membership application has not been approved at this time. Your application reference is ${applicationNumber}. Please contact MABOTE GROUP HOLDINGS for further information.`
      );
    }

    setSelectedMember(null);
  };

  const updatePolicyStatus = async (
    applicationNumber,
    policyStatus
  ) => {
    await updateApplication(
      applicationNumber,
      { policyStatus }
    );

    try {
      const savedMembers = JSON.parse(
        localStorage.getItem("maboteMembers") || "[]"
      );

      const updatedMembers = savedMembers.map(
        (member) =>
          member.applicationNumber === applicationNumber
            ? {
                ...member,
                policyStatus,
              }
            : member
      );

      localStorage.setItem(
        "maboteMembers",
        JSON.stringify(updatedMembers)
      );
    } catch (error) {
      console.error("Unable to update policy status", error);
    }

    setSelectedMember(null);
  };

  const deleteApplication = (applicationNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    const updated = applications.filter(
      (application) =>
        application.applicationNumber !== applicationNumber
    );

    setApplications(updated);

    localStorage.setItem(
      "maboteApplications",
      JSON.stringify(updated)
    );

    try {
      const savedMembers = JSON.parse(
        localStorage.getItem("maboteMembers") || "[]"
      );

      const updatedMembers = savedMembers.filter(
        (member) =>
          member.applicationNumber !== applicationNumber
      );

      localStorage.setItem(
        "maboteMembers",
        JSON.stringify(updatedMembers)
      );
    } catch (error) {
      console.error("Unable to update members", error);
    }

    setSelectedMember(null);
  };

  const filteredApplications = applications.filter(
    (application) => {
      const text = `
        ${application.fullName || ""}
        ${application.surname || ""}
        ${application.applicationNumber || ""}
        ${application.policyNumber || ""}
        ${application.idNumber || ""}
        ${application.email || ""}
        ${application.cellphone || ""}
        ${application.plan || ""}
        ${application.status || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    }
  );

  const totalApplications = applications.length;

  const pendingMembers = applications.filter(
    (member) =>
      (member.status || "Pending") === "Pending"
  ).length;

  const approvedMembers = applications.filter(
    (member) =>
      member.status === "Approved"
  ).length;

  const rejectedMembers = applications.filter(
    (member) =>
      member.status === "Rejected"
  ).length;

  const activePolicies = applications.filter(
    (member) =>
      member.status === "Approved" &&
      (member.policyStatus || "Active") === "Active"
  ).length;

  const lapsedPolicies = applications.filter(
    (member) =>
      member.status === "Approved" &&
      member.policyStatus === "Lapsed"
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: LIGHT,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: BLUE,
          color: "white",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            MABOTE GROUP HOLDINGS
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#E8D27A",
            }}
          >
            Member Management
          </p>
        </div>

        <a
          href="/admin"
          style={{
            color: "white",
            textDecoration: "none",
            border: "1px solid white",
            padding: "10px 18px",
            borderRadius: "6px",
          }}
        >
          ← Dashboard
        </a>
      </header>

      {/* CONTENT */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <SummaryCard
            title="Applications"
            value={totalApplications}
          />

          <SummaryCard
            title="Pending"
            value={pendingMembers}
          />

          <SummaryCard
            title="Approved"
            value={approvedMembers}
          />

          <SummaryCard
            title="Rejected"
            value={rejectedMembers}
          />

          <SummaryCard
            title="Active Policies"
            value={activePolicies}
          />

          <SummaryCard
            title="Lapsed Policies"
            value={lapsedPolicies}
          />
        </div>

        {/* RESPONSE MESSAGE */}
        {responseMessage && (
          <div
            style={{
              background: "#EAF7EA",
              border: "1px solid #8BC48B",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <strong>Member Response</strong>

            <p style={{ marginBottom: "10px" }}>
              {responseMessage}
            </p>

            <button
              onClick={() => setResponseMessage("")}
              style={buttonStyle}
            >
              Close
            </button>
          </div>
        )}

        {/* SEARCH */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <input
            type="text"
            placeholder="Search members, application number, ID, policy..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* MEMBER TABLE */}
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            overflowX: "auto",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: DARK_BLUE,
              }}
            >
              Member Applications
            </h2>
          </div>

          {filteredApplications.length === 0 ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#666",
              }}
            >
              No member applications found.
            </div>
          ) : (
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
                    background: DARK_BLUE,
                    color: "white",
                  }}
                >
                  <th style={thStyle}>Member</th>
                  <th style={thStyle}>Application No.</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Policy</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map(
                  (member) => (
                    <tr
                      key={
                        member.applicationNumber ||
                        member.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      <td style={tdStyle}>
                        <strong>
                          {member.fullName}{" "}
                          {member.surname}
                        </strong>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {member.cellphone || ""}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        {member.applicationNumber ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {member.plan || "-"}
                      </td>

                      <td style={tdStyle}>
                        <StatusBadge
                          status={
                            member.status ||
                            "Pending"
                          }
                        />
                      </td>

                      <td style={tdStyle}>
                        {member.status ===
                        "Approved"
                          ? member.policyStatus ||
                            "Active"
                          : "Not Active"}
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() =>
                              setSelectedMember(
                                member
                              )
                            }
                            style={smallButton}
                          >
                            View
                          </button>

                          {(member.status ||
                            "Pending") ===
                            "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(
                                    member.applicationNumber,
                                    "Approved"
                                  )
                                }
                                style={{
                                  ...smallButton,
                                  background:
                                    "#198754",
                                  color: "white",
                                }}
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(
                                    member.applicationNumber,
                                    "Rejected"
                                  )
                                }
                                style={{
                                  ...smallButton,
                                  background:
                                    "#C62828",
                                  color: "white",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {member.status ===
                            "Approved" && (
                            <>
                              <button
                                onClick={() =>
                                  updatePolicyStatus(
                                    member.applicationNumber,
                                    "Active"
                                  )
                                }
                                style={{
                                  ...smallButton,
                                  background:
                                    "#198754",
                                  color: "white",
                                }}
                              >
                                Active
                              </button>

                              <button
                                onClick={() =>
                                  updatePolicyStatus(
                                    member.applicationNumber,
                                    "Lapsed"
                                  )
                                }
                                style={{
                                  ...smallButton,
                                  background:
                                    "#E0A800",
                                  color: "white",
                                }}
                              >
                                Lapse
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              deleteApplication(
                                member.applicationNumber
                              )
                            }
                            style={{
                              ...smallButton,
                              background:
                                "#555",
                              color: "white",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "10px",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: DARK_BLUE,
                }}
              >
                Member Details
              </h2>

              <button
                onClick={() =>
                  setSelectedMember(null)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <Detail
              label="Member Number"
              value={
                selectedMember.memberNumber ||
                "Not assigned"
              }
            />

            <Detail
              label="Application Number"
              value={
                selectedMember.applicationNumber
              }
            />

            <Detail
              label="Policy Number"
              value={
                selectedMember.policyNumber ||
                "Not assigned"
              }
            />

            <Detail
              label="Full Name"
              value={`${selectedMember.fullName || ""} ${
                selectedMember.surname || ""
              }`}
            />

            <Detail
              label="ID Number"
              value={
                selectedMember.idNumber || "-"
              }
            />

            <Detail
              label="Date of Birth"
              value={
                selectedMember.dateOfBirth || "-"
              }
            />

            <Detail
              label="Gender"
              value={
                selectedMember.gender || "-"
              }
            />

            <Detail
              label="Marital Status"
              value={
                selectedMember.maritalStatus ||
                "-"
              }
            />

            <Detail
              label="Cellphone"
              value={
                selectedMember.cellphone || "-"
              }
            />

            <Detail
              label="Email"
              value={
                selectedMember.email || "-"
              }
            />

            <Detail
              label="Address"
              value={
                selectedMember.address || "-"
              }
            />

            <Detail
              label="Town"
              value={
                selectedMember.town || "-"
              }
            />

            <Detail
              label="Employment"
              value={
                selectedMember.employmentStatus ||
                "-"
              }
            />

            <Detail
              label="Occupation"
              value={
                selectedMember.occupation || "-"
              }
            />

            <Detail
              label="Plan"
              value={
                selectedMember.plan || "-"
              }
            />

            <Detail
              label="Monthly Contribution"
              value={
                selectedMember.monthlyContribution
                  ? `R${selectedMember.monthlyContribution}`
                  : "-"
              }
            />

            <Detail
              label="Payment Method"
              value={
                selectedMember.paymentMethod ||
                "-"
              }
            />

            <Detail
              label="Bank"
              value={
                selectedMember.bankName || "-"
              }
            />

            <Detail
              label="Account Holder"
              value={
                selectedMember.accountHolder ||
                "-"
              }
            />

            <Detail
              label="Account Number"
              value={
                selectedMember.accountNumber || "-"
              }
            />

            <Detail
              label="Branch Code"
              value={
                selectedMember.branchCode || "-"
              }
            />

            <Detail
              label="Policy Status"
              value={
                selectedMember.policyStatus ||
                "Not Active"
              }
            />

            <Detail
              label="Application Status"
              value={
                selectedMember.status ||
                "Pending"
              }
            />

            {selectedMember.status ===
              "Approved" && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #ddd",
                }}
              >
                <strong>
                  Policy Management
                </strong>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      updatePolicyStatus(
                        selectedMember.applicationNumber,
                        "Active"
                      )
                    }
                    style={{
                      ...buttonStyle,
                      background:
                        "#198754",
                    }}
                  >
                    Set Active
                  </button>

                  <button
                    onClick={() =>
                      updatePolicyStatus(
                        selectedMember.applicationNumber,
                        "Lapsed"
                      )
                    }
                    style={{
                      ...buttonStyle,
                      background:
                        "#E0A800",
                    }}
                  >
                    Set Lapsed
                  </button>

                  <button
                    onClick={() =>
                      updatePolicyStatus(
                        selectedMember.applicationNumber,
                        "Not Active"
                      )
                    }
                    style={{
                      ...buttonStyle,
                      background:
                        "#C62828",
                    }}
                  >
                    Set Not Active
                  </button>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "25px",
                textAlign: "right",
              }}
            >
              <button
                onClick={() =>
                  setSelectedMember(null)
                }
                style={buttonStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "22px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${GOLD}`,
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: BLUE,
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let background = "#6c757d";

  if (status === "Approved") {
    background = "#198754";
  }

  if (status === "Rejected") {
    background = "#C62828";
  }

  if (status === "Pending") {
    background = "#E0A800";
  }

  return (
    <span
      style={{
        background,
        color: "white",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "200px 1fr",
        gap: "15px",
        padding: "10px 0",
        borderBottom:
          "1px solid #eee",
      }}
    >
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px",
  verticalAlign: "top",
};

const smallButton = {
  border: "none",
  borderRadius: "5px",
  padding: "7px 10px",
  cursor: "pointer",
  background: BLUE,
  color: "white",
  fontSize: "12px",
};

const buttonStyle = {
  border: "none",
  borderRadius: "6px",
  padding: "10px 16px",
  cursor: "pointer",
  background: BLUE,
  color: "white",
  fontWeight: "bold",
};