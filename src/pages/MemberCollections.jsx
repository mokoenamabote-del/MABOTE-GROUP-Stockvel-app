import React, { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const initialCollections = [
  {
    id: 1,
    membershipNumber: "MAB-0001",
    memberName: "Sample Member",
    plan: "Plan A",
    amountDue: 450,
    amountPaid: 450,
    paymentDate: "2026-08-01",
    paymentMethod: "Bank Transfer",
    status: "Paid",
  },
];

export default function MemberCollections() {
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "maboteCollections"
      );

      return saved
        ? JSON.parse(saved)
        : initialCollections;
    } catch {
      return initialCollections;
    }
  });

  const [approvedMembers, setApprovedMembers] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [formData, setFormData] = useState({
    memberNumber: "",
    membershipNumber: "",
    memberName: "",
    policyNumber: "",
    plan: "Plan A",
    amountDue: "450",
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "Cash",
  });

  /*
   * LOAD APPROVED MEMBERS
   */
  const loadApprovedMembers = () => {
    try {
      const savedMembers = JSON.parse(
        localStorage.getItem("maboteMembers") ||
          "[]"
      );

      if (Array.isArray(savedMembers)) {
        const approved = savedMembers.filter(
          (member) =>
            member.status === "Approved"
        );

        setApprovedMembers(approved);
      } else {
        setApprovedMembers([]);
      }
    } catch (error) {
      console.error(
        "Unable to load approved members:",
        error
      );

      setApprovedMembers([]);
    }
  };

  useEffect(() => {
    loadApprovedMembers();

    apiRequest("/api/contributions")
      .then((result) => {
        if (!Array.isArray(result.contributions)) return;

        setCollections((previous) => [
          ...result.contributions,
          ...previous.filter(
            (localContribution) =>
              !result.contributions.some(
                (remoteContribution) =>
                  remoteContribution.id === localContribution.id
              )
          ),
        ]);
      })
      .catch(() => {
        // Keep legacy local records visible while the backend is unavailable.
      });
  }, []);

  /*
   * SAVE COLLECTIONS
   */
  useEffect(() => {
    localStorage.setItem(
      "maboteCollections",
      JSON.stringify(collections)
    );
  }, [collections]);

  /*
   * HANDLE NORMAL FORM CHANGES
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * SELECT APPROVED MEMBER
   */
  const handleMemberSelect = (event) => {
    const applicationNumber =
      event.target.value;

    const member = approvedMembers.find(
      (item) =>
        item.applicationNumber ===
        applicationNumber
    );

    if (!member) {
      setFormData((previous) => ({
        ...previous,
        memberNumber: "",
        membershipNumber: "",
        memberName: "",
        policyNumber: "",
        plan: "Plan A",
        amountDue: "450",
      }));

      return;
    }

    const memberName =
      `${member.fullName || ""} ${
        member.surname || ""
      }`.trim();

    /*
     * Use the approved member's actual
     * monthly contribution first.
     */
    const memberAmount =
      Number(
        member.monthlyContribution ||
          member.planAmount ||
          0
      );

    setFormData((previous) => ({
      ...previous,

      memberNumber:
        member.memberNumber || "",

      /*
       * Keep membershipNumber for compatibility
       * with existing collection records.
       */
      membershipNumber:
        member.memberNumber ||
        member.applicationNumber ||
        "",

      memberName,

      policyNumber:
        member.policyNumber || "",

      plan:
        member.plan || "Plan A",

      amountDue:
        memberAmount > 0
          ? String(memberAmount)
          : "0",
    }));
  };

  /*
   * RESET FORM
   */
  const resetForm = () => {
    setFormData({
      memberNumber: "",
      membershipNumber: "",
      memberName: "",
      policyNumber: "",
      plan: "Plan A",
      amountDue: "450",
      amountPaid: "",
      paymentDate: "",
      paymentMethod: "Cash",
    });

    setShowForm(false);

    loadApprovedMembers();
  };

  /*
   * CALCULATE PAYMENT STATUS
   */
  const calculateStatus = (
    amountDue,
    amountPaid
  ) => {
    const due = Number(
      amountDue || 0
    );

    const paid = Number(
      amountPaid || 0
    );

    if (paid >= due && due > 0) {
      return "Paid";
    }

    if (paid > 0) {
      return "Partial";
    }

    return "Pending";
  };

  /*
   * ADD COLLECTION
   */
  const addCollection = async () => {
    if (!formData.membershipNumber.trim()) {
      alert(
        "Please select an approved member."
      );

      return;
    }

    if (!formData.memberName.trim()) {
      alert(
        "Member information is missing."
      );

      return;
    }

    if (!formData.amountDue) {
      alert(
        "Amount Due is required."
      );

      return;
    }

    if (!formData.paymentDate) {
      alert(
        "Please select the payment date."
      );

      return;
    }

    const amountDue = Number(
      formData.amountDue
    );

    const amountPaid = Number(
      formData.amountPaid || 0
    );

    if (amountPaid < 0) {
      alert(
        "Amount Paid cannot be negative."
      );

      return;
    }

    /*
     * Make sure the selected member is
     * still approved.
     */
    const selectedMember =
      approvedMembers.find(
        (member) =>
          member.memberNumber ===
            formData.memberNumber ||
          member.applicationNumber ===
            formData.membershipNumber
      );

    if (!selectedMember) {
      alert(
        "This member is no longer available as an approved member. Please refresh the approved member list."
      );

      loadApprovedMembers();

      return;
    }

    const newCollection = {
      id: Date.now(),

      memberNumber:
        selectedMember.memberNumber ||
        formData.memberNumber,

      membershipNumber:
        selectedMember.memberNumber ||
        formData.membershipNumber,

      applicationNumber:
        selectedMember.applicationNumber ||
        "",

      policyNumber:
        selectedMember.policyNumber ||
        formData.policyNumber ||
        "",

      memberName:
        formData.memberName.trim(),

      plan:
        formData.plan,

      amountDue,

      amountPaid,

      paymentDate:
        formData.paymentDate,

      paymentMethod:
        formData.paymentMethod,

      status:
        calculateStatus(
          amountDue,
          amountPaid
        ),

      email: selectedMember.email || "",
    };

    try {
      await apiRequest("/api/contributions", {
        method: "POST",
        body: JSON.stringify(newCollection),
      });
    } catch (error) {
      alert(error.message);
      return;
    }

    setCollections((previous) => [
      newCollection,
      ...previous,
    ]);

    alert(
      `Collection recorded successfully for ${formData.memberName}.`
    );

    resetForm();
  };

  /*
   * MARK COLLECTION AS PAID
   */
  const markAsPaid = (id) => {
    setCollections((previous) =>
      previous.map((collection) => {
        if (collection.id !== id) {
          return collection;
        }

        return {
          ...collection,

          amountPaid:
            collection.amountDue,

          status: "Paid",

          paymentDate:
            collection.paymentDate ||
            new Date()
              .toISOString()
              .split("T")[0],
        };
      })
    );
  };

  /*
   * DELETE COLLECTION
   */
  const removeCollection = (id) => {
    const collection =
      collections.find(
        (item) => item.id === id
      );

    if (!collection) {
      return;
    }

    const confirmed =
      window.confirm(
        `Remove the collection record for ${collection.memberName}?`
      );

    if (!confirmed) {
      return;
    }

    setCollections((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
   * SEARCH
   */
  const filteredCollections =
    collections.filter(
      (collection) => {
        const searchText =
          search.toLowerCase().trim();

        if (!searchText) {
          return true;
        }

        return (
          String(
            collection.memberName || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            collection.membershipNumber ||
              ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            collection.memberNumber || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            collection.plan || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            collection.status || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            collection.policyNumber || ""
          )
            .toLowerCase()
            .includes(searchText)
        );
      }
    );

  /*
   * SUMMARY CALCULATIONS
   */
  const totalDue =
    collections.reduce(
      (total, collection) =>
        total +
        Number(
          collection.amountDue || 0
        ),
      0
    );

  const totalCollected =
    collections.reduce(
      (total, collection) =>
        total +
        Number(
          collection.amountPaid || 0
        ),
      0
    );

  const totalOutstanding =
    Math.max(
      0,
      totalDue - totalCollected
    );

  const paidCount =
    collections.filter(
      (collection) =>
        collection.status ===
        "Paid"
    ).length;

  const partialCount =
    collections.filter(
      (collection) =>
        collection.status ===
        "Partial"
    ).length;

  const pendingCount =
    collections.filter(
      (collection) =>
        collection.status ===
        "Pending"
    ).length;

  return (
    <section className="collections-page">

      {/* HEADER */}

      <div
        style={{
          background: "#071a52",
          color: "#ffffff",
          padding: "25px",
          borderBottom:
            "5px solid #d4af37",
          borderRadius:
            "10px 10px 0 0",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
          }}
        >
          MABOTE GROUP HOLDINGS
        </h1>

        <p
          style={{
            marginBottom: 0,
            fontSize: "1.05rem",
          }}
        >
          Member Collections
        </p>
      </div>

      {/* SUMMARY CARDS */}

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
          title="Total Due"
          value={`R${totalDue.toLocaleString()}`}
          description="Expected contributions"
        />

        <SummaryCard
          title="Total Collected"
          value={`R${totalCollected.toLocaleString()}`}
          description="Payments received"
        />

        <SummaryCard
          title="Outstanding"
          value={`R${totalOutstanding.toLocaleString()}`}
          description="Amount still outstanding"
        />

        <SummaryCard
          title="Paid"
          value={paidCount}
          description="Fully paid records"
        />

        <SummaryCard
          title="Partial"
          value={partialCount}
          description="Partially paid records"
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          description="No payment recorded"
        />
      </div>

      {/* MAIN COLLECTION AREA */}

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

        {/* TITLE + BUTTON */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: "5px",
                color: "#071a52",
              }}
            >
              Monthly Member Collections
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "#555555",
              }}
            >
              Record and monitor approved
              member monthly contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadApprovedMembers();
              setShowForm(!showForm);
            }}
            style={{
              padding: "11px 18px",
              background: "#071a52",
              color: "#ffffff",
              border:
                "2px solid #d4af37",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {showForm
              ? "Close Form"
              : "+ Record Collection"}
          </button>
        </div>

        {/* APPROVED MEMBER INFORMATION */}

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f4f6f9",
            borderRadius: "8px",
            border:
              "1px solid #d4af37",
          }}
        >
          <strong
            style={{
              color: "#071a52",
            }}
          >
            Approved Members Available:
          </strong>{" "}
          {approvedMembers.length}
        </div>

        {/* ADD COLLECTION FORM */}

        {showForm && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#fffdf5",
              border:
                "2px solid #d4af37",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#071a52",
              }}
            >
              Record Member Payment
            </h3>

            {approvedMembers.length ===
            0 ? (
              <div
                style={{
                  padding: "20px",
                  background: "#fff3cd",
                  border:
                    "1px solid #d4af37",
                  borderRadius: "8px",
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    color: "#071a52",
                  }}
                >
                  No Approved Members
                </h4>

                <p>
                  There are currently no
                  approved members available
                  for collection.
                </p>

                <p
                  style={{
                    marginBottom: 0,
                  }}
                >
                  Approve a member under
                  Member Management first.
                </p>
              </div>
            ) : (
              <>
                {/* MEMBER SELECT */}

                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <label>
                    <strong>
                      Select Approved Member *
                    </strong>

                    <select
                      value={
                        formData.memberNumber
                      }
                      onChange={
                        handleMemberSelect
                      }
                      style={inputStyle}
                    >
                      <option value="">
                        -- Select Approved Member --
                      </option>

                      {approvedMembers.map(
                        (member) => {
                          const name =
                            `${member.fullName || ""} ${
                              member.surname || ""
                            }`.trim();

                          return (
                            <option
                              key={
                                member.applicationNumber
                              }
                              value={
                                member.applicationNumber
                              }
                            >
                              {member.memberNumber ||
                                "No Member No."}{" "}
                              —{" "}
                              {name ||
                                "Unnamed Member"}{" "}
                              —{" "}
                              {member.plan ||
                                "No Plan"}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </label>
                </div>

                {/* AUTO-FILLED MEMBER DETAILS */}

                {formData.memberNumber && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "15px",
                      marginBottom: "20px",
                      padding: "18px",
                      background:
                        "#ffffff",
                      border:
                        "1px solid #d4af37",
                      borderRadius: "8px",
                    }}
                  >
                    <ReadOnlyField
                      label="Member Number"
                      value={
                        formData.membershipNumber
                      }
                    />

                    <ReadOnlyField
                      label="Member Name"
                      value={
                        formData.memberName
                      }
                    />

                    <ReadOnlyField
                      label="Policy Number"
                      value={
                        formData.policyNumber
                      }
                    />

                    <ReadOnlyField
                      label="Plan"
                      value={
                        formData.plan
                      }
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <InputField
                    label="Amount Due (R) *"
                    name="amountDue"
                    type="number"
                    value={
                      formData.amountDue
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Monthly contribution"
                  />

                  <InputField
                    label="Amount Paid (R)"
                    name="amountPaid"
                    type="number"
                    value={
                      formData.amountPaid
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Amount received"
                  />

                  <InputField
                    label="Payment Date *"
                    name="paymentDate"
                    type="date"
                    value={
                      formData.paymentDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <div>
                    <label>
                      <strong>
                        Payment Method
                      </strong>

                      <select
                        name="paymentMethod"
                        value={
                          formData.paymentMethod
                        }
                        onChange={
                          handleChange
                        }
                        style={
                          inputStyle
                        }
                      >
                        <option>
                          Cash
                        </option>

                        <option>
                          Bank Transfer
                        </option>

                        <option>
                          EFT
                        </option>

                        <option>
                          Debit Order
                        </option>

                        <option>
                          Card
                        </option>

                        <option>
                          Other
                        </option>
                      </select>
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={
                      addCollection
                    }
                    style={{
                      padding:
                        "11px 22px",
                      background:
                        "#071a52",
                      color:
                        "#ffffff",
                      border:
                        "2px solid #d4af37",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Save Collection
                  </button>

                  <button
                    type="button"
                    onClick={
                      resetForm
                    }
                    style={{
                      padding:
                        "11px 22px",
                      background:
                        "#777777",
                      color:
                        "#ffffff",
                      border:
                        "none",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* SEARCH */}

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <label>
            <strong>
              Search Collections
            </strong>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by member, member number, policy, plan or status..."
              style={{
                ...inputStyle,
                marginTop: "8px",
              }}
            />
          </label>
        </div>

        {/* TABLE */}

        {filteredCollections.length ===
        0 ? (
          <div
            style={{
              marginTop: "20px",
              padding: "30px",
              textAlign: "center",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>
              No collection records found
            </h3>

            <p>
              Record an approved member
              payment to begin.
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
                borderCollapse:
                  "collapse",
                minWidth:
                  "1350px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#071a52",
                    color:
                      "#ffffff",
                  }}
                >
                  <th style={cellStyle}>
                    Member No.
                  </th>

                  <th style={cellStyle}>
                    Member Name
                  </th>

                  <th style={cellStyle}>
                    Policy No.
                  </th>

                  <th style={cellStyle}>
                    Plan
                  </th>

                  <th style={cellStyle}>
                    Amount Due
                  </th>

                  <th style={cellStyle}>
                    Amount Paid
                  </th>

                  <th style={cellStyle}>
                    Outstanding
                  </th>

                  <th style={cellStyle}>
                    Payment Date
                  </th>

                  <th style={cellStyle}>
                    Method
                  </th>

                  <th style={cellStyle}>
                    Status
                  </th>

                  <th style={cellStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCollections.map(
                  (collection) => {
                    const outstanding =
                      Math.max(
                        0,
                        Number(
                          collection.amountDue ||
                            0
                        ) -
                          Number(
                            collection.amountPaid ||
                              0
                          )
                      );

                    return (
                      <tr
                        key={
                          collection.id
                        }
                      >
                        <td
                          style={
                            cellStyle
                          }
                        >
                          <strong>
                            {collection.memberNumber ||
                              collection.membershipNumber ||
                              "Not available"}
                          </strong>
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            collection.memberName
                          }
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {collection.policyNumber ||
                            "-"}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            collection.plan
                          }
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          R
                          {Number(
                            collection.amountDue ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          R
                          {Number(
                            collection.amountPaid ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          <strong>
                            R
                            {outstanding.toLocaleString()}
                          </strong>
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            collection.paymentDate ||
                            "-"
                          }
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            collection.paymentMethod
                          }
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              background:
                                collection.status ===
                                "Paid"
                                  ? "#2e7d32"
                                  : collection.status ===
                                    "Partial"
                                  ? "#d4af37"
                                  : "#c62828",
                              color:
                                collection.status ===
                                "Partial"
                                  ? "#071a52"
                                  : "#ffffff",
                              fontWeight:
                                "bold",
                              fontSize:
                                "0.8rem",
                            }}
                          >
                            {
                              collection.status
                            }
                          </span>
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {collection.status !==
                            "Paid" && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsPaid(
                                  collection.id
                                )
                              }
                              style={actionButton(
                                "#2e7d32"
                              )}
                            >
                              Mark Paid
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeCollection(
                                collection.id
                              )
                            }
                            style={actionButton(
                              "#8b0000"
                            )}
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
    </section>
  );
}

/*
 * SUMMARY CARD
 */
function SummaryCard({
  title,
  value,
  description,
}) {
  return (
    <article
      style={{
        background: "#ffffff",
        border:
          "1px solid #d4af37",
        borderRadius: "10px",
        padding: "20px",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          margin:
            "0 0 10px",
          color: "#071a52",
          fontSize:
            "1rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin:
            "0 0 5px",
          color: "#071a52",
          fontSize:
            "2rem",
          fontWeight:
            "bold",
        }}
      >
        {value}
      </p>

      <p
        style={{
          margin: 0,
          color: "#666666",
          fontSize:
            "0.9rem",
        }}
      >
        {description}
      </p>
    </article>
  );
}

/*
 * INPUT FIELD
 */
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label>
        <strong>
          {label}
        </strong>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
        />
      </label>
    </div>
  );
}

/*
 * READ ONLY FIELD
 */
function ReadOnlyField({
  label,
  value,
}) {
  return (
    <div>
      <label>
        <strong>
          {label}
        </strong>

        <div
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            background:
              "#f5f5f5",
            border:
              "1px solid #cccccc",
            borderRadius: "5px",
            boxSizing:
              "border-box",
          }}
        >
          {value || "Not available"}
        </div>
      </label>
    </div>
  );
}

/*
 * INPUT STYLE
 */
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border:
    "1px solid #cccccc",
  borderRadius: "5px",
  boxSizing:
    "border-box",
};

/*
 * TABLE CELL STYLE
 */
const cellStyle = {
  padding: "12px",
  border:
    "1px solid #dddddd",
  textAlign: "left",
};

/*
 * ACTION BUTTON
 */
const actionButton = (
  background
) => ({
  padding:
    "7px 10px",
  marginRight:
    "5px",
  marginBottom:
    "5px",
  background,
  color:
    "#ffffff",
  border: "none",
  borderRadius:
    "5px",
  cursor:
    "pointer",
  fontWeight:
    "bold",
});