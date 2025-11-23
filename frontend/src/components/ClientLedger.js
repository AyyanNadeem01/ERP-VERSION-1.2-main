import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import LedgerTable from "./LedgerTable";

export default function ClientLedger() {
  const [clients, setClients] = useState([]);
  const [searchClient, setSearchClient] = useState(""); // For client name search
  const [selectedClient, setSelectedClient] = useState("");
  const [ledger, setLedger] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients/getclients");
        setClients(res.data);
      } catch (err) {
        toast.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, []);

  // Fetch ledger when selected client or date changes
  useEffect(() => {
    const fetchLedger = async () => {
      if (!selectedClient) return setLedger([]);
      try {
        const res = await api.get(`/ledgers/client/${selectedClient}`);
        let data = res.data;

        if (fromDate) data = data.filter(e => new Date(e.date) >= new Date(fromDate));
        if (toDate) data = data.filter(e => new Date(e.date) <= new Date(toDate));

        setLedger(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch ledger");
      }
    };
    fetchLedger();
  }, [selectedClient, fromDate, toDate]);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchClient.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Client Ledger</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Search Client</label>
          <input
            type="text"
            placeholder="Type client name..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Select Client</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select Client --</option>
            {filteredClients.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Ledger Table */}
      {ledger.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No ledger entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Client</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Debit</th>
                <th className="p-2 border">Credit</th>
                <th className="p-2 border">Balance After</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map(entry => (
                <tr key={entry._id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="p-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{entry.client?.name || "N/A"}</td>
                  <td className="p-2 border">{entry.description}</td>
                  <td className="p-2 border">${entry.debit}</td>
                  <td className="p-2 border">${entry.credit}</td>
                  <td className="p-2 border">${entry.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
