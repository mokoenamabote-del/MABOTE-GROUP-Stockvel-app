import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiRequest } from "./lib/api";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Membership from "./pages/Membership";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import GroceryPackages from "./pages/GroceryPackages";
import ClientPortal from "./pages/ClientPortal";

import AdminDashboard from "./pages/AdminDashboard";
import Members from "./pages/Members";
import MemberRegistration from "./pages/MemberRegistration";
import MemberCollections from "./pages/MemberCollections";
import Claims from "./pages/Claims";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminPrintables from "./pages/AdminPrintables";
import Payments from "./pages/Payments";
import HRManagement from "./pages/HRManagement";
import HRRecruitmentDigital from "./pages/HRRecruitmentDigital";
import StaffRecruitment from "./pages/StaffRecruitment";


function ProtectedRoute({ children, allowedRoles = ["Admin", "Management", "Support Staff"] }) {
  const [status, setStatus] = useState("checking");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("maboteAuthToken");

    if (!token) {
      setStatus("unauthenticated");
      return undefined;
    }

    let isCurrent = true;

    apiRequest("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ account }) => {
        if (!isCurrent) return;

        if (!account?.role) {
          throw new Error("Account role is missing");
        }

        localStorage.setItem("maboteAccount", JSON.stringify(account));
        setRole(account.role);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!isCurrent) return;

        localStorage.removeItem("maboteAuthToken");
        localStorage.removeItem("maboteAccount");
        setStatus("unauthenticated");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  if (status === "checking") {
    return <div role="status">Checking your session...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    const redirectPath =
      role === "Member"
        ? "/client-portal"
        : ["Admin", "Management", "Support Staff"].includes(role)
          ? "/admin"
          : "/";

    return <Navigate to={redirectPath} replace />;
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
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payments" element={<Payments />} />
        <Route
          path="/client-portal"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <ClientPortal />
            </ProtectedRoute>
          }
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

        {/* MEMBER REGISTRATION */}
        <Route
          path="/member-registration"
          element={
            <ProtectedRoute allowedRoles={["Member", "Admin", "Management", "Support Staff"]}>
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

        {/* HUMAN RESOURCES */}
        <Route
          path="/admin/hr"
          element={
            <ProtectedRoute>
              <HRManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hr/recruitment"
          element={
            <ProtectedRoute>
              <HRRecruitmentDigital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff-recruitment"
          element={
            <ProtectedRoute>
              <StaffRecruitment />
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