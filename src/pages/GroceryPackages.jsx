import React, { useState } from "react";

const FULL_GROCERY = {
  catering: [
    "1 × 80KG Maize Meal",
    "1 × 10KG Rice / 10KG Samp",
    "4 × 5KG Wings / Drumsticks",
    "1 × 30KG Beef Stew",
    "2 × 5L Cooking Oil",
    "2 × 1KG Salt",
    "1 × 3KG Mayonnaise / 3KG Chutney",
    "12 × 410G Baked Beans",
    "2 × 24 Stock Cubes",
    "4 × 250G Various Spices",
    "2 × Bag Onions",
    "2 × Bag Carrots",
    "2 × Bag Butternuts",
    "2 × Bag Beetroot / 7KG Potatoes",
    "2 × Bag Green Pepper",
    "1 × 10KG Sugar",
    "2 × 750G Coffee Creamer",
    "1 × 160 Rooibos Tea Bags",
    "1 × 500G Black Tea Bags",
  ],

  baking: [
    "1 × 10KG Cake Flour",
    "10 × 500G Margarine",
    "6 × 10G Yeast",
    "1 × 5KG Large Eggs (60)",
  ],

  drinks: [
    "5 × 24 Pack 200ML Soft Drink / Juice",
    "6 × 1L Fresh Milk",
  ],

  cleanup: [
    "1 × 10 Dishwashing Cloths",
    "1 × 1.5L Dishwashing Liquid",
    "1 × Pot Scourers",
    "1 × 10 Tissues",
    "1 × 10 Matches",
    "1 × 10 Refuse Bags",
  ],
};

const createGroceryItems = () => [
  ...FULL_GROCERY.catering,
  ...FULL_GROCERY.baking,
  ...FULL_GROCERY.drinks,
  ...FULL_GROCERY.cleanup,
];

const PACKAGE_WATERMARKS = {
  basic: ["VEGETABLES", "MEAT CUTTER", "CATERING EQUIPMENT"],
  enhanced: [
    "COW",
    "VEGETABLES",
    "MOBILE TOILET",
    "MEAT CUTTER",
    "CATERING EQUIPMENT",
  ],
};

const packages = [
  {
    name: "Plan A - Full Grocery",
    shortName: "Plan A",
    price: "R300",
    description:
      "Full funeral grocery package for catering, baking, drinks and clean-up.",
    sections: [
      {
        title: "1. Catering Ingredients",
        items: FULL_GROCERY.catering,
      },
      {
        title: "2. Baking",
        items: FULL_GROCERY.baking,
      },
      {
        title: "3. Drinks",
        items: FULL_GROCERY.drinks,
      },
      {
        title: "4. Clean-up Material",
        items: FULL_GROCERY.cleanup,
      },
    ],
    extras: [],
    watermarkItems: PACKAGE_WATERMARKS.basic,
  },

  {
    name: "Plan B - Full Grocery + Cow",
    shortName: "Plan B",
    price: "R350",
    description:
      "Full grocery package with 1 cow and 1 mobile toilet.",
    sections: [
      {
        title: "1. Catering Ingredients",
        items: FULL_GROCERY.catering,
      },
      {
        title: "2. Baking",
        items: FULL_GROCERY.baking,
      },
      {
        title: "3. Drinks",
        items: FULL_GROCERY.drinks,
      },
      {
        title: "4. Clean-up Material",
        items: FULL_GROCERY.cleanup,
      },
    ],
    extras: [
      "1 × Cow",
      "1 × Mobile Toilet",
    ],
    watermarkItems: PACKAGE_WATERMARKS.enhanced,
  },

  {
    name: "Plan C - Premium Catering",
    shortName: "Plan C",
    price: "R450",
    description:
      "Full grocery package with 1 cow, 1 mobile toilet and additional catering support.",
    sections: [
      {
        title: "1. Catering Ingredients",
        items: FULL_GROCERY.catering,
      },
      {
        title: "2. Baking",
        items: FULL_GROCERY.baking,
      },
      {
        title: "3. Drinks",
        items: FULL_GROCERY.drinks,
      },
      {
        title: "4. Clean-up Material",
        items: FULL_GROCERY.cleanup,
      },
    ],
    extras: [
      "1 × Cow",
      "1 × Mobile Toilet",
      "Additional Catering Items",
    ],
    watermarkItems: PACKAGE_WATERMARKS.enhanced,
  },
];

export default function GroceryPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const closePackage = () => {
    setSelectedPackage(null);
  };

  return (
    <section className="home-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "8px" }}>
            Grocery Packages
          </h2>

          <p style={{ margin: 0 }}>
            MABOTE GROUP funeral grocery packages,
            catering support and package distribution.
          </p>
        </div>

        <div
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            background: "#f4f6f8",
            fontWeight: "600",
          }}
        >
          3 Active Packages
        </div>
      </div>

      <div className="dashboard-grid">
        {packages.map((pkg) => (
          <article
            className="dashboard-card package-card"
            key={pkg.name}
          >
            <div
              className="package-watermark"
              aria-hidden="true"
            >
              {pkg.watermarkItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  opacity: 0.7,
                }}
              >
                {pkg.shortName}
              </span>

              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                }}
              >
                ACTIVE
              </span>
            </div>

            <h3>{pkg.name}</h3>

            <p className="metric-value">
              {pkg.price}
            </p>

            <p>{pkg.description}</p>

            <h4>Package Includes</h4>

            {pkg.sections.map((section) => (
              <div
                key={section.title}
                style={{
                  marginBottom: "15px",
                }}
              >
                <strong>{section.title}</strong>

                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            {pkg.extras.length > 0 && (
              <div>
                <h4>Additional Package Benefits</h4>

                <ul>
                  {pkg.extras.map((item) => (
                    <li key={item}>
                      <strong>{item}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setSelectedPackage(pkg)
              }
            >
              View Package
            </button>
          </article>
        ))}
      </div>

      {selectedPackage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
            overflowY: "auto",
          }}
          onClick={closePackage}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "30px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>
                  {selectedPackage.name}
                </h2>

                <p
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {selectedPackage.description}
                </p>
              </div>

              <button
                type="button"
                onClick={closePackage}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                aria-label="Close package"
              >
                ×
              </button>
            </div>

            <hr
              style={{
                margin: "20px 0",
              }}
            />

            <h3>Package Price</h3>

            <p
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginTop: "5px",
                color: "#071a52",
              }}
            >
              {selectedPackage.price}
            </p>

            {selectedPackage.sections.map(
              (section) => (
                <div
                  key={section.title}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <h3>{section.title}</h3>

                  <ul>
                    {section.items.map(
                      (item) => (
                        <li key={item}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}

            {selectedPackage.extras.length >
              0 && (
              <div>
                <h3>
                  Additional Package Benefits
                </h3>

                <ul>
                  {selectedPackage.extras.map(
                    (item) => (
                      <li key={item}>
                        <strong>
                          {item}
                        </strong>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={closePackage}
              style={{
                marginTop: "15px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}