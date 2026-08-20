import React from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Claims from "./pages/Claims";
import Login from "./pages/Login";
import MemberRegistration from "./pages/MemberRegistration";
import Register from "./pages/Register";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import MemberCollections from "./pages/MemberCollections";
import PolicyStatus from "./pages/PolicyStatus";
import GroceryPackages from "./pages/GroceryPackages";

const navItems = [
  { to: "/admin", label: "🏠 Dashboard" },
  { to: "/members", label: "👥 Members" },
  { to: "/packages", label: "📦 Grocery Packages" },
  { to: "/collections", label: "💰 Member Collections" },
  { to: "/policy-status", label: "📋 Policy Status" },
  { to: "/reports", label: "📊 Reports" },
  { to: "/settings", label: "⚙️ Settings" },
  { to: "/member-registration", label: "📝 Member Application" },
  { to: "/claims", label: "📋 Claims" },
  { to: "/login", label: "🔐 Login" },
  { to: "/register", label: "📝 Register" },
];

const Reports = () => (
  <section className="home-page">
    <h2>Reports</h2>

    <p>
      Access monthly summaries, branch distribution,
      cost summaries, insurance information, and stock reports.
    </p>

    <div className="dashboard-grid">
      <article className="dashboard-card">
        <h3>Monthly Cost Summary</h3>
        <p className="metric-value">R18,500</p>
        <p>
          Current monthly operating and grocery costs.
        </p>
      </article>

      <article className="dashboard-card">
        <h3>Distribution by Package</h3>
        <p className="metric-value">Package A: 58%</p>
        <p>
          Current grocery package distribution.
        </p>
      </article>

      <article className="dashboard-card">
        <h3>Insurance Matrix</h3>
        <p className="metric-value">View</p>
        <p>
          Review member insurance and policy information.
        </p>
      </article>

      <article className="dashboard-card">
        <h3>Policy Report</h3>
        <p className="metric-value">View</p>
        <p>
          Review active, pending, and lapsed policies.
        </p>
      </article>
    </div>
  </section>
);

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("maboteLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>MABOTE GROUP Stockvel App</h1>

        <p>
          Digital coordination for funeral grocery support
          and community contributions.
        </p>

        <nav
          className="app-nav"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-button${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <Routes>

          {/* DEFAULT */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* MEMBERS */}
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            }
          />

          {/* GROCERY PACKAGES */}
          <Route
            path="/packages"
            element={
              <ProtectedRoute>
                <GroceryPackages />
              </ProtectedRoute>
            }
          />

          {/* MEMBER COLLECTIONS */}
          <Route
            path="/collections"
            element={
              <ProtectedRoute>
                <MemberCollections />
              </ProtectedRoute>
            }
          />

          {/* POLICY STATUS */}
          <Route
            path="/policy-status"
            element={
              <ProtectedRoute>
                <PolicyStatus />
              </ProtectedRoute>
            }
          />

          {/* REPORTS */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* MEMBER REGISTRATION */}
          <Route
            path="/member-registration"
            element={
              <ProtectedRoute>
                <MemberRegistration />
              </ProtectedRoute>
            }
          />

          {/* CLAIMS */}
          <Route
            path="/claims"
            element={
              <ProtectedRoute>
                <Claims />
              </ProtectedRoute>
            }
          />

          {/* UNKNOWN ROUTES */}
          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </main>
    </div>
  );
}