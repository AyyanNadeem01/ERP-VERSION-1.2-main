import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Sales from "./pages/Sales";
import LedgerDashboard from "./pages/LedgerDashboard"
import Login from "./pages/Login";
import Clients from "./pages/Clients"
import Signup from "./pages/Signup";
import VendorManagement from "./pages/VendorManagement";
import Home from "./pages/Home"
import VendorLedgerPage from "./pages/VendorLedgerPage";
import CompanySettings from "./pages/CompanySettings";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="items" element={<Items />} />
<Route path="/dashboard/clients" element={<Clients />} />
  <Route path="/dashboard/ledger" element={<LedgerDashboard />} />
      <Route path="/dashboard/sales" element={<Sales />} />

        <Route path="/dashboard/vendors" element={<VendorManagement />} />
        <Route path="/dashboard/vendor-ledger" element={<VendorLedgerPage />} />
      <Route path="/dashboard/company" element={<CompanySettings />} />
      <Route path="/dashboard" element={<Home />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
