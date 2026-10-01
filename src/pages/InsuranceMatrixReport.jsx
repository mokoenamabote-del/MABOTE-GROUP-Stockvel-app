import React, { useEffect, useState } from "react";

export default function InsuranceMatrixReport() {
  const [members, setMembers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = () => {
    const savedMembers = JSON.parse(
      localStorage.getItem("maboteApplications") || "[]"
    );

    const savedCollections = JSON.parse(
      localStorage.getItem("maboteCollections") || "[]"
    );

    setMembers(savedMembers);
    setCollections(savedCollections);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getMemberPayments = (member) => {
    return collections.filter(
      (collection) =>
        collection.applicationNumber ===
        member.applicationNumber
    );
  };

  const getPolicyStatus = (member) => {
    const payments = getMemberPayments(member);

    if (payments.length === 0) {
      return "NO PAYMENT";
    }

    const latestPayment = [...payments].sort(
      (a, b) =>
        new Date(b.paymentDate) -
        new Date(a.paymentDate)
    )[0];

    const paymentDate = new Date(
      latestPayment.paymentDate
    );

    const today = new Date();

    const daysSincePayment = Math.floor(
      (today - paymentDate) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSincePayment <= 30) {
      return "ACTIVE";
    }

    if (daysSincePayment <= 45) {
      return "DUE";
    }

    return "LAPSED";
  };

  const getStatusColor = (status) => {
    if (status === "ACTIVE") {
      return "#15803d";
    }

    if (status === "DUE") {
      return "#d97706";
    }

    return "#b91c1c";
  };

  const getTotalPaid = (member) => {
    const payments = getMemberPayments(member);

    return payments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );
  };

  const filteredMembers = members.filter(
    (member) => {
      const searchText = search.toLowerCase();

      const name =
        `${member.fullName || ""} ${
          member.surname || ""
        }`.toLowerCase();

      return (
        name.includes(searchText) ||
        (member.applicationNumber || "")
          .toLowerCase()
          .includes(searchText) ||
        (member.policyNumber || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const activeCount = members.filter(
    (member) =>
      getPolicyStatus(member) === "ACTIVE"
  ).length;

  const dueCount = members.filter(
    (member) =>
      getPolicyStatus(member) === "DUE"
  ).length;

  const lapsedCount = members.filter(
    (member) =>
      getPolicyStatus(member) === "LAPSED"
  ).length;

  const noPaymentCount = members.filter(
    (member) =>
      getPolicyStatus(member) === "NO PAYMENT"
  ).length;

  const totalContributions = collections.reduce(
    (total, collection) =>
      total + Number(collection.amount || 0),
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "#071a52",
            color: "white",
            padding: "25px",
            borderRadius: "10px 10px 0 0",
            borderBottom: "5px solid #d4af37",
          }}
        >
          <h1 style={{ margin: 0 }}>
            MABOTE GROUP PTY(LTD)
          </h1>

          <p
            style={{
              color: "#d4af37",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            INSURANCE MATRIX REPORT
          </p>
        </div>

        {/* SUMMARY */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <SummaryCard
            title="TOTAL MEMBERS"
            value={members.length}
            color="#071a52"
          />

          <SummaryCard
            title="ACTIVE"
            value={activeCount}
            color="#15803d"
          />

          <SummaryCard
            title="DUE"
            value={dueCount}
            color="#d97706"
          />

          <SummaryCard
            title="LAPSED"
            value={lapsedCount}
            color="#b91c1c"
          />

          <SummaryCard
            title="NO PAYMENT"
            value={noPaymentCount}
            color="#7f1d1d"
          />

          <SummaryCard
            title="TOTAL CONTRIBUTIONS"
            value={`R ${totalContributions.toFixed(
              2
            )}`}
            color="#d4af37"
          />
        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "white",
            padding: "25px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search member, application number or policy number..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "14px",
                boxSizing: "border-box",
                border: "1px solid #ccc",
                borderRadius: "7px",
                fontSize: "15px",
              }}
            />

            <button
              type="button"
              onClick={loadData}
              style={{
                padding: "12px 20px",
                background: "#071a52",
                color: "white",
                border:
                  "2px solid #d4af37",
                borderRadius: "7px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              REFRESH
            </button>
          </div>
        </div>

        {/* MATRIX */}

        <div
          style={{
            background: "white",
            padding: "25px",
            marginTop: "20px",
            borderRadius: "10px",
            overflowX: "auto",
          }}
        >
          <h2 style={{ color: "#071a52" }}>
            Insurance Matrix
          </h2>

          {filteredMembers.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                background: "#f4f6f9",
                borderRadius: "8px",
              }}
            >
              <h3>No members found</h3>

              <p>
                Approved member applications will
                appear in this report.
              </p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#071a52",
                    color: "white",
                  }}
                >
                  <th style={cellStyle}>
                    Member
                  </th>

                  <th style={cellStyle}>
                    Application No.
                  </th>

                  <th style={cellStyle}>
                    Policy No.
                  </th>

                  <th style={cellStyle}>
                    Plan
                  </th>

                  <th style={cellStyle}>
                    Payments
                  </th>

                  <th style={cellStyle}>
                    Total Paid
                  </th>

                  <th style={cellStyle}>
                    Policy Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map(
                  (member) => {
                    const payments =
                      getMemberPayments(member);

                    const status =
                      getPolicyStatus(member);

                    const totalPaid =
                      getTotalPaid(member);

                    return (
                      <tr
                        key={
                          member.applicationNumber
                        }
                      >
                        <td style={bodyCellStyle}>
                          {member.fullName}{" "}
                          {member.surname}
                        </td>

                        <td style={bodyCellStyle}>
                          {
                            member.applicationNumber
                          }
                        </td>

                        <td style={bodyCellStyle}>
                          {member.policyNumber}
                        </td>

                        <td style={bodyCellStyle}>
                          {member.plan ||
                            "Not selected"}
                        </td>

                        <td style={bodyCellStyle}>
                          {payments.length}
                        </td>

                        <td style={bodyCellStyle}>
                          R{" "}
                          {totalPaid.toFixed(2)}
                        </td>

                        <td style={bodyCellStyle}>
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "7px 12px",
                              borderRadius:
                                "20px",
                              background:
                                getStatusColor(
                                  status
                                ),
                              color: "white",
                              fontWeight:
                                "bold",
                            }}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            padding: "20px",
            color: "#071a52",
            fontWeight: "bold",
          }}
        >
          MABOTE GROUP PTY(LTD) © 2026
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        borderTop: `5px solid ${color}`,
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          color,
          fontSize: "25px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
};

const bodyCellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};