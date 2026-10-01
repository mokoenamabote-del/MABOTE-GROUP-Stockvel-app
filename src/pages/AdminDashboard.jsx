import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../lib/auth";
import "./AdminDashboard.css";

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
    clearAuthSession();
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
    <div className="admin-shell">
      <div className="admin-container">
        <header className="admin-topbar">
          <div className="admin-topbar-inner">
            <div className="admin-brand-block">
              <div className="admin-brand-mark">MG</div>
              <div>
                <h1>MABOTE GROUP HOLDINGS</h1>
                <p>Admin dashboard</p>
              </div>
            </div>

            <button type="button" onClick={handleLogout} className="admin-logout">
              Logout
            </button>
          </div>
        </header>

        <section className="admin-hero">
          <h2>Welcome to the dashboard</h2>
          <p>
            Manage members, collections, contributions, policies, claims and reporting from one central place.
          </p>

          <div className="admin-metrics">
            <div className="metric-card">
              <p>Total Members</p>
              <h3>{memberCount}</h3>
            </div>

            <div className="metric-card">
              <p>Total Collections</p>
              <h3>{totalCollections}</h3>
            </div>

            <div className="metric-card">
              <p>Collected Amount</p>
              <h3>{formatCurrency(collectedAmount)}</h3>
            </div>

            <div className="metric-card">
              <p>Pending</p>
              <h3>{pendingCollections}</h3>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="section-header">
            <h3>Quick actions</h3>
          </div>

          <div className="quick-grid">
            {quickActions.map((action) => (
              <div key={action.path} className="action-card">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
                <button type="button" onClick={() => navigate(action.path)}>
                  {action.button}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="summary-card">
            <h3>Monthly summary</h3>
            <p>
              MABOTE GROUP HOLDINGS is currently managing <strong>{memberCount}</strong> members with <strong>{totalCollections}</strong> recorded collections.
            </p>
            <p>
              Total recorded contributions: <strong>{formatCurrency(collectedAmount)}</strong>
            </p>
            <p>
              Pending collections: <strong>{pendingCollections}</strong>
            </p>
          </div>
        </section>

        <section className="admin-section">
          <div className="table-card">
            <h3>Recent collections</h3>

            {collections.length === 0 ? (
              <p className="empty-state">No collections have been recorded yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.slice(-5).reverse().map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{item.memberName || item.name || item.member || "Member"}</td>
                        <td>{formatCurrency(item.amount || item.collectionAmount || item.paidAmount || 0)}</td>
                        <td>{item.status || "Recorded"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}