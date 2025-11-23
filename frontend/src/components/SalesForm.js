import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function SaleForm({ fetchSales }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([
    { srNo: 1, itemId: "", description: "", rate: null, quantity: null, total: null }
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, itemsRes] = await Promise.all([
          api.get("/clients/getclients"),
          api.get("/items")
        ]);
        setClients(clientRes.data);
        setItemsList(itemsRes.data);
      } catch (err) {
        toast.error("Failed to fetch clients or items");
      }
    };
    fetchData();
  }, []);

  const handleItemSelect = (index, itemId) => {
    const selectedItem = itemsList.find((i) => i._id === itemId);
    const newItems = [...items];
    newItems[index].itemId = itemId;
    newItems[index].description = selectedItem?.itemName || "";
    newItems[index].rate = selectedItem?.costPrice || 0;
    newItems[index].total = newItems[index].rate * newItems[index].quantity;
    setItems(newItems);
  };

  const handleQuantityChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = Number(qty);
    newItems[index].total = newItems[index].quantity * newItems[index].rate;
    setItems(newItems);
  };

  const addItemRow = () =>
    setItems([
      ...items,
      { srNo: items.length + 1, itemId: "", description: "", rate: 0, quantity: 0, total: 0 }
    ]);

  const removeItemRow = (index) => setItems(items.filter((_, i) => i !== index));

  const handleAddSale = async () => {
    if (!selectedClient) return toast.error("Please select a client");
    if (!items.length) return toast.error("Add at least one item");

    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
    const newInvoiceNumber = "INV-" + Date.now().toString().slice(-6);
    setInvoiceNumber(newInvoiceNumber);

    try {
      await api.post("/sales/addsale", {
        clientId: selectedClient,
        items,
        totalAmount,
        cost: 0,
        date,
        invoiceNumber: newInvoiceNumber
      });

      toast.success(`Sale added successfully! Invoice: ${newInvoiceNumber}`);
      setItems([{ srNo: 1, itemId: "", description: "", rate: 0, quantity: 0, total: 0 }]);
      setSelectedClient("");
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add sale");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Sale</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            readOnly
            className="p-2 rounded border w-full bg-gray-200 dark:bg-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Select Client</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="p-2 rounded border w-full dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.address}) - Balance: {c.balance}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded border w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Items</h3>
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <div key={index} className="grid md:grid-cols-6 gap-2 items-end">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Select Item</label>
              <select
                value={item.itemId}
                onChange={(e) => handleItemSelect(index, e.target.value)}
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Item</option>
                {itemsList.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.itemName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Rate</label>
              <input
                type="number"
                className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Total</label>
              <input
                type="number"
                value={item.total}
                readOnly
                className="p-2 rounded border bg-gray-200 dark:bg-gray-600 dark:text-white"
              />
            </div>
            <div className="col-span-1">
              <button
                onClick={() => removeItemRow(index)}
                className="bg-red-600 px-3 py-1 text-white rounded mt-6"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addItemRow} className="bg-blue-500 px-4 py-2 text-white rounded mb-4">
        Add Item
      </button>
      <button
        onClick={handleAddSale}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Submit Sale
      </button>
    </div>
  );
}
