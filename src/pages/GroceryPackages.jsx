import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GroceryPackages.css";

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
    <section className="grocery-page">
      <header className="grocery-header">
        <div className="grocery-container grocery-header-inner">
          <Link to="/" className="grocery-brand" aria-label="MABOTE home">
            <span className="grocery-brand-mark">MG</span>
            <span className="grocery-brand-copy">
              <strong>MABOTE</strong>
              <small>GROUP</small>
            </span>
          </Link>

          <nav className="grocery-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/packages" className="active">Packages</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/membership">Membership</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="grocery-actions">
            <Link to="/login" className="grocery-login">Member Login</Link>
            <Link to="/register" className="grocery-join">Join Now</Link>
          </div>
        </div>
      </header>

      <section className="grocery-hero">
        <div className="grocery-container grocery-hero-inner">
          <div>
            <span className="grocery-kicker">Membership Plans</span>
            <h1>
              Choose a <span>plan</span> that fits your future.
            </h1>
            <p>
              MABOTE GROUP PTY(LTD) offers structured funeral grocery membership plans designed to help families prepare with clarity, order and confidence.
            </p>

            <div className="grocery-hero-actions">
              <Link to="/register" className="grocery-cta">Apply Now</Link>
              <Link to="/membership" className="grocery-login">View Membership</Link>
            </div>
          </div>

          <div className="grocery-hero-card">
            <div className="card-mark">MG</div>
            <h3>Funeral Grocery Stockvel</h3>
            <p>Plan ahead with practical support for families and communities.</p>
          </div>
        </div>
      </section>

      <main className="grocery-container grocery-main">
        <div className="grocery-summary">
          <div>
            <h2>Our package offerings</h2>
            <p>Transparent plans built around preparation, support and practical household care.</p>
          </div>

          <div className="grocery-pill">3 Active Packages</div>
        </div>

        <div className="grocery-grid">
          {packages.map((pkg) => (
            <article className="grocery-card" key={pkg.name}>
              <div className="watermark" aria-hidden="true">
                {pkg.watermarkItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="grocery-card-top">
                <span>{pkg.shortName}</span>
                <strong>✓</strong>
              </div>

              <h3>{pkg.name}</h3>
              <p className="price">{pkg.price}</p>
              <p>{pkg.description}</p>

              <h4>Package Includes</h4>

              {pkg.sections.map((section) => (
                <div key={section.title} style={{ marginBottom: "12px" }}>
                  <strong>{section.title}</strong>
                  <ul>
                    {section.items.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {pkg.extras.length > 0 && (
                <div>
                  <h4>Additional Benefits</h4>
                  <ul>
                    {pkg.extras.map((item) => (
                      <li key={item}><strong>{item}</strong></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grocery-card-actions">
                <button type="button" className="grocery-view" onClick={() => setSelectedPackage(pkg)}>
                  View Details
                </button>
                <Link to="/register" className="grocery-apply">Apply</Link>
              </div>
            </article>
          ))}
        </div>

        {selectedPackage && (
          <div className="grocery-modal" onClick={closePackage}>
            <div className="grocery-modal-panel" onClick={(event) => event.stopPropagation()}>
              <div className="grocery-modal-header">
                <div>
                  <h2>{selectedPackage.name}</h2>
                  <p>{selectedPackage.description}</p>
                </div>

                <button type="button" className="grocery-close" onClick={closePackage} aria-label="Close package">
                  ×
                </button>
              </div>

              <div className="grocery-modal-body">
                <h3>Package Price</h3>
                <p className="modal-price">{selectedPackage.price}</p>

                {selectedPackage.sections.map((section) => (
                  <div key={section.title}>
                    <h3>{section.title}</h3>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {selectedPackage.extras.length > 0 && (
                  <div>
                    <h3>Additional Benefits</h3>
                    <ul>
                      {selectedPackage.extras.map((item) => (
                        <li key={item}><strong>{item}</strong></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grocery-modal-footer">
                <button type="button" className="grocery-view" onClick={closePackage}>Close</button>
                <Link to="/register" className="grocery-apply" onClick={closePackage}>Apply Now</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}