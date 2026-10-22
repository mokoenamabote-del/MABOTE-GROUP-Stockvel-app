import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load collections
    try {
      const savedCollections =
        localStorage.getItem("maboteCollections");

      if (savedCollections) {
        const parsedCollections = JSON.parse(savedCollections);

        if (Array.isArray(parsedCollections)) {
          setCollections(parsedCollections);
        }
      }
    } catch (error) {
      console.error("Could not load collections:", error);
      setCollections([]);
    }

    // Load members from available storage
    try {
      const possibleMemberKeys = [
        "maboteMembers",
        "members",
        "maboteApplications",
      ];

      let foundMembers = [];

      for (const key of possibleMemberKeys) {
        const savedMembers = localStorage.getItem(key);

        if (savedMembers) {
          try {
            const parsedMembers = JSON.parse(savedMembers);

            if (Array.isArray(parsedMembers)) {
              foundMembers = parsedMembers;
              break;
            }
          } catch (error) {
            console.error(`Could not read ${key}:`, error);
          }
        }
      }

      setMemberCount(foundMembers.length);
    } catch (error) {
      console.error("Could not load members:", error);
      setMemberCount(0);
    }
  };

  const totalCollections = collections.length;

  const collectedAmount = collections.reduce((total, item) => {
    const amount = Number(
      item.amount ||
      item.collectionAmount ||
      item.paidAmount ||
      0
    );

    return total + amount;
  }, 0);

  const pendingCollections = collections.filter((item) => {
    const status = String(item.status || "").toLowerCase();

    return (
      status === "pending" ||
      status === "outstanding" ||
      status === "unpaid"
    );
  }).length;

  const formatCurrency = (amount) => {
    return `R${Number(amount).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("maboteAuthToken");
    navigate("/login");
  };

  const quickActions = [
    {
      title: "Members",
      description: "Manage MABOTE GROUP HOLDINGS members.",
      button: "OPEN MEMBERS",
      path: "/members",
    },
    {
      title: "Grocery Packages",
      description: "View and manage funeral grocery packages.",
      button: "VIEW PACKAGES",
      path: "/packages",
    },
    {
      title: "Member Collections",
      description: "Record and monitor member contributions.",
      button: "VIEW COLLECTIONS",
      path: "/collections",
    },
    {
      title: "Policy Status",
      description: "Check member policy information.",
      button: "VIEW POLICIES",
      path: "/policy-status",
    },
    {
      title: "Claims",
      description: "Manage and review member claims.",
      button: "VIEW CLAIMS",
      path: "/claims",
    },
    {
      title: "Reports",
      description: "View financial and membership reports.",
      button: "VIEW REPORTS",
      path: "/reports",
    },
    {
      title: "Settings",
      description: "Manage application settings.",
      button: "OPEN SETTINGS",
      path: "/settings",
    },
    {
      title: "Human Resources",
      description: "Manage permanent staff, recruitment, payroll, and contracts.",
      button: "OPEN HUMAN RESOURCES",
      path: "/admin/hr",
    },
    {
      title: "Member Application",
      description: "Register a new MABOTE GROUP HOLDINGS member.",
      button: "NEW APPLICATION",
      path: "/member-registration",
    },
    {
      title: "Print Materials",
      description: "Print the application form or promotional flyer.",
      button: "OPEN PRINT CENTRE",
      path: "/admin/print-materials",
    },
    {
      title: "Payment Materials",
      description: "Review payment instructions and print the debit-order form.",
      button: "OPEN PAYMENT MATERIALS",
      path: "/admin/payments",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* Dashboard Header */}
      <div
        style={{
          background: "#0b2a5b",
          color: "white",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            MABOTE GROUP HOLDINGS
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              opacity: 0.9,
            }}
          >
            Admin Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#d4af37",
            color: "#111",
            border: "none",
            padding: "12px 22px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Welcome */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#0b2a5b",
          }}
        >
          Welcome to the MABOTE GROUP HOLDINGS Dashboard
        </h2>

        <p style={{ marginBottom: 0 }}>
          Manage members, contributions, grocery packages,
          policies, claims and reports from one place.
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            Total Members
          </p>

          <h2
            style={{
              margin: "10px 0 0",
              color: "#0b2a5b",
            }}
          >
            {memberCount}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            Total Collections
          </p>

          <h2
            style={{
              margin: "10px 0 0",
              color: "#0b2a5b",
            }}
          >
            {totalCollections}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            Collected Amount
          </p>

          <h2
            style={{
              margin: "10px 0 0",
              color: "#0b2a5b",
            }}
          >
            {formatCurrency(collectedAmount)}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            Pending Collections
          </p>

          <h2
            style={{
              margin: "10px 0 0",
              color: "#0b2a5b",
            }}
          >
            {pendingCollections}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <h2
        style={{
          color: "#0b2a5b",
          marginBottom: "18px",
        }}
      >
        Quick Actions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {quickActions.map((action) => (
          <div
            key={action.path}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "22px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#0b2a5b",
              }}
            >
              {action.title}
            </h3>

            <p
              style={{
                color: "#666",
                minHeight: "45px",
              }}
            >
              {action.description}
            </p>

            <button
              onClick={() => navigate(action.path)}
              style={{
                background: "#0b2a5b",
                color: "white",
                border: "none",
                padding: "11px 16px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {action.button}
            </button>
          </div>
        ))}
      </div>

      {/* Monthly Summary */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#0b2a5b",
          }}
        >
          Monthly Summary
        </h2>

        <p>
          MABOTE GROUP HOLDINGS is currently managing{" "}
          <strong>{memberCount}</strong> members with{" "}
          <strong>{totalCollections}</strong> recorded
          collections.
        </p>

        <p>
          Total recorded contributions:{" "}
          <strong>{formatCurrency(collectedAmount)}</strong>
        </p>

        <p>
          Pending collections:{" "}
          <strong>{pendingCollections}</strong>
        </p>
      </div>

      {/* Recent Collections */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#0b2a5b",
          }}
        >
          Recent Collections
        </h2>

        {collections.length === 0 ? (
          <p style={{ color: "#666" }}>
            No collections have been recorded yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Member
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Amount
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {collections.slice(-5).reverse().map((item, index) => (
                  <tr key={item.id || index}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.memberName ||
                        item.name ||
                        item.member ||
                        "Member"}
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {formatCurrency(
                        item.amount ||
                          item.collectionAmount ||
                          item.paidAmount ||
                          0
                      )}
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.status || "Recorded"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}