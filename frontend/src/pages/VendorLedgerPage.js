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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Vendor Ledger</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">Select Vendor</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="p-2 border rounded w-full"
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
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchLedger}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      {ledger.length === 0 ? (
        <p>No ledger entries found.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-4 shadow rounded">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Vendor</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Stock Purchased</th>
                <th className="p-2 border">Payment Paid</th>
                <th className="p-2 border">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-100">
                  <td className="p-2 border">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{entry.vendor?.name || "N/A"}</td>
                  <td className="p-2 border">{entry.description}</td>
                  <td className="p-2 border">${entry.stockPurchased}</td>
                  <td className="p-2 border">${entry.paymentPaid}</td>
                  <td className="p-2 border">${entry.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
