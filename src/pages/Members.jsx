import React, { useEffect, useState } from "react";

export default function Members() {
  const [applications, setApplications] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const loadApplications = () => {
    try {
      const savedApplications = JSON.parse(
        localStorage.getItem("maboteApplications") || "[]"
      );

      const safeApplications = Array.isArray(savedApplications)
        ? savedApplications
        : [];

      setApplications(safeApplications);
    } catch (error) {
      console.error("Unable to load member applications:", error);
      setApplications([]);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const totalMembers = applications.length;

  const pendingMembers = applications.filter(
    (member) => !member.status || member.status === "Pending"
  ).length;

  const approvedMembers = applications.filter(
    (member) => member.status === "Approved"
  ).length;

  const rejectedMembers = applications.filter(
    (member) => member.status === "Rejected"
  ).length;

  const activePolicies = applications.filter(
    (member) => member.policyStatus === "Active"
  ).length;

  const lapsedPolicies = applications.filter(
    (member) => member.policyStatus === "Lapsed"
  ).length;

  const updateApplication = (
    applicationNumber,
    changes
  ) => {
    const updatedApplications = applications.map(
      (application) =>
        application.applicationNumber === applicationNumber
          ? {
              ...application,
              ...changes,
            }
          : application
    );

    localStorage.setItem(
      "maboteApplications",
      JSON.stringify(updatedApplications)
    );

    setApplications(updatedApplications);

    if (
      selectedMember &&
      selectedMember.applicationNumber === applicationNumber
    ) {
      setSelectedMember({
        ...selectedMember,
        ...changes,
      });
    }
  };

  const updateStatus = (
    applicationNumber,
    newStatus
  ) => {
    const member = applications.find(
      (application) =>
        application.applicationNumber === applicationNumber
    );

    if (!member) {
      return;
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

    updateApplication(
      applicationNumber,
      changes
    );

    const fullName =
      `${member.fullName || ""} ${
        member.surname || ""
      }`.trim();

    if (newStatus === "Approved") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, your MABOTE GROUP membership application has been approved. Your application reference is ${applicationNumber}. Your policy is now active. Welcome to MABOTE GROUP.`
      );
    }

    if (newStatus === "Rejected") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, we regret to inform you that your MABOTE GROUP membership application has not been approved at this time. Your application reference is ${applicationNumber}. Please contact MABOTE GROUP for further information.`
      );
    }
  };

  const updatePolicyStatus = (
    applicationNumber,
    newPolicyStatus
  ) => {
    const member = applications.find(
      (application) =>
        application.applicationNumber === applicationNumber
    );

    if (!member) {
      return;
    }

    updateApplication(
      applicationNumber,
      {
        policyStatus: newPolicyStatus,
      }
    );

    const fullName =
      `${member.fullName || ""} ${
        member.surname || ""
      }`.trim();

    if (newPolicyStatus === "Active") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, your MABOTE GROUP policy ${
          member.policyNumber || ""
        } is now marked as ACTIVE.`
      );
    }

    if (newPolicyStatus === "Lapsed") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, your MABOTE GROUP policy ${
          member.policyNumber || ""
        } has been marked as LAPSED. Please contact MABOTE GROUP regarding your policy status.`
      );
    }
  };

  const deleteMember = (
    applicationNumber
  ) => {
    const member = applications.find(
      (application) =>
        application.applicationNumber === applicationNumber
    );

    if (!member) {
      return;
    }

    const fullName =
      `${member.fullName || ""} ${
        member.surname || ""
      }`.trim();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        fullName || "this member"
      }?\n\nApplication: ${applicationNumber}\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const updatedApplications =
      applications.filter(
        (application) =>
          application.applicationNumber !==
          applicationNumber
      );

    localStorage.setItem(
      "maboteApplications",
      JSON.stringify(updatedApplications)
    );

    setApplications(updatedApplications);
    setSelectedMember(null);
    setResponseMessage("");
  };

  const closeDetails = () => {
    setSelectedMember(null);
    setResponseMessage("");
  };

  const copyResponse = async () => {
    if (!responseMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        responseMessage
      );

      alert("Response copied successfully.");
    } catch (error) {
      alert(
        "Please select and copy the response manually."
      );
    }
  };

  return (
    <section className="members-page">

      {/* HEADER */}

      <div
        style={{
          background: "#071a52",
          color: "#ffffff",
          padding: "25px",
          borderBottom: "5px solid #d4af37",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <h1 style={{ margin: 0 }}>
          MABOTE GROUP
        </h1>

        <p style={{ marginBottom: 0 }}>
          Member & Policy Management
        </p>
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
          title="Total Members"
          value={totalMembers}
          description="All member applications"
        />

        <SummaryCard
          title="Pending"
          value={pendingMembers}
          description="Awaiting decision"
        />

        <SummaryCard
          title="Approved"
          value={approvedMembers}
          description="Approved memberships"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedMembers}
          description="Not approved"
        />

        <SummaryCard
          title="Active Policies"
          value={activePolicies}
          description="Currently active"
        />

        <SummaryCard
          title="Lapsed Policies"
          value={lapsedPolicies}
          description="Policies requiring attention"
        />
      </div>

      {/* AUTOMATIC RESPONSE */}

      {responseMessage && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#fffdf5",
            border: "2px solid #d4af37",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              color: "#071a52",
              marginTop: 0,
            }}
          >
            Automatic Client Response
          </h3>

          <p
            style={{
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {responseMessage}
          </p>

          <button
            type="button"
            onClick={copyResponse}
            style={{
              padding: "10px 18px",
              background: "#071a52",
              color: "#ffffff",
              border: "2px solid #d4af37",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Copy Response
          </button>

          <button
            type="button"
            onClick={() =>
              setResponseMessage("")
            }
            style={{
              padding: "10px 18px",
              background: "#777777",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* MEMBER LIST */}

      {!selectedMember && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#071a52",
                  marginBottom: "5px",
                }}
              >
                Member Applications
              </h2>

              <p
                style={{
                  marginTop: 0,
                  color: "#555555",
                }}
              >
                Review and manage members,
                applications and policies.
              </p>
            </div>

            <button
              type="button"
              onClick={loadApplications}
              style={{
                padding: "10px 18px",
                background: "#071a52",
                color: "#ffffff",
                border: "2px solid #d4af37",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Refresh
            </button>
          </div>

          {applications.length === 0 ? (
            <div
              style={{
                padding: "30px",
                marginTop: "20px",
                background: "#f5f5f5",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <h3>
                No member applications yet
              </h3>

              <p>
                Applications submitted through
                Member Application will appear here.
              </p>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                marginTop: "20px",
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
                      Member
                    </th>

                    <th style={cellStyle}>
                      ID Number
                    </th>

                    <th style={cellStyle}>
                      Cellphone
                    </th>

                    <th style={cellStyle}>
                      Plan
                    </th>

                    <th style={cellStyle}>
                      Application Status
                    </th>

                    <th style={cellStyle}>
                      Policy Status
                    </th>

                    <th style={cellStyle}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map(
                    (application) => {
                      const applicationStatus =
                        application.status ||
                        "Pending";

                      const policyStatus =
                        application.policyStatus ||
                        (applicationStatus ===
                        "Approved"
                          ? "Active"
                          : "Not Active");

                      return (
                        <tr
                          key={
                            application.applicationNumber
                          }
                        >
                          <td style={cellStyle}>
                            {application.applicationNumber ||
                              "Not available"}
                          </td>

                          <td style={cellStyle}>
                            {application.fullName ||
                              ""}{" "}
                            {application.surname ||
                              ""}
                          </td>

                          <td style={cellStyle}>
                            {application.idNumber ||
                              "Not provided"}
                          </td>

                          <td style={cellStyle}>
                            {application.cellphone ||
                              "Not provided"}
                          </td>

                          <td style={cellStyle}>
                            {application.plan ||
                              "Not selected"}
                          </td>

                          <td style={cellStyle}>
                            <StatusBadge
                              status={
                                applicationStatus
                              }
                            />
                          </td>

                          <td style={cellStyle}>
                            <PolicyBadge
                              status={
                                policyStatus
                              }
                            />
                          </td>

                          <td style={cellStyle}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedMember(
                                  application
                                )
                              }
                              style={{
                                marginRight:
                                  "5px",
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#071a52",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  application.applicationNumber,
                                  "Approved"
                                )
                              }
                              style={{
                                marginRight:
                                  "5px",
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#2e7d32",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  application.applicationNumber,
                                  "Rejected"
                                )
                              }
                              style={{
                                marginRight:
                                  "5px",
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#c62828",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Reject
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updatePolicyStatus(
                                  application.applicationNumber,
                                  "Lapsed"
                                )
                              }
                              style={{
                                marginRight:
                                  "5px",
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#b26a00",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Lapse
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updatePolicyStatus(
                                  application.applicationNumber,
                                  "Active"
                                )
                              }
                              style={{
                                marginRight:
                                  "5px",
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#1565c0",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Active
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteMember(
                                  application.applicationNumber
                                )
                              }
                              style={{
                                marginBottom:
                                  "5px",
                                padding:
                                  "7px 10px",
                                background:
                                  "#8b0000",
                                color:
                                  "#ffffff",
                                border: "none",
                                borderRadius:
                                  "5px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Delete
                            </button>
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
      )}

      {/* FULL MEMBER DETAILS */}

      {selectedMember && (
        <div
          style={{
            marginTop: "25px",
            background: "#ffffff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h2
              style={{
                color: "#071a52",
              }}
            >
              Full Member Details
            </h2>

            <button
              type="button"
              onClick={closeDetails}
              style={{
                padding: "10px 20px",
                background: "#071a52",
                color: "#ffffff",
                border: "2px solid #d4af37",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ← Back to Members
            </button>
          </div>

          <hr />

          <DetailsSection title="Application Information">
            <Detail
              label="Application Number"
              value={
                selectedMember.applicationNumber
              }
            />

            <Detail
              label="Policy Number"
              value={
                selectedMember.policyNumber
              }
            />

            <Detail
              label="Application Date"
              value={
                selectedMember.applicationDate
                  ? new Date(
                      selectedMember.applicationDate
                    ).toLocaleDateString()
                  : "Not available"
              }
            />

            <Detail
              label="Application Status"
              value={
                selectedMember.status ||
                "Pending"
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
              label="Monthly Contribution"
              value={
                selectedMember.planAmount
                  ? `R${selectedMember.planAmount}`
                  : "Not available"
              }
            />
          </DetailsSection>

          <DetailsSection title="Personal Details">
            <Detail
              label="Full Name"
              value={selectedMember.fullName}
            />

            <Detail
              label="Surname"
              value={selectedMember.surname}
            />

            <Detail
              label="ID Number"
              value={selectedMember.idNumber}
            />

            <Detail
              label="Date of Birth"
              value={
                selectedMember.dateOfBirth
              }
            />

            <Detail
              label="Gender"
              value={selectedMember.gender}
            />

            <Detail
              label="Marital Status"
              value={
                selectedMember.maritalStatus
              }
            />
          </DetailsSection>

          <DetailsSection title="Contact Details">
            <Detail
              label="Cellphone"
              value={selectedMember.cellphone}
            />

            <Detail
              label="Alternative Number"
              value={
                selectedMember.alternativeNumber
              }
            />

            <Detail
              label="Email"
              value={selectedMember.email}
            />
          </DetailsSection>

          <DetailsSection title="Residential Address">
            <Detail
              label="Address"
              value={selectedMember.address}
            />

            <Detail
              label="Town"
              value={selectedMember.town}
            />

            <Detail
              label="Postal Code"
              value={
                selectedMember.postalCode
              }
            />
          </DetailsSection>

          <DetailsSection title="Employment Details">
            <Detail
              label="Employment Status"
              value={
                selectedMember.employmentStatus
              }
            />

            <Detail
              label="Occupation"
              value={
                selectedMember.occupation
              }
            />
          </DetailsSection>

          <DetailsSection title="Membership">
            <Detail
              label="Plan"
              value={selectedMember.plan}
            />

            <Detail
              label="Payment Method"
              value={
                selectedMember.paymentMethod
              }
            />

            <Detail
              label="Plan Amount"
              value={
                selectedMember.planAmount
                  ? `R${selectedMember.planAmount}`
                  : "Not available"
              }
            />

            <Detail
              label="Monthly Contribution"
              value={
                selectedMember.monthlyContribution
                  ? `R${selectedMember.monthlyContribution}`
                  : "Not available"
              }
            />
          </DetailsSection>

          <DetailsSection title="Banking Details">
            <Detail
              label="Bank Name"
              value={
                selectedMember.bankName
              }
            />

            <Detail
              label="Account Holder"
              value={
                selectedMember.accountHolder
              }
            />

            <Detail
              label="Account Number"
              value={
                selectedMember.accountNumber
              }
            />

            <Detail
              label="Branch Code"
              value={
                selectedMember.branchCode
              }
            />
          </DetailsSection>

          <DetailsSection title="Beneficiaries">
            {selectedMember.beneficiaries &&
            selectedMember.beneficiaries.length >
              0 ? (
              selectedMember.beneficiaries.map(
                (
                  beneficiary,
                  index
                ) => (
                  <div
                    key={index}
                    style={{
                      marginTop: "15px",
                      padding: "20px",
                      border:
                        "2px solid #d4af37",
                      borderRadius: "8px",
                      background:
                        "#fffdf5",
                    }}
                  >
                    <h4
                      style={{
                        color:
                          "#071a52",
                        marginTop: 0,
                      }}
                    >
                      Beneficiary{" "}
                      {index + 1}
                    </h4>

                    <Detail
                      label="Full Name"
                      value={
                        beneficiary.fullName
                      }
                    />

                    <Detail
                      label="Surname"
                      value={
                        beneficiary.surname
                      }
                    />

                    <Detail
                      label="ID Number"
                      value={
                        beneficiary.idNumber
                      }
                    />

                    <Detail
                      label="Relationship"
                      value={
                        beneficiary.relationship
                      }
                    />

                    <Detail
                      label="Cellphone"
                      value={
                        beneficiary.cellphone
                      }
                    />

                    <Detail
                      label="Percentage"
                      value={
                        beneficiary.percentage
                          ? `${beneficiary.percentage}%`
                          : ""
                      }
                    />
                  </div>
                )
              )
            ) : (
              <p>
                No beneficiaries recorded.
              </p>
            )}
          </DetailsSection>

          {/* POLICY MANAGEMENT */}

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              textAlign: "center",
              background: "#f4f6f9",
              borderRadius: "8px",
              border:
                "1px solid #d4af37",
            }}
          >
            <h3
              style={{
                color: "#071a52",
              }}
            >
              Policy Management
            </h3>

            <p>
              Current Policy Status:
              {" "}
              <PolicyBadge
                status={
                  selectedMember.policyStatus ||
                  "Not Active"
                }
              />
            </p>

            <button
              type="button"
              onClick={() =>
                updateStatus(
                  selectedMember.applicationNumber,
                  "Approved"
                )
              }
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "12px 25px",
                background: "#2e7d32",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              APPROVE MEMBER
            </button>

            <button
              type="button"
              onClick={() =>
                updatePolicyStatus(
                  selectedMember.applicationNumber,
                  "Active"
                )
              }
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "12px 25px",
                background: "#1565c0",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              MARK ACTIVE
            </button>

            <button
              type="button"
              onClick={() =>
                updatePolicyStatus(
                  selectedMember.applicationNumber,
                  "Lapsed"
                )
              }
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "12px 25px",
                background: "#b26a00",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              MARK LAPSED
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus(
                  selectedMember.applicationNumber,
                  "Rejected"
                )
              }
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "12px 25px",
                background: "#c62828",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              REJECT APPLICATION
            </button>

            <button
              type="button"
              onClick={() =>
                deleteMember(
                  selectedMember.applicationNumber
                )
              }
              style={{
                padding: "12px 25px",
                background: "#8b0000",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              DELETE MEMBER
            </button>
          </div>
        </div>
      )}
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

function StatusBadge({ status }) {
  let background = "#f0ad4e";

  if (status === "Approved") {
    background = "#2e7d32";
  }

  if (status === "Rejected") {
    background = "#c62828";
  }

  if (status === "Pending") {
    background = "#f0ad4e";
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

function PolicyBadge({ status }) {
  let background = "#777777";

  if (status === "Active") {
    background = "#2e7d32";
  }

  if (status === "Lapsed") {
    background = "#b26a00";
  }

  if (status === "Not Active") {
    background = "#777777";
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

function DetailsSection({
  title,
  children,
}) {
  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        border: "1px solid #d4af37",
        borderRadius: "8px",
        background: "#ffffff",
      }}
    >
      <h3
        style={{
          color: "#071a52",
          borderBottom:
            "2px solid #d4af37",
          paddingBottom: "10px",
        }}
      >
        {title}
      </h3>

      <div>{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "10px",
        paddingBottom: "8px",
        borderBottom:
          "1px solid #eeeeee",
      }}
    >
      <strong
        style={{
          width: "220px",
          color: "#172554",
        }}
      >
        {label}:
      </strong>

      <span style={{ flex: 1 }}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

const cellStyle = {
  padding: "12px",
  border: "1px solid #dddddd",
  textAlign: "left",
};