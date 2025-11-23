import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales/getallsales");
      const filtered = res.data.filter((s) => {
        const saleDate = new Date(s.date).toISOString().slice(0, 10);
        return saleDate >= fromDate && saleDate <= toDate;
      });
      setSales(filtered);
    } catch (err) {
      toast.error("Failed to fetch sales");
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fromDate, toDate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;
    try {
      await api.delete(`/sales/deletesale/${id}`);
      toast.success("Sale deleted");
      fetchSales();
    } catch {
      toast.error("Failed to delete sale");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sales List</h2>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left">
            <th className="p-2 border">Invoice</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Total Amount</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
              <td className="p-2 border">{sale.invoiceNumber}</td>
              <td className="p-2 border">{sale.client.name}</td>
              <td className="p-2 border">{sale.client.address}</td>
              <td className="p-2 border">{new Date(sale.date).toLocaleDateString()}</td>
              <td className="p-2 border">${sale.totalAmount}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleDelete(sale._id)}
                  className="bg-red-600 px-2 py-1 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-700 dark:text-gray-300">
                No sales found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
