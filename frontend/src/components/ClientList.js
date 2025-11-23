import React, { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function ClientList({ clients, fetchClients }) {
  const [editingClientId, setEditingClientId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState("");

  const handleUpdateBalance = async (id) => {
    try {
      await api.put(`/clients/client/${id}/balance`, { amount, remarks });
      toast.success("Client balance updated");
      setEditingClientId(null);
      setAmount(0);
      setRemarks("");
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Clients List</h3>
      {clients.length === 0 && <p className="text-gray-700 dark:text-gray-300">No clients found.</p>}
      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client._id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
              <p className="text-gray-700 dark:text-gray-300">Address: {client.address}</p>
              <p className="text-gray-700 dark:text-gray-300">Balance: ${client.balance}</p>
              <p className="text-gray-700 dark:text-gray-300">Remarks: {client.remarks}</p>
            </div>

            {editingClientId === client._id ? (
              <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="p-2 rounded border dark:bg-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="p-2 rounded border dark:bg-gray-600 dark:text-white"
                />
                <button
                  onClick={() => handleUpdateBalance(client._id)}
                  className="bg-green-600 px-3 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingClientId(null)}
                  className="bg-gray-500 px-3 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingClientId(client._id)}
                className="bg-blue-600 px-3 py-1 rounded text-white mt-2 md:mt-0"
              >
                Update Balance
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
