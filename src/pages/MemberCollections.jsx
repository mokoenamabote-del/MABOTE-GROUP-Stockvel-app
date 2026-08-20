import React, { useEffect, useState } from "react";

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
      const saved = localStorage.getItem("maboteCollections");

      return saved
        ? JSON.parse(saved)
        : initialCollections;
    } catch {
      return initialCollections;
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    membershipNumber: "",
    memberName: "",
    plan: "Plan A",
    amountDue: "450",
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    localStorage.setItem(
      "maboteCollections",
      JSON.stringify(collections)
    );
  }, [collections]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      membershipNumber: "",
      memberName: "",
      plan: "Plan A",
      amountDue: "450",
      amountPaid: "",
      paymentDate: "",
      paymentMethod: "Cash",
    });

    setShowForm(false);
  };

  const calculateStatus = (amountDue, amountPaid) => {
    const due = Number(amountDue || 0);
    const paid = Number(amountPaid || 0);

    if (paid >= due) {
      return "Paid";
    }

    if (paid > 0) {
      return "Partial";
    }

    return "Pending";
  };

  const addCollection = () => {
    if (
      !formData.membershipNumber.trim() ||
      !formData.memberName.trim() ||
      !formData.amountDue ||
      !formData.paymentDate
    ) {
      alert(
        "Please complete Membership Number, Member Name, Amount Due and Payment Date."
      );

      return;
    }

    const amountDue = Number(formData.amountDue);
    const amountPaid = Number(formData.amountPaid || 0);

    const newCollection = {
      id: Date.now(),
      membershipNumber:
        formData.membershipNumber.trim(),
      memberName: formData.memberName.trim(),
      plan: formData.plan,
      amountDue,
      amountPaid,
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      status: calculateStatus(
        amountDue,
        amountPaid
      ),
    };

    setCollections((previous) => [
      newCollection,
      ...previous,
    ]);

    resetForm();
  };

  const markAsPaid = (id) => {
    setCollections((previous) =>
      previous.map((collection) => {
        if (collection.id !== id) {
          return collection;
        }

        return {
          ...collection,
          amountPaid: collection.amountDue,
          status: "Paid",
          paymentDate:
            collection.paymentDate ||
            new Date().toISOString().split("T")[0],
        };
      })
    );
  };

  const removeCollection = (id) => {
    const collection = collections.find(
      (item) => item.id === id
    );

    if (!collection) {
      return;
    }

    const confirmed = window.confirm(
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

  const filteredCollections = collections.filter(
    (collection) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        collection.memberName
          .toLowerCase()
          .includes(searchText) ||
        collection.membershipNumber
          .toLowerCase()
          .includes(searchText) ||
        collection.plan
          .toLowerCase()
          .includes(searchText) ||
        collection.status
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const totalDue = collections.reduce(
    (total, collection) =>
      total + Number(collection.amountDue || 0),
    0
  );

  const totalCollected = collections.reduce(
    (total, collection) =>
      total + Number(collection.amountPaid || 0),
    0
  );

  const totalOutstanding =
    Math.max(0, totalDue - totalCollected);

  const paidCount = collections.filter(
    (collection) =>
      collection.status === "Paid"
  ).length;

  const partialCount = collections.filter(
    (collection) =>
      collection.status === "Partial"
  ).length;

  const pendingCount = collections.filter(
    (collection) =>
      collection.status === "Pending"
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
          MABOTE GROUP
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
              Record and monitor member
              monthly contributions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowForm(!showForm)
            }
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >

              <InputField
                label="Membership Number *"
                name="membershipNumber"
                value={
                  formData.membershipNumber
                }
                onChange={handleChange}
                placeholder="e.g. MAB-0002"
              />

              <InputField
                label="Member Name *"
                name="memberName"
                value={
                  formData.memberName
                }
                onChange={handleChange}
                placeholder="Full member name"
              />

              <div>
                <label>
                  <strong>
                    Plan
                  </strong>

                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option>
                      Plan A
                    </option>

                    <option>
                      Plan B
                    </option>

                    <option>
                      Plan C
                    </option>
                  </select>
                </label>
              </div>

              <InputField
                label="Amount Due (R) *"
                name="amountDue"
                type="number"
                value={
                  formData.amountDue
                }
                onChange={handleChange}
                placeholder="450"
              />

              <InputField
                label="Amount Paid (R)"
                name="amountPaid"
                type="number"
                value={
                  formData.amountPaid
                }
                onChange={handleChange}
                placeholder="Amount received"
              />

              <InputField
                label="Payment Date *"
                name="paymentDate"
                type="date"
                value={
                  formData.paymentDate
                }
                onChange={handleChange}
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
                    onChange={handleChange}
                    style={inputStyle}
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
              }}
            >

              <button
                type="button"
                onClick={addCollection}
                style={{
                  padding:
                    "11px 22px",
                  background:
                    "#071a52",
                  color: "#ffffff",
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
                onClick={resetForm}
                style={{
                  padding:
                    "11px 22px",
                  background:
                    "#777777",
                  color: "#ffffff",
                  border: "none",
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
              placeholder="Search by member, membership number, plan or status..."
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
              Record a member payment
              to begin.
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
                  "1250px",
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
                    Membership No.
                  </th>

                  <th style={cellStyle}>
                    Member Name
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

                        <td style={cellStyle}>
                          <strong>
                            {
                              collection.membershipNumber
                            }
                          </strong>
                        </td>

                        <td style={cellStyle}>
                          {
                            collection.memberName
                          }
                        </td>

                        <td style={cellStyle}>
                          {
                            collection.plan
                          }
                        </td>

                        <td style={cellStyle}>
                          R
                          {Number(
                            collection.amountDue
                          ).toLocaleString()}
                        </td>

                        <td style={cellStyle}>
                          R
                          {Number(
                            collection.amountPaid
                          ).toLocaleString()}
                        </td>

                        <td style={cellStyle}>
                          <strong>
                            R
                            {outstanding.toLocaleString()}
                          </strong>
                        </td>

                        <td style={cellStyle}>
                          {
                            collection.paymentDate ||
                            "-"
                          }
                        </td>

                        <td style={cellStyle}>
                          {
                            collection.paymentMethod
                          }
                        </td>

                        <td style={cellStyle}>

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

const cellStyle = {
  padding: "12px",
  border:
    "1px solid #dddddd",
  textAlign: "left",
};

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