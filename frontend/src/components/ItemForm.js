import React, { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function ItemForm({ fetchItems }) {
  const [itemName, setItemName] = useState("");
  const [stock, setStock] = useState(0);
  const [costPrice, setCostPrice] = useState(0);

  const handleAddItem = async () => {
    if (!itemName) return toast.error("Item Name is required");

    try {
      await api.post("/items/add", { itemName, stock, costPrice });
      toast.success("Item added successfully");

      // Reset form
      setItemName("");
      setStock(0);
      setCostPrice(0);

      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Item</h2>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
          Item Name
        </label>
        <input
          type="text"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Stock
          </label>
          <input
            type="number"
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Cost Price
          </label>
          <input
            type="number"
            placeholder="Enter cost price"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleAddItem}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Add Item
      </button>
    </div>
  );
}
