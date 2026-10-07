import React, { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";

const createEmptyBeneficiary = () => ({
  fullName: "",
  surname: "",
  idNumber: "",
  relationship: "",
  cellphone: "",
  percentage: "",
});

const southAfricanBanks = [
  "ABSA",
  "African Bank",
  "Bidvest Bank",
  "Capitec Bank",
  "Discovery Bank",
  "FNB",
  "Investec Bank",
  "Nedbank",
  "Old Mutual Bank",
  "Postbank",
  "Standard Bank",
  "TymeBank",
  "Other",
];

const initialFormData = {
  fullName: "",
  surname: "",
  idNumber: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  cellphone: "",
  alternativeNumber: "",
  email: "",
  address: "",
  town: "",
  postalCode: "",
  employmentStatus: "",
  occupation: "",
  plan: "",
  paymentMethod: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  branchCode: "",
  beneficiaryCount: "0",
  beneficiaries: [],
  declaration: false,
};

export default function MemberRegistration() {
  const [formData, setFormData] =
    useState(initialFormData);

  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] =
    useState("");
  const [policyNumber, setPolicyNumber] =
    useState("");

  useEffect(() => {
    try {
      const account = JSON.parse(localStorage.getItem("maboteAccount") || "null");

      if (!account) {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        fullName: previous.fullName || account.fullName || "",
        surname: previous.surname || account.surname || "",
        email: previous.email || account.email || "",
      }));
    } catch {
      // Ignore malformed saved account data.
    }
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    if (name === "beneficiaryCount") {
      const count = Number(value);

      setFormData((previous) => {
        const beneficiaries = [
          ...previous.beneficiaries,
        ];

        while (beneficiaries.length < count) {
          beneficiaries.push(
            createEmptyBeneficiary()
          );
        }

        beneficiaries.length = count;

        return {
          ...previous,
          beneficiaryCount: value,
          beneficiaries,
        };
      });

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleBeneficiaryChange = (
    index,
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => {
      const beneficiaries = [
        ...previous.beneficiaries,
      ];

      beneficiaries[index] = {
        ...beneficiaries[index],
        [name]: value,
      };

      return {
        ...previous,
        beneficiaries,
      };
    });
  };

  const getPlanAmount = (plan) => {
    if (plan === "Plan A") {
      return 300;
    }

    if (plan === "Plan B") {
      return 350;
    }

    if (plan === "Plan C") {
      return 450;
    }

    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const referenceNumber = Date.now()
      .toString()
      .slice(-6);

    const currentYear =
      new Date().getFullYear();

    const newApplicationNumber =
      "MABOTE-" +
      currentYear +
      "-" +
      referenceNumber;

    const newPolicyNumber =
      "MABOTE-POL-" +
      currentYear +
      "-" +
      referenceNumber;

    const planAmount = getPlanAmount(
      formData.plan
    );

    const newMemberApplication = {
      ...formData,

      applicationNumber:
        newApplicationNumber,

      policyNumber:
        newPolicyNumber,

      planAmount,

      monthlyContribution:
        planAmount,

      status: "Pending",

      applicationDate:
        new Date().toISOString(),
    };

    try {
      await apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify(newMemberApplication),
      });
    } catch (error) {
      alert(error.message);
      return;
    }

    console.log(
      "MABOTE GROUP PTY(LTD) Member Application:",
      newMemberApplication
    );

    setApplicationNumber(
      newApplicationNumber
    );

    setPolicyNumber(
      newPolicyNumber
    );

    setSubmitted(true);
  };

  const printAgreement = () => {
    window.print();
  };

  const startNewApplication = () => {
    setFormData({
      ...initialFormData,
      beneficiaries: [],
    });

    setApplicationNumber("");
    setPolicyNumber("");
    setSubmitted(false);
  };

  const sectionStyle = {
    marginTop: "25px",
    padding: "25px",
    border: "1px solid #d4af37",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.08)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "17px",
    boxSizing: "border-box",
    border: "1px solid #cfcfcf",
    borderRadius: "6px",
    fontSize: "15px",
  };

  const labelStyle = {
    fontWeight: "600",
    display: "block",
    color: "#172554",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        paddingBottom: "50px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "#071a52",
          color: "white",
          padding: "30px 20px",
          textAlign: "center",
          borderBottom:
            "6px solid #d4af37",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            letterSpacing: "2px",
          }}
        >
          MABOTE GROUP PTY(LTD)
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#d4af37",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          STOCKVEL & FUNERAL GROCERY
          SCHEME
        </p>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {/* APPLICATION FORM */}

        {!submitted && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.10)",
            }}
          >
            <h2
              style={{
                color: "#071a52",
                textAlign: "center",
                marginTop: 0,
              }}
            >
              MEMBER APPLICATION FORM
            </h2>

            <div
              style={{
                height: "3px",
                background: "#d4af37",
                width: "100%",
                marginBottom: "20px",
              }}
            />

            <p
              style={{
                textAlign: "center",
                color: "#555",
              }}
            >
              Please complete the
              information below to
              register as a MABOTE GROUP PTY(LTD)
              member.
            </p>

            <form
              onSubmit={handleSubmit}
            >
              {/* PERSONAL DETAILS */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  1. Personal Details
                </h3>

                <label style={labelStyle}>
                  Full Name *
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <label style={labelStyle}>
                  Surname *
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="surname"
                  value={
                    formData.surname
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <label style={labelStyle}>
                  ID Number *
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="idNumber"
                  value={
                    formData.idNumber
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <label style={labelStyle}>
                  Date of Birth *
                </label>

                <input
                  style={inputStyle}
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <label style={labelStyle}>
                  Gender *
                </label>

                <select
                  style={inputStyle}
                  name="gender"
                  value={
                    formData.gender
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>

                <label style={labelStyle}>
                  Marital Status
                </label>

                <select
                  style={inputStyle}
                  name="maritalStatus"
                  value={
                    formData.maritalStatus
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    Select Status
                  </option>

                  <option value="Single">
                    Single
                  </option>

                  <option value="Married">
                    Married
                  </option>

                  <option value="Divorced">
                    Divorced
                  </option>

                  <option value="Widowed">
                    Widowed
                  </option>
                </select>
              </div>

              {/* CONTACT */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  2. Contact Details
                </h3>

                <label style={labelStyle}>
                  Cellphone Number *
                </label>

                <input
                  style={inputStyle}
                  type="tel"
                  name="cellphone"
                  value={
                    formData.cellphone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <label style={labelStyle}>
                  Alternative Number
                </label>

                <input
                  style={inputStyle}
                  type="tel"
                  name="alternativeNumber"
                  value={
                    formData.alternativeNumber
                  }
                  onChange={
                    handleChange
                  }
                />

                <label style={labelStyle}>
                  Email Address *
                </label>

                <input
                  style={inputStyle}
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* ADDRESS */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  3. Residential Address
                </h3>

                <label style={labelStyle}>
                  Address
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                />

                <label style={labelStyle}>
                  Town
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="town"
                  value={
                    formData.town
                  }
                  onChange={
                    handleChange
                  }
                />

                <label style={labelStyle}>
                  Postal Code
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* EMPLOYMENT */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  4. Employment Details
                </h3>

                <label style={labelStyle}>
                  Employment Status
                </label>

                <select
                  style={inputStyle}
                  name="employmentStatus"
                  value={
                    formData.employmentStatus
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    Select Status
                  </option>

                  <option value="Employed">
                    Employed
                  </option>

                  <option value="Self Employed">
                    Self Employed
                  </option>

                  <option value="Unemployed">
                    Unemployed
                  </option>

                  <option value="Pensioner">
                    Pensioner
                  </option>

                  <option value="Student">
                    Student
                  </option>
                </select>

                <label style={labelStyle}>
                  Occupation
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="occupation"
                  value={
                    formData.occupation
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* MEMBERSHIP PLAN */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  5. Membership Plan
                </h3>

                <label style={labelStyle}>
                  Select Plan *
                </label>

                <select
                  style={inputStyle}
                  name="plan"
                  value={
                    formData.plan
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Select Plan
                  </option>

                  <option value="Plan A">
                    Plan A - Super Package
                    - R450/month
                  </option>

                  <option value="Plan B">
                    Plan B - Executive
                    Grocery + Inkomo -
                    R500/month
                  </option>

                  <option value="Plan C">
                    Plan C - Custom Plan -
                    R350/month
                  </option>
                </select>

                {formData.plan && (
                  <div
                    style={{
                      marginBottom: "17px",
                      padding: "15px",
                      background:
                        "#fffdf5",
                      border:
                        "2px solid #d4af37",
                      borderRadius: "7px",
                      color: "#071a52",
                      fontWeight: "bold",
                    }}
                  >
                    Monthly Contribution: R
                    {getPlanAmount(
                      formData.plan
                    )}
                  </div>
                )}

                <label style={labelStyle}>
                  Payment Method *
                </label>

                <select
                  style={inputStyle}
                  name="paymentMethod"
                  value={
                    formData.paymentMethod
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Select Payment Method
                  </option>

                  <option value="Debit Order">
                    Debit Order
                  </option>

                  <option value="EFT">
                    EFT
                  </option>

                  <option value="Cash">
                    Cash
                  </option>
                </select>
              </div>

              {/* BANKING */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  6. Banking Details
                </h3>

                <label style={labelStyle}>
                  Bank Name
                </label>

                <select
                  style={inputStyle}
                  name="bankName"
                  value={
                    formData.bankName
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    Select South African Bank
                  </option>

                  {southAfricanBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}>
                  Account Holder
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="accountHolder"
                  value={
                    formData.accountHolder
                  }
                  onChange={
                    handleChange
                  }
                />

                <label style={labelStyle}>
                  Account Number
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="accountNumber"
                  value={
                    formData.accountNumber
                  }
                  onChange={
                    handleChange
                  }
                />

                <label style={labelStyle}>
                  Branch Code
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  name="branchCode"
                  value={
                    formData.branchCode
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* BENEFICIARIES */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  7. Beneficiaries
                </h3>

                <label style={labelStyle}>
                  Number of Beneficiaries
                </label>

                <select
                  style={inputStyle}
                  name="beneficiaryCount"
                  value={
                    formData.beneficiaryCount
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="0">
                    No Beneficiary
                  </option>

                  {Array.from(
                    { length: 8 },
                    (_, index) =>
                      index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}{" "}
                      {number === 1
                        ? "Beneficiary"
                        : "Beneficiaries"}
                    </option>
                  ))}
                </select>

                {formData.beneficiaries.map(
                  (
                    beneficiary,
                    index
                  ) => (
                    <div
                      key={index}
                      style={{
                        marginTop:
                          "20px",
                        padding:
                          "20px",
                        border:
                          "2px solid #d4af37",
                        borderRadius:
                          "8px",
                        background:
                          "#fffdf5",
                      }}
                    >
                      <h4
                        style={{
                          color:
                            "#071a52",
                        }}
                      >
                        Beneficiary{" "}
                        {index + 1}
                      </h4>

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Full Name
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="text"
                        name="fullName"
                        value={
                          beneficiary.fullName
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Surname
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="text"
                        name="surname"
                        value={
                          beneficiary.surname
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />

                      <label
                        style={
                          labelStyle
                        }
                      >
                        ID Number
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="text"
                        name="idNumber"
                        value={
                          beneficiary.idNumber
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Relationship
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="text"
                        name="relationship"
                        value={
                          beneficiary.relationship
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Cellphone
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="tel"
                        name="cellphone"
                        value={
                          beneficiary.cellphone
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Percentage (%)
                      </label>

                      <input
                        style={
                          inputStyle
                        }
                        type="number"
                        name="percentage"
                        min="0"
                        max="100"
                        value={
                          beneficiary.percentage
                        }
                        onChange={(
                          e
                        ) =>
                          handleBeneficiaryChange(
                            index,
                            e
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>

              {/* DECLARATION */}

              <div style={sectionStyle}>
                <h3
                  style={{
                    color: "#071a52",
                  }}
                >
                  8. Declaration
                </h3>

                <p>
                  I declare that the
                  information provided
                  in this application is
                  true and correct. I
                  understand that the
                  information will be
                  used for my MABOTE
                  GROUP membership
                  administration.
                </p>

                <label>
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={
                      formData.declaration
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />{" "}
                  I accept and agree to
                  the declaration.
                </label>
              </div>

              {/* SUBMIT */}

              <div
                style={{
                  textAlign:
                    "center",
                }}
              >
                <button
                  type="submit"
                  style={{
                    marginTop:
                      "30px",
                    padding:
                      "15px 45px",
                    fontSize:
                      "17px",
                    fontWeight:
                      "bold",
                    cursor:
                      "pointer",
                    borderRadius:
                      "7px",
                    border:
                      "2px solid #d4af37",
                    background:
                      "#071a52",
                    color:
                      "white",
                  }}
                >
                  SUBMIT MEMBERSHIP
                  APPLICATION
                </button>
              </div>
            </form>
          </div>
        )}

        {/* APPLICATION RECEIVED */}

        {submitted && (
          <div
            style={{
              background:
                "white",
              padding: "35px",
              borderRadius:
                "10px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "20px",
                borderBottom:
                  "3px solid #d4af37",
              }}
            >
              <h2
                style={{
                  color:
                    "#071a52",
                }}
              >
                APPLICATION RECEIVED
              </h2>

              <p
                style={{
                  color: "#555",
                }}
              >
                Thank you for
                applying to become
                a MABOTE GROUP PTY(LTD)
                member.
              </p>

              <h3
                style={{
                  color:
                    "#d4af37",
                }}
              >
                Application Number
              </h3>

              <div
                style={{
                  fontSize:
                    "24px",
                  fontWeight:
                    "bold",
                  color:
                    "#071a52",
                  marginBottom:
                    "20px",
                }}
              >
                {applicationNumber}
              </div>

              <h3
                style={{
                  color:
                    "#d4af37",
                }}
              >
                Policy Number
              </h3>

              <div
                style={{
                  fontSize:
                    "24px",
                  fontWeight:
                    "bold",
                  color:
                    "#071a52",
                }}
              >
                {policyNumber}
              </div>
            </div>

            {/* AGREEMENT */}

            <div
              style={{
                marginTop:
                  "30px",
                padding:
                  "30px",
                border:
                  "1px solid #ccc",
                background:
                  "#fff",
              }}
            >
              <h2
                style={{
                  textAlign:
                    "center",
                  color:
                    "#071a52",
                }}
              >
                MABOTE GROUP PTY(LTD)
              </h2>

              <h3
                style={{
                  textAlign:
                    "center",
                  color:
                    "#d4af37",
                }}
              >
                MEMBERSHIP APPLICATION
                AGREEMENT
              </h3>

              <hr />

              <p>
                <strong>
                  Application Number:
                </strong>{" "}
                {applicationNumber}
              </p>

              <p>
                <strong>
                  Policy Number:
                </strong>{" "}
                {policyNumber}
              </p>

              <p>
                <strong>
                  Member Name:
                </strong>{" "}
                {formData.fullName}{" "}
                {formData.surname}
              </p>

              <p>
                <strong>
                  ID Number:
                </strong>{" "}
                {formData.idNumber}
              </p>

              <p>
                <strong>
                  Cellphone:
                </strong>{" "}
                {formData.cellphone}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {formData.email}
              </p>

              <p>
                <strong>
                  Selected Plan:
                </strong>{" "}
                {formData.plan}
              </p>

              <p>
                <strong>
                  Monthly Contribution:
                </strong>{" "}
                R
                {getPlanAmount(
                  formData.plan
                )}
              </p>

              <p>
                <strong>
                  Payment Method:
                </strong>{" "}
                {
                  formData.paymentMethod
                }
              </p>

              <hr />

              <h4>
                Membership Declaration
              </h4>

              <p>
                I confirm that the
                information supplied
                in my membership
                application is true
                and correct. I
                understand that
                membership is subject
                to the applicable
                rules, terms and
                conditions of MABOTE
                GROUP.
              </p>

              <p>
                I understand that my
                selected membership
                plan determines the
                benefits and
                contributions
                applicable to my
                membership.
              </p>

              <p>
                I agree to comply
                with the rules and
                requirements
                applicable to MABOTE
                GROUP membership.
              </p>

              <br />

              <p>
                <strong>
                  Member:
                </strong>{" "}
                {formData.fullName}{" "}
                {formData.surname}
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {new Date().toLocaleDateString()}
              </p>

              <p>
                <strong>
                  Application Reference:
                </strong>{" "}
                {applicationNumber}
              </p>

              <p>
                <strong>
                  Policy Reference:
                </strong>{" "}
                {policyNumber}
              </p>
            </div>

            <div
              style={{
                textAlign:
                  "center",
                marginTop:
                  "25px",
              }}
            >
              <button
                type="button"
                onClick={
                  printAgreement
                }
                style={{
                  padding:
                    "13px 30px",
                  background:
                    "#071a52",
                  color:
                    "white",
                  border:
                    "2px solid #d4af37",
                  borderRadius:
                    "7px",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                  marginRight:
                    "10px",
                }}
              >
                PRINT / SAVE
                AGREEMENT
              </button>

              <button
                type="button"
                onClick={
                  startNewApplication
                }
                style={{
                  padding:
                    "13px 30px",
                  background:
                    "#d4af37",
                  color:
                    "#071a52",
                  border:
                    "none",
                  borderRadius:
                    "7px",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                }}
              >
                NEW APPLICATION
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          textAlign:
            "center",
          padding:
            "20px",
          color:
            "#071a52",
          fontWeight:
            "bold",
        }}
      >
        MABOTE GROUP PTY(LTD) © 2026
      </div>
    </div>
  );
}