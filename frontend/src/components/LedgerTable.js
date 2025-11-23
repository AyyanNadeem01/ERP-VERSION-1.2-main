import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function LedgerTable({ onSelectClient }) {
  const [clients, setClients] = useState([]);

  const fetchOutstanding = async () => {
    try {
      const res = await api.get("/ledgers/getallledgers"); // backend returns all ledger entries
      // Extract unique clients and their latest balance
      const clientMap = {};
      res.data.forEach(entry => {
        clientMap[entry.client._id] = {
          name: entry.client.name,
          balance: entry.balanceAfter
        };
      });

      const clientList = Object.entries(clientMap).map(([id, { name, balance }]) => ({
        id,
        name,
        balance
      }));

      setClients(clientList);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch outstanding report");
    }
  };

  useEffect(() => {
    fetchOutstanding();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 mt-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Outstanding Report</h2>
      {clients.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No clients found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="p-2 border">Client Name</th>
              <th className="p-2 border">Outstanding Balance</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="p-2 border">{client.name}</td>
                <td className="p-2 border">${client.balance}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => onSelectClient(client.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    View Ledger
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
