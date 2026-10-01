import React, { useEffect, useState } from "react";

const initialStaff = [];

const initialFormState = {
  name: "",
  role: "Support Staff",
  email: "",
  phone: "",
  status: "Active",
};

const initialBankingDetails = {
  accountHolder: "MABOTE GROUP HOLDINGS",
  bankName: "",
  accountNumber: "",
  branchCode: "",
  accountType: "",
};

const initialPublicSettings = {
  websiteVisible: true,
  clientPortalVisible: true,
  contactPageVisible: true,
};

export default function Settings() {
  const [staff, setStaff] = useState(() => {
    if (typeof window === "undefined") {
      return initialStaff;
    }

    try {
      const saved = window.localStorage.getItem("mabote-staff");
      const savedStaff = saved ? JSON.parse(saved) : initialStaff;
      return Array.isArray(savedStaff)
        ? savedStaff
        : initialStaff;
    } catch (error) {
      console.error("Unable to load staff:", error);
      return initialStaff;
    }
  });

  const [workflowSettings, setWorkflowSettings] = useState(() => {
    if (typeof window === "undefined") {
      return {
        collectionReminders: true,
        monthlyReports: true,
      };
    }

    try {
      const saved = window.localStorage.getItem(
        "mabote-workflow-settings"
      );

      return saved
        ? JSON.parse(saved)
        : {
            collectionReminders: true,
            monthlyReports: true,
          };
    } catch (error) {
      console.error("Unable to load workflow settings:", error);

      return {
        collectionReminders: true,
        monthlyReports: true,
      };
    }
  });

  const [bankingDetails, setBankingDetails] = useState(() => {
    if (typeof window === "undefined") {
      return initialBankingDetails;
    }

    try {
      const saved = window.localStorage.getItem("mabote-banking-details");
      return saved
        ? { ...initialBankingDetails, ...JSON.parse(saved) }
        : initialBankingDetails;
    } catch (error) {
      console.error("Unable to load banking details:", error);
      return initialBankingDetails;
    }
  });

  const [publicSettings, setPublicSettings] = useState(() => {
    if (typeof window === "undefined") {
      return initialPublicSettings;
    }

    try {
      const saved = window.localStorage.getItem("mabote-public-settings");
      return saved
        ? { ...initialPublicSettings, ...JSON.parse(saved) }
        : initialPublicSettings;
    } catch (error) {
      console.error("Unable to load public settings:", error);
      return initialPublicSettings;
    }
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formState, setFormState] =
    useState(initialFormState);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "mabote-staff",
        JSON.stringify(staff)
      );
    }
  }, [staff]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "mabote-workflow-settings",
        JSON.stringify(workflowSettings)
      );
    }
  }, [workflowSettings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "mabote-banking-details",
        JSON.stringify(bankingDetails)
      );
    }
  }, [bankingDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "mabote-public-settings",
        JSON.stringify(publicSettings)
      );
    }
  }, [publicSettings]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleWorkflowChange = (setting) => {
    setWorkflowSettings((previous) => ({
      ...previous,
      [setting]: !previous[setting],
    }));
  };

  const handleBankingChange = (event) => {
    const { name, value } = event.target;

    setBankingDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePublicSettingChange = (setting) => {
    setPublicSettings((previous) => ({
      ...previous,
      [setting]: !previous[setting],
    }));
  };

  const handleAddStaff = () => {
    if (
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.phone.trim()
    ) {
      alert(
        "Please fill in all required fields: Name, Email and Phone."
      );
      return;
    }

    if (editingId !== null) {
      setStaff((previous) =>
        previous.map((member) =>
          member.id === editingId
            ? {
                ...member,
                ...formState,
                name: formState.name.trim(),
                email: formState.email.trim(),
                phone: formState.phone.trim(),
              }
            : member
        )
      );

      alert("Staff member updated successfully.");
    } else {
      const newStaff = {
        id: Date.now(),
        name: formState.name.trim(),
        role: formState.role,
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        status: formState.status,
      };

      setStaff((previous) => [
        newStaff,
        ...previous,
      ]);

      alert("Staff member added successfully.");
    }

    handleCancel();
  };

  const handleEditStaff = (member) => {
    setFormState({
      name: member.name || "",
      role: member.role || "Support Staff",
      email: member.email || "",
      phone: member.phone || "",
      status: member.status || "Active",
    });

    setEditingId(member.id);
    setIsFormOpen(true);
  };

  const handleDeleteStaff = (id) => {
    const member = staff.find(
      (item) => item.id === id
    );

    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name}?`
    );

    if (!confirmed) {
      return;
    }

    setStaff((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    alert("Staff member removed.");
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormState(initialFormState);
  };

  return (
    <section className="settings-page">
      {/* HEADER */}

      <div className="settings-header">
        <div>
          <h2>Settings</h2>

          <p>
            Configure app preferences, team roles,
            and collection workflows.
          </p>
        </div>
      </div>

      <div className="settings-container">
        {/* ROLE MANAGEMENT */}

        <section className="settings-section">
          <div className="section-header">
            <h3>👥 Role Management</h3>

            <p>
              Manage staff members, assign roles,
              and control access levels.
            </p>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setIsFormOpen(true)
              }
              style={{
                marginBottom: "20px",
              }}
            >
              + Add Staff Member
            </button>
          )}

          {/* STAFF FORM */}

          {isFormOpen && (
            <div
              className="staff-form"
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #d4af37",
                borderRadius: "10px",
                backgroundColor: "#f9fafb",
              }}
            >
              <h4
                style={{
                  color: "#071a52",
                  marginTop: 0,
                }}
              >
                {editingId !== null
                  ? "Edit Staff Member"
                  : "Add New Staff Member"}
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <label>
                  Name *

                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Enter staff name"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label>
                  Email *

                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label>
                  Phone *

                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label>
                  Role

                  <select
                    name="role"
                    value={formState.role}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <option>Admin</option>
                    <option>
                      Support Staff
                    </option>
                    <option>
                      Branch Coordinator
                    </option>
                    <option>Treasurer</option>
                    <option>Collector</option>
                  </select>
                </label>

                <label>
                  Status

                  <select
                    name="status"
                    value={formState.status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleAddStaff}
                >
                  {editingId !== null
                    ? "Update Staff"
                    : "Add Staff"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STAFF LIST */}

          <div className="staff-list">
            <h4>
              Current Staff ({staff.length})
            </h4>

            {staff.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                {staff.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #d4af37",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          margin:
                            "0 0 5px 0",
                          color: "#071a52",
                          fontSize: "1rem",
                        }}
                      >
                        {member.name}
                      </h5>

                      <p
                        style={{
                          margin:
                            "0 0 3px 0",
                          fontSize: "0.9em",
                          color: "#666",
                        }}
                      >
                        <strong>
                          Role:
                        </strong>{" "}
                        {member.role}
                      </p>

                      <p
                        style={{
                          margin:
                            "0 0 3px 0",
                          fontSize: "0.9em",
                          color: "#666",
                        }}
                      >
                        <strong>
                          Email:
                        </strong>{" "}
                        {member.email}
                      </p>

                      <p
                        style={{
                          margin:
                            "0 0 3px 0",
                          fontSize: "0.9em",
                          color: "#666",
                        }}
                      >
                        <strong>
                          Phone:
                        </strong>{" "}
                        {member.phone}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9em",
                          color: "#666",
                        }}
                      >
                        <strong>
                          Status:
                        </strong>{" "}
                        <span
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "3px 9px",
                            borderRadius:
                              "20px",
                            backgroundColor:
                              member.status ===
                              "Active"
                                ? "#d4edda"
                                : member.status ===
                                  "Inactive"
                                ? "#f8d7da"
                                : "#fff3cd",
                            color:
                              member.status ===
                              "Active"
                                ? "#155724"
                                : member.status ===
                                  "Inactive"
                                ? "#721c24"
                                : "#856404",
                            fontWeight:
                              "600",
                          }}
                        >
                          {member.status}
                        </span>
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection:
                          "column",
                      }}
                    >
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          handleEditStaff(
                            member
                          )
                        }
                        style={{
                          padding:
                            "7px 12px",
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteStaff(
                            member.id
                          )
                        }
                        style={{
                          padding:
                            "7px 12px",
                          background:
                            "#dc3545",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999" }}>
                No staff members added yet.
              </p>
            )}
          </div>
        </section>

        {/* BANKING DETAILS */}

        <section className="settings-section">
          <div className="section-header">
            <h3>Banking Details</h3>
            <p>Manage the verified account shown on the public EFT payment page.</p>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-grid">
              {[
                ["accountHolder", "Account holder"],
                ["bankName", "Bank name"],
                ["accountNumber", "Account number"],
                ["branchCode", "Branch code"],
                ["accountType", "Account type"],
              ].map(([name, label]) => (
                <label key={name}>
                  <span>{label}</span>
                  <input
                    type="text"
                    name={name}
                    value={bankingDetails[name]}
                    onChange={handleBankingChange}
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </label>
              ))}
            </div>
            <p style={{ marginBottom: 0, color: "#856404" }}>
              EFT details appear publicly only after every field is completed.
            </p>
          </div>
        </section>

        {/* WORKFLOW SETTINGS */}

        {/* PUBLIC WEBSITE CONTROLS */}

        <section className="settings-section">
          <div className="section-header">
            <h3>Public Website Controls</h3>
            <p>Management can control which public experiences are available.</p>
          </div>

          <div className="dashboard-grid">
            {[
              ["websiteVisible", "Public website", "Allow visitors to view the home page."],
              ["clientPortalVisible", "Client portal", "Allow members to enter the client portal."],
              ["contactPageVisible", "Contact page", "Show public contact and support information."],
            ].map(([setting, title, description]) => (
              <article className="dashboard-card" key={setting}>
                <h4>{title}</h4>
                <p>{description}</p>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={publicSettings[setting]}
                    onChange={() => handlePublicSettingChange(setting)}
                  />
                  <span>{publicSettings[setting] ? "Visible to the public" : "Hidden from the public"}</span>
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <div className="section-header">
            <h3>⚙️ Workflow Rules</h3>

            <p>
              Configure collection reminders and
              reporting settings.
            </p>
          </div>

          <div className="dashboard-grid">
            {/* COLLECTION REMINDERS */}

            <article className="dashboard-card">
              <h4>
                Collection Reminders
              </h4>

              <p>
                Automated reminders are scheduled
                3 days before the monthly due date.
              </p>

              <label
                style={{
                  marginTop: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    workflowSettings.collectionReminders
                  }
                  onChange={() =>
                    handleWorkflowChange(
                      "collectionReminders"
                    )
                  }
                />

                <span>
                  Enable collection reminders
                </span>
              </label>

              <p
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  color:
                    workflowSettings.collectionReminders
                      ? "#2e7d32"
                      : "#c62828",
                }}
              >
                {workflowSettings.collectionReminders
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </article>

            {/* MONTHLY REPORTS */}

            <article className="dashboard-card">
              <h4>
                Reporting Cadence
              </h4>

              <p>
                Monthly reports are generated on
                the first business day of each month.
              </p>

              <label
                style={{
                  marginTop: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    workflowSettings.monthlyReports
                  }
                  onChange={() =>
                    handleWorkflowChange(
                      "monthlyReports"
                    )
                  }
                />

                <span>
                  Enable monthly reports
                </span>
              </label>

              <p
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  color:
                    workflowSettings.monthlyReports
                      ? "#2e7d32"
                      : "#c62828",
                }}
              >
                {workflowSettings.monthlyReports
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </article>
          </div>
        </section>

        {/* SYSTEM INFORMATION */}

        <section className="settings-section">
          <div className="section-header">
            <h3>🏢 System Information</h3>

            <p>
              MABOTE GROUP HOLDINGS stockvel application
              information.
            </p>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card">
              <h4>Organisation</h4>
              <p>
                <strong>
                  MABOTE GROUP HOLDINGS
                </strong>
              </p>
              <p>
                Stockvel & Funeral Grocery Scheme
              </p>
            </article>

            <article className="dashboard-card">
              <h4>Application Version</h4>
              <p className="metric-value">
                2026
              </p>
              <p>
                Current application release
              </p>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}