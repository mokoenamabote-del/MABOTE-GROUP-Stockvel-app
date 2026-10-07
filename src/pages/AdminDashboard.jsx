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
    localStorage.removeItem("maboteAccount");
    navigate("/login");
  };

  const quickActions = [
    {
      title: "Members",
      description: "Manage MABOTE GROUP members.",
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
      title: "Member Application",
      description: "Register a new MABOTE GROUP member.",
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
        background: "linear-gradient(180deg, #f4f7fb 0%, #edf3ff 100%)",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* Dashboard Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2a5b 0%, #123d7a 45%, #0d2143 100%)",
          color: "white",
          borderRadius: "18px",
          padding: "28px 30px",
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          boxShadow: "0 18px 32px rgba(11, 42, 91, 0.18)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            MABOTE GROUP
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
            background: "linear-gradient(135deg, #d4af37 0%, #c89d2f 100%)",
            color: "#111",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(212, 175, 55, 0.22)",
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Welcome */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
          borderRadius: "18px",
          padding: "25px 26px",
          marginBottom: "25px",
          boxShadow: "0 12px 22px rgba(11, 42, 91, 0.06)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            background: "linear-gradient(180deg, #d4af37 0%, #c89d2f 100%)",
          }}
        />
        <div style={{ paddingLeft: "18px" }}>
          <h2
            style={{
              marginTop: 0,
              color: "#0b2a5b",
            }}
          >
            Welcome to the MABOTE GROUP Dashboard
          </h2>

          <p style={{ marginBottom: 0, color: "#52607a" }}>
            Manage members, contributions, grocery packages,
            policies, claims and reports from one place.
          </p>
        </div>
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
            background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(11, 42, 91, 0.06)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <p style={{ margin: 0, color: "#66728a", fontWeight: 700 }}>
            Total Members
          </p>

          <h2
            style={{
              margin: "12px 0 0",
              color: "#0b2a5b",
              fontSize: "2rem",
            }}
          >
            {memberCount}
          </h2>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(11, 42, 91, 0.06)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <p style={{ margin: 0, color: "#66728a", fontWeight: 700 }}>
            Total Collections
          </p>

          <h2
            style={{
              margin: "12px 0 0",
              color: "#0b2a5b",
              fontSize: "2rem",
            }}
          >
            {totalCollections}
          </h2>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(11, 42, 91, 0.06)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <p style={{ margin: 0, color: "#66728a", fontWeight: 700 }}>
            Collected Amount
          </p>

          <h2
            style={{
              margin: "12px 0 0",
              color: "#0b2a5b",
              fontSize: "2rem",
            }}
          >
            {formatCurrency(collectedAmount)}
          </h2>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 12px 24px rgba(11, 42, 91, 0.06)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <p style={{ margin: 0, color: "#66728a", fontWeight: 700 }}>
            Pending Collections
          </p>

          <h2
            style={{
              margin: "12px 0 0",
              color: "#0b2a5b",
              fontSize: "2rem",
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
              background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 12px 22px rgba(11, 42, 91, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
                color: "#556179",
                minHeight: "45px",
                lineHeight: "1.55",
              }}
            >
              {action.description}
            </p>

            <button
              onClick={() => navigate(action.path)}
              style={{
                background: "linear-gradient(135deg, #0b2a5b 0%, #123d7a 100%)",
                color: "white",
                border: "none",
                padding: "11px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 8px 18px rgba(11, 42, 91, 0.12)",
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
          background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
          borderRadius: "18px",
          padding: "25px 26px",
          marginBottom: "25px",
          boxShadow: "0 12px 22px rgba(11, 42, 91, 0.06)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderLeft: "5px solid #d4af37",
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

        <p style={{ color: "#49566f" }}>
          MABOTE GROUP is currently managing{" "}
          <strong>{memberCount}</strong> members with{" "}
          <strong>{totalCollections}</strong> recorded
          collections.
        </p>

        <p style={{ color: "#49566f" }}>
          Total recorded contributions:{" "}
          <strong>{formatCurrency(collectedAmount)}</strong>
        </p>

        <p style={{ color: "#49566f", marginBottom: 0 }}>
          Pending collections:{" "}
          <strong>{pendingCollections}</strong>
        </p>
      </div>

      {/* Recent Collections */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)",
          borderRadius: "18px",
          padding: "25px 26px",
          boxShadow: "0 12px 22px rgba(11, 42, 91, 0.06)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
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
          <p style={{ color: "#66728a" }}>
            No collections have been recorded yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#0b2a5b", color: "#fff" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    Member
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    Amount
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {collections.slice(-5).reverse().map((item, index) => (
                  <tr
                    key={item.id || index}
                    style={{
                      background: index % 2 === 0 ? "#fff" : "#fafcff",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid #edf1f6",
                        color: "#1f2d3d",
                      }}
                    >
                      {item.memberName ||
                        item.name ||
                        item.member ||
                        "Member"}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid #edf1f6",
                        color: "#1f2d3d",
                        fontWeight: 600,
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
                        padding: "12px 14px",
                        borderBottom: "1px solid #edf1f6",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "#fff7da",
                          color: "#7a5a00",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        {item.status || "Recorded"}
                      </span>
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