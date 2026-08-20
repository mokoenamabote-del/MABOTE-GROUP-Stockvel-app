import React, { useEffect, useState } from "react";

export default function PolicyStatus() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const loadApplications = () => {
    try {
      const savedApplications = JSON.parse(
        localStorage.getItem("maboteApplications") || "[]"
      );

      if (Array.isArray(savedApplications)) {
        const safeApplications = savedApplications.filter(
          (member) => member && typeof member === "object"
        );

        setApplications(safeApplications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Unable to load policy information:", error);
      setApplications([]);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getPolicyStatus = (member) => {
    if (!member || typeof member !== "object") {
      return "Not Active";
    }

    if (member.policyStatus) {
      return member.policyStatus;
    }

    if (member.status === "Approved") {
      return "Active";
    }

    return "Not Active";
  };

  const activePolicies = applications.filter(
    (member) => getPolicyStatus(member) === "Active"
  );

  const lapsedPolicies = applications.filter(
    (member) => getPolicyStatus(member) === "Lapsed"
  );

  const pendingPolicies = applications.filter(
    (member) =>
      getPolicyStatus(member) === "Not Active" &&
      (!member.status || member.status === "Pending")
  );

  const rejectedPolicies = applications.filter(
    (member) => member.status === "Rejected"
  );

  const filteredApplications = applications.filter((member) => {
    const policyStatus = getPolicyStatus(member);

    const matchesFilter =
      filter === "All" || policyStatus === filter;

    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return matchesFilter;
    }

    const memberName = `${member.fullName || ""} ${
      member.surname || ""
    }`.toLowerCase();

    const applicationNumber = String(
      member.applicationNumber || ""
    ).toLowerCase();

    const policyNumber = String(
      member.policyNumber || ""
    ).toLowerCase();

    const idNumber = String(
      member.idNumber || ""
    ).toLowerCase();

    const cellphone = String(
      member.cellphone || ""
    ).toLowerCase();

    const matchesSearch =
      memberName.includes(searchText) ||
      applicationNumber.includes(searchText) ||
      policyNumber.includes(searchText) ||
      idNumber.includes(searchText) ||
      cellphone.includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const updatePolicyStatus = (applicationNumber, newStatus) => {
    const updatedApplications = applications.map((member) => {
      if (
        member.applicationNumber === applicationNumber
      ) {
        return {
          ...member,
          policyStatus: newStatus,
        };
      }

      return member;
    });

    try {
      localStorage.setItem(
        "maboteApplications",
        JSON.stringify(updatedApplications)
      );

      setApplications(updatedApplications);
    } catch (error) {
      console.error(
        "Unable to save policy status:",
        error
      );
    }
  };

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <section
      className="home-page"
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
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
        <h1
          style={{
            margin: 0,
          }}
        >
          MABOTE GROUP
        </h1>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          Policy Status Management
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
        <PolicySummary
          title="Total Policies"
          value={applications.length}
          description="All applications"
        />

        <PolicySummary
          title="Active Policies"
          value={activePolicies.length}
          description="Currently active"
        />

        <PolicySummary
          title="Lapsed Policies"
          value={lapsedPolicies.length}
          description="Policies requiring attention"
        />

        <PolicySummary
          title="Pending"
          value={pendingPolicies.length}
          description="Awaiting approval"
        />

        <PolicySummary
          title="Rejected"
          value={rejectedPolicies.length}
          description="Rejected applications"
        />
      </div>

      {/* SEARCH AND FILTER */}

      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #d4af37",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#071a52",
          }}
        >
          Find Policy
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(200px, 1fr) 220px",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Search member, ID, cellphone, application or policy number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cfcfcf",
              borderRadius: "6px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <select
            value={filter}
            onChange={(e) =>
              handleFilter(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cfcfcf",
              borderRadius: "6px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          >
            <option value="All">
              All Policies
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Lapsed">
              Lapsed
            </option>

            <option value="Not Active">
              Not Active
            </option>
          </select>
        </div>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <FilterButton
            active={filter === "All"}
            onClick={() =>
              handleFilter("All")
            }
          >
            All
          </FilterButton>

          <FilterButton
            active={filter === "Active"}
            onClick={() =>
              handleFilter("Active")
            }
          >
            Active
          </FilterButton>

          <FilterButton
            active={filter === "Lapsed"}
            onClick={() =>
              handleFilter("Lapsed")
            }
          >
            Lapsed
          </FilterButton>

          <FilterButton
            active={filter === "Not Active"}
            onClick={() =>
              handleFilter("Not Active")
            }
          >
            Not Active
          </FilterButton>

          <button
            type="button"
            onClick={loadApplications}
            style={{
              padding: "9px 16px",
              background: "#ffffff",
              color: "#071a52",
              border: "2px solid #071a52",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* POLICY LIST */}

      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.10)",
          overflowX: "auto",
        }}
      >
        <h2
          style={{
            color: "#071a52",
            marginTop: 0,
          }}
        >
          Policy Register
        </h2>

        {filteredApplications.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>No policies found</h3>

            <p>
              No policies match the current
              search or filter.
            </p>
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
                  background: "#071a52",
                  color: "#ffffff",
                }}
              >
                <th style={cellStyle}>
                  Policy Number
                </th>

                <th style={cellStyle}>
                  Member
                </th>

                <th style={cellStyle}>
                  ID Number
                </th>

                <th style={cellStyle}>
                  Plan
                </th>

                <th style={cellStyle}>
                  Monthly
                </th>

                <th style={cellStyle}>
                  Application
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
              {filteredApplications.map(
                (member, index) => {
                  const policyStatus =
                    getPolicyStatus(member);

                  const rowKey =
                    member.applicationNumber ||
                    member.policyNumber ||
                    member.idNumber ||
                    `policy-${index}`;

                  return (
                    <tr key={rowKey}>
                      <td style={cellStyle}>
                        {member.policyNumber ||
                          "Not available"}
                      </td>

                      <td style={cellStyle}>
                        {member.fullName || ""}{" "}
                        {member.surname || ""}
                      </td>

                      <td style={cellStyle}>
                        {member.idNumber ||
                          "Not provided"}
                      </td>

                      <td style={cellStyle}>
                        {member.plan ||
                          "Not selected"}
                      </td>

                      <td style={cellStyle}>
                        {member.monthlyContribution !==
                        undefined &&
                        member.monthlyContribution !==
                        null &&
                        member.monthlyContribution !==
                        ""
                          ? `R${member.monthlyContribution}`
                          : "Not available"}
                      </td>

                      <td style={cellStyle}>
                        <StatusBadge
                          status={
                            member.status ||
                            "Pending"
                          }
                        />
                      </td>

                      <td style={cellStyle}>
                        <PolicyBadge
                          status={policyStatus}
                        />
                      </td>

                      <td style={cellStyle}>
                        <button
                          type="button"
                          onClick={() =>
                            updatePolicyStatus(
                              member.applicationNumber,
                              "Active"
                            )
                          }
                          style={{
                            marginRight: "5px",
                            marginBottom: "5px",
                            padding: "7px 10px",
                            background: "#2e7d32",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Active
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updatePolicyStatus(
                              member.applicationNumber,
                              "Lapsed"
                            )
                          }
                          style={{
                            padding: "7px 10px",
                            background: "#b26a00",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Lapse
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function PolicySummary({
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

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "9px 16px",
        background: active
          ? "#071a52"
          : "#ffffff",
        color: active
          ? "#ffffff"
          : "#071a52",
        border: "2px solid #071a52",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
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

const cellStyle = {
  padding: "12px",
  border: "1px solid #dddddd",
  textAlign: "left",
};