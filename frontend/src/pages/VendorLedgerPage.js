import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function VendorLedgerPage() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledger, setLedger] = useState([]);

  // Fetch all vendors for filter
  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors/getvendors");
      setVendors(res.data);
    } catch (err) {
      toast.error("Failed to fetch vendors");
    }
  };

  // Fetch ledger entries with optional filters
  const fetchLedger = async () => {
    try {
      let query = [];
      if (selectedVendor) query.push(`vendor=${selectedVendor}`);
      if (fromDate) query.push(`fromDate=${fromDate}`);
      if (toDate) query.push(`toDate=${toDate}`);
      const queryString = query.length ? `?${query.join("&")}` : "";

      const res = await api.get(`/vendorledger${queryString}`);
      setLedger(res.data);
    } catch (err) {
      toast.error("Failed to fetch ledger");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [selectedVendor, fromDate, toDate]);

  return (
    // Updated background and text colors for dark theme
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Vendor Ledger</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">Select Vendor</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            // Updated select styling for dark theme
            className="p-2 border rounded w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">-- All Vendors --</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            // Updated input styling for dark theme
            className="p-2 border rounded w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            // Updated input styling for dark theme
            className="p-2 border rounded w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchLedger}
            // Retained bright button color for visibility
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      {ledger.length === 0 ? (
        <p>No ledger entries found.</p>
      ) : (
        // Updated table container for dark theme
        <div className="overflow-x-auto bg-white dark:bg-gray-700 p-4 shadow rounded">
          <table className="w-full table-auto border-collapse">
            <thead>
              {/* Updated table header row for dark theme */}
              <tr className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100">
                <th className="p-2 border border-gray-300 dark:border-gray-500">Date</th>
                <th className="p-2 border border-gray-300 dark:border-gray-500">Vendor</th>
                <th className="p-2 border border-gray-300 dark:border-gray-500">Description</th>
                <th className="p-2 border border-gray-300 dark:border-gray-500">Stock Purchased</th>
                <th className="p-2 border border-gray-300 dark:border-gray-500">Payment Paid</th>
                <th className="p-2 border border-gray-300 dark:border-gray-500">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                // Updated table row for dark theme, including hover state
                <tr key={entry._id} className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <td className="p-2 border border-gray-300 dark:border-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-500">{entry.vendor?.name || "N/A"}</td>
                  <td className="p-2 border border-gray-300 dark:border-gray-500">{entry.description}</td>
                  <td className="p-2 border border-gray-300 dark:border-gray-500">${entry.stockPurchased}</td>
                  <td className="p-2 border border-gray-300 dark:border-gray-500">${entry.paymentPaid}</td>
                  <td className="p-2 border border-gray-300 dark:border-gray-500">${entry.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}