import React, { useEffect, useState } from "react";
import SaleForm from "../components/SalesForm";
import SaleList from "../components/SalesList";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Sales() {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales/getallsales");
      setSales(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch sales");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <SaleForm fetchSales={fetchSales} />
      <SaleList sales={sales} fetchSales={fetchSales} />
    </div>
  );
}
