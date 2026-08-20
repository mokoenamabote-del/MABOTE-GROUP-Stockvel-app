import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [collectionRecords, setCollectionRecords] = useState([]);

  /*
   * LOAD COLLECTION RECORDS
   */
  const loadCollections = () => {
    try {
      const savedRecords = localStorage.getItem(
        "maboteCollections"
      );

      const records = savedRecords
        ? JSON.parse(savedRecords)
        : [];

      setCollectionRecords(
        Array.isArray(records) ? records : []
      );
    } catch (error) {
      console.error(
        "Unable to load collection records:",
        error
      );

      setCollectionRecords([]);
    }
  };

  useEffect(() => {
    loadCollections();

    const handleStorageChange = () => {
      loadCollections();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /*
   * DASHBOARD COUNTS
   */

  const totalCollections =
    collectionRecords.length;

  const collectedCount =
    collectionRecords.filter(
      (record) =>
        String(record.status || "").toLowerCase() ===
        "collected"
    ).length;

  const outstandingCount =
    collectionRecords.filter((record) => {
      const status = String(
        record.status || ""
      ).toLowerCase();

      return (
        status === "outstanding" ||
        status === "pending"
      );
    }).length;

  /*
   * TOTAL MEMBERS
   *
   * Reads the existing member storage if available.
   */
  const [totalMembers, setTotalMembers] =
    useState(0);

  useEffect(() => {
    try {
      const possibleKeys = [
        "maboteMembers",
        "members",
        "maboteApplications",
      ];

      let membersFound = [];

      for (const key of possibleKeys) {
        const saved = localStorage.getItem(key);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            membersFound = parsed;
            break;
          }
        }
      }

      setTotalMembers(membersFound.length);
    } catch (error) {
      console.error(
        "Unable to load member count:",
        error
      );

      setTotalMembers(0);
    }
  }, []);

  /*
   * QUICK ACTIONS
   */
  const quickActions = [
    {
      title: "Members",
      description:
        "View and manage registered members.",
      icon: "👥",
      path: "/members",
    },
    {
      title: "Grocery Packages",
      description:
        "Manage funeral grocery packages.",
      icon: "📦",
      path: "/packages",
    },
    {
      title: "Member Collections",
      description:
        "Record and review member collections.",
      icon: "💰",
      path: "/collections",
    },
    {
      title: "Policy Status",
      description:
        "Check active, pending and lapsed policies.",
      icon: "📋",
      path: "/policy-status",
    },
    {
      title: "Claims",
      description:
        "Review and manage member claims.",
      icon: "📝",
      path: "/claims",
    },
    {
      title: "Reports",
      description:
        "View operational and financial reports.",
      icon: "📊",
      path: "/reports",
    },
    {
      title: "Settings",
      description:
        "Manage application settings.",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  /*
   * RECENT COLLECTIONS
   */
  const recentCollections =
    collectionRecords.slice(0, 5);

  /*
   * LOGOUT
   */
  const handleLogout = () => {
    localStorage.removeItem(
      "maboteLoggedIn"
    );

    navigate("/login");
  };

  return (
    <section className="admin-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>

          <p>
            Welcome to the MABOTE GROUP Stockvel
            administration centre.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="dashboard-grid">

        <article className="dashboard-card">
          <h3>Total Members</h3>

          <p className="metric-value">
            {totalMembers}
          </p>

          <p className="metric-detail">
            Registered members
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Grocery Packages</h3>

          <p className="metric-value">
            248
          </p>

          <p className="metric-detail">
            Packages in the current cycle
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Member Collections</h3>

          <p className="metric-value">
            {totalCollections}
          </p>

          <p className="metric-detail">
            Collection records
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Collected</h3>

          <p className="metric-value">
            {collectedCount}
          </p>

          <p className="metric-detail">
            Completed collections
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Outstanding</h3>

          <p className="metric-value">
            {outstandingCount}
          </p>

          <p className="metric-detail">
            Pending or outstanding collections
          </p>
        </article>

        <article className="dashboard-card">
          <h3>Available Stock</h3>

          <p className="metric-value">
            82
          </p>

          <p className="metric-detail">
            Grocery units currently available
          </p>
        </article>

      </div>

      {/* =========================================
          QUICK ACTIONS
      ========================================== */}

      <article className="dashboard-card dashboard-card--wide">

        <h3>Quick Actions</h3>

        <p>
          Select an area below to manage the
          MABOTE GROUP Stockvel.
        </p>

        <div className="report-grid">

          {quickActions.map((action) => (
            <button
              key={action.path}
              type="button"
              className="report-card"
              onClick={() =>
                navigate(action.path)
              }
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "8px",
                }}
              >
                {action.icon}
              </div>

              <h4>{action.title}</h4>

              <p className="report-note">
                {action.description}
              </p>
            </button>
          ))}

        </div>

      </article>

      {/* =========================================
          MONTHLY SUMMARY
      ========================================== */}

      <article className="dashboard-card dashboard-card--wide">

        <h3>
          Monthly Distribution Summary
        </h3>

        <p>
          Overview of grocery package
          distribution and collections.
        </p>

        <div
          className="summary-table"
          role="table"
          aria-label="Monthly distribution summary"
        >

          <div
            className="summary-row summary-row--header"
            role="row"
          >
            <span role="columnheader">
              Month
            </span>

            <span role="columnheader">
              Distributed
            </span>

            <span role="columnheader">
              Collected
            </span>

            <span role="columnheader">
              Outstanding
            </span>
          </div>

          <div
            className="summary-row"
            role="row"
          >
            <span role="cell">
              January
            </span>

            <span role="cell">
              42
            </span>

            <span role="cell">
              39
            </span>

            <span role="cell">
              3
            </span>
          </div>

          <div
            className="summary-row"
            role="row"
          >
            <span role="cell">
              February
            </span>

            <span role="cell">
              48
            </span>

            <span role="cell">
              46
            </span>

            <span role="cell">
              2
            </span>
          </div>

          <div
            className="summary-row"
            role="row"
          >
            <span role="cell">
              March
            </span>

            <span role="cell">
              51
            </span>

            <span role="cell">
              49
            </span>

            <span role="cell">
              2
            </span>
          </div>

        </div>

      </article>

      {/* =========================================
          RECENT COLLECTIONS
      ========================================== */}

      <article className="dashboard-card dashboard-card--wide">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <div>
            <h3>
              Recent Collections
            </h3>

            <p>
              Latest member collection records.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/collections")
            }
          >
            VIEW ALL COLLECTIONS
          </button>

        </div>

        <div className="collection-list">

          {recentCollections.length === 0 ? (
            <article className="collection-card">

              <p>
                No collection records have been
                recorded yet.
              </p>

            </article>
          ) : (
            recentCollections.map(
              (record) => (
                <article
                  key={record.id}
                  className="collection-card"
                >

                  <p>
                    <strong>
                      {record.memberName ||
                        "Member"}
                    </strong>
                  </p>

                  <p>
                    Reference:{" "}
                    {record.membershipNumber ||
                      record.applicationNumber ||
                      record.idNumber ||
                      "Not provided"}
                  </p>

                  <p>
                    Package:{" "}
                    {record.packageMonth ||
                      "Not provided"}
                  </p>

                  <p>
                    Collection Date:{" "}
                    {record.collectionDate ||
                      record.paymentDate ||
                      "Not provided"}
                  </p>

                  <p>
                    Status:{" "}
                    {record.status ||
                      "Not provided"}
                  </p>

                </article>
              )
            )
          )}

        </div>

      </article>

      {/* =========================================
          SYSTEM INFORMATION
      ========================================== */}

      <article className="dashboard-card dashboard-card--wide">

        <h3>
          MABOTE GROUP Administration
        </h3>

        <p>
          Use the navigation menu or Quick Actions
          above to manage members, grocery packages,
          collections, policies, claims, reports
          and system settings.
        </p>

      </article>

    </section>
  );
}