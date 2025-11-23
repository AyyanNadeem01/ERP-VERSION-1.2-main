import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";
import toast from "react-hot-toast";

export default function Clients() {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients/getclients");
      setClients(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch clients");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <ClientForm fetchClients={fetchClients} />
      <ClientList clients={clients} fetchClients={fetchClients} />
    </div>
  );
}
