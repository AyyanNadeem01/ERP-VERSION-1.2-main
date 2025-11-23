import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import toast from "react-hot-toast";

export default function Items() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-4">
      <ItemForm fetchItems={fetchItems} />
      <ItemList items={items} fetchItems={fetchItems} />
    </div>
  );
}
