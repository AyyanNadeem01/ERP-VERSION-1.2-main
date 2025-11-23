import React, { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function ClientForm({ fetchClients }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [remarks, setRemarks] = useState("");

  const handleAddClient = async () => {
    if (!name || !address) return toast.error("Name and Address are required");

    try {
      await api.post("/clients/addclient", { name, address, balance, remarks });
      toast.success("Client added successfully");

      setName("");
      setAddress("");
      setBalance(0);
      setRemarks("");

      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add client");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Client</h2>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Address</label>
        <input
          type="text"
          placeholder="Enter client address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Balance</label>
          <input
            type="number"
            placeholder="Enter initial balance"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Remarks</label>
          <input
            type="text"
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleAddClient}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Add Client
      </button>
    </div>
  );
}
