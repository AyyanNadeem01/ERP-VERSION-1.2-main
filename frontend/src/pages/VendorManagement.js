import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [initialBalance, setInitialBalance] = useState(0);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionType, setTransactionType] = useState("stock"); // "stock" or "payment"
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors/getvendors");
      setVendors(res.data);
    } catch (err) {
      toast.error("Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Add vendor with initial balance
  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!vendorName) return toast.error("Vendor name required");
    try {
      const res = await api.post("/vendors/addvendor", {
        name: vendorName,
        balance: Number(initialBalance),
      });
      toast.success("Vendor added");
      setVendorName("");
      setInitialBalance(0);
      fetchVendors();
    } catch (err) {
      toast.error("Failed to add vendor");
    }
  };

  // Open transaction modal
  const openTransactionModal = (vendor, type) => {
    setSelectedVendor(vendor);
    setTransactionType(type);
    setTransactionAmount(0);
    setTransactionDescription("");
    setShowTransactionModal(true);
  };

  // Submit transaction
  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!transactionAmount || !selectedVendor) return toast.error("Enter valid amount");
    try {
      await api.put(`/vendors/vendor/${selectedVendor._id}/balance`, {
        amount: transactionType === "stock" ? Number(transactionAmount) : -Number(transactionAmount),
        description: transactionDescription,
      });
      toast.success("Transaction successful");
      setShowTransactionModal(false);
      fetchVendors();
    } catch (err) {
      toast.error("Transaction failed");
    }
  };

  return (
    // Updated main container background and text
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Vendor Management</h2>

      {/* Add Vendor Form */}
      {/* Updated form container background and shadow */}
      <form onSubmit={handleAddVendor} className="mb-6 bg-white dark:bg-gray-700 p-4 shadow-lg rounded">
        <h3 className="font-semibold mb-2">Add New Vendor</h3>
        {/* Updated input styling */}
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          className="p-2 border rounded w-full mb-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        {/* Updated input styling */}
        <input
          type="number"
          placeholder="Initial Balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="p-2 border rounded w-full mb-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        {/* Button color stays bright for visibility */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">Add Vendor</button>
      </form>

      {/* Vendor List */}
      {/* Updated list container background and shadow */}
      <div className="bg-white dark:bg-gray-700 p-4 shadow-lg rounded">
        <h3 className="font-semibold mb-2">Vendors</h3>
        {vendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              {/* Updated table header row and text */}
              <tr className="bg-gray-200 dark:bg-gray-600 text-left text-gray-900 dark:text-gray-100">
                <th className="p-2 border dark:border-gray-500">Vendor Name</th>
                <th className="p-2 border dark:border-gray-500">Balance</th>
                <th className="p-2 border dark:border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                // Updated row background and hover state
                <tr key={v._id} className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <td className="p-2 border dark:border-gray-500">{v.name}</td>
                  <td className="p-2 border dark:border-gray-500">${v.balance}</td>
                  <td className="p-2 border dark:border-gray-500 space-x-2">
                    {/* Button colors maintained for action distinction */}
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition"
                      onClick={() => openTransactionModal(v, "stock")}
                    >
                      Stock Purchase
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition"
                      onClick={() => openTransactionModal(v, "payment")}
                    >
                      Pay Vendor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Updated modal content background and text */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md text-gray-900 dark:text-gray-100">
            <h3 className="font-semibold mb-2">
              {transactionType === "stock" ? "Stock Purchase" : "Pay Vendor"} for {selectedVendor.name}
            </h3>
            <form onSubmit={handleTransaction}>
              {/* Updated input styling */}
              <input
                type="number"
                placeholder="Amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className="p-2 border rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {/* Updated input styling */}
              <input
                type="text"
                placeholder="Description (optional)"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                className="p-2 border rounded w-full mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded transition"
                  onClick={() => setShowTransactionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}