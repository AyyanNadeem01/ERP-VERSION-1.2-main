import React, { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function ItemList({ items, fetchItems }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [stock, setStock] = useState(0);
  const [costPrice, setCostPrice] = useState(0);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/delete/${id}`);
      toast.success("Item deleted");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/items/update/${id}`, { stock, costPrice });
      toast.success("Item updated");
      setEditingItemId(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Items List</h3>
      {items.length === 0 && <p className="text-gray-700 dark:text-gray-300">No items found.</p>}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">{item.itemName}</p>
              {editingItemId === item._id ? (
                <div className="flex space-x-2 mt-1">
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="p-1 rounded border w-20 dark:bg-gray-600 dark:text-white"
                  />
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="p-1 rounded border w-24 dark:bg-gray-600 dark:text-white"
                  />
                  <button onClick={() => handleUpdate(item._id)} className="bg-green-600 px-2 rounded text-white">Save</button>
                  <button onClick={() => setEditingItemId(null)} className="bg-gray-500 px-2 rounded text-white">Cancel</button>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  Stock: {item.stock}, Cost: ${item.costPrice}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { setEditingItemId(item._id); setStock(item.stock); setCostPrice(item.costPrice); }} className="bg-yellow-500 px-2 rounded text-white">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-600 px-2 rounded text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
