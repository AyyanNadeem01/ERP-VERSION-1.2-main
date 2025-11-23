import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaUserTie } from "react-icons/fa";

export default function Home() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalClients: 0,
    totalSales: 0,
    totalVendors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, clientsRes, salesRes, vendorsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/items`),
          axios.get(`${process.env.REACT_APP_API_URL}/clients`),
          axios.get(`${process.env.REACT_APP_API_URL}/sales/getallsales`),
          axios.get(`${process.env.REACT_APP_API_URL}/vendors`),
        ]);
        setStats({
          totalItems: itemsRes.data.length,
          totalClients: clientsRes.data.length,
          totalSales: salesRes.data.length,
          totalVendors: vendorsRes.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
     
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome to ERP Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow flex flex-col items-center">
            <FaBoxOpen className="text-3xl text-blue-500 mb-2" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Items</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalItems}</span>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow flex flex-col items-center">
            <FaUsers className="text-3xl text-green-500 mb-2" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Clients</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</span>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow flex flex-col items-center">
            <FaShoppingCart className="text-3xl text-yellow-500 mb-2" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Sales</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</span>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow flex flex-col items-center">
            <FaUserTie className="text-3xl text-red-500 mb-2" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Vendors</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalVendors}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
