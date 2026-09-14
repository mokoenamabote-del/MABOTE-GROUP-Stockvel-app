import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Membership from "./pages/Membership";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import GroceryPackages from "./pages/GroceryPackages";

import AdminDashboard from "./pages/AdminDashboard";
import Members from "./pages/Members";
import MemberRegistration from "./pages/MemberRegistration";
import MemberCollections from "./pages/MemberCollections";
import Claims from "./pages/Claims";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminPrintables from "./pages/AdminPrintables";
import Payments from "./pages/Payments";


function ProtectedRoute({ children }) {
  const isLoggedIn =
    Boolean(localStorage.getItem("maboteAuthToken"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {
  return (
    <div>
      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/packages" element={<GroceryPackages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

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

        {/* MEMBER REGISTRATION */}
        <Route
          path="/member-registration"
          element={
            <ProtectedRoute>
              <MemberRegistration />
            </ProtectedRoute>
          }
        />

        {/* COLLECTIONS */}
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
              <Members />
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

        {/* ADMIN PRINT MATERIALS */}
        <Route
          path="/admin/print-materials"
          element={
            <ProtectedRoute>
              <AdminPrintables />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PAYMENT MATERIALS */}
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>
    </div>
  );
}