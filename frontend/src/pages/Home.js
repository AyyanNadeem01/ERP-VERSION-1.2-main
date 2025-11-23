import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast"; // Assuming you use react-hot-toast

// --- Helper Component for Statistics Card ---
const StatCard = ({ title, count, icon, color }) => (
  // Enhanced card styling with dark mode support, stronger shadow, and hover effect
  <div className="
    bg-white dark:bg-gray-700 rounded-xl p-6 shadow-xl transition-all duration-300 transform hover:shadow-2xl hover:scale-[1.01]
    flex items-center justify-between border-b-4
    border-opacity-80
  " style={{ borderColor: color }}>
    <div className="flex flex-col">
      {/* Title text respects dark mode */}
      <span className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1">
        {title}
      </span>
      {/* Count number is prominent */}
      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
        {count}
      </span>
    </div>
    {/* Icon styling with a specific color from props */}
    <div className="text-4xl" style={{ color: color }}>
      {icon}
    </div>
  </div>
);
// ---------------------------------------------


export default function Home() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalClients: 0,
    totalSales: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, clientsRes, salesRes, vendorsRes] = await Promise.all([
          // NOTE: Ensure your axios instances use necessary authentication headers if required
          axios.get(`${process.env.REACT_APP_API_URL}/items`),
          axios.get(`${process.env.REACT_APP_API_URL}/clients`),
          axios.get(`${process.env.REACT_APP_API_URL}/sales/getallsales`),
          axios.get(`${process.env.REACT_APP_API_URL}/vendors/getvendors`), // Assuming this is the correct vendors endpoint based on previous files
        ]);
        
        setStats({
          // Safely check if data is an array before getting length
          totalItems: Array.isArray(itemsRes.data) ? itemsRes.data.length : 0,
          totalClients: Array.isArray(clientsRes.data) ? clientsRes.data.length : 0,
          totalSales: Array.isArray(salesRes.data) ? salesRes.data.length : 0,
          totalVendors: Array.isArray(vendorsRes.data) ? vendorsRes.data.length : 0,
        });
        
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        toast.error("Could not load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Data structure for rendering cards
  const statData = [
    { title: "Total Items", count: stats.totalItems, icon: <FaBoxOpen />, color: "#3B82F6" }, // Blue
    { title: "Total Clients", count: stats.totalClients, icon: <FaUsers />, color: "#10B981" }, // Green
    { title: "Total Sales Orders", count: stats.totalSales, icon: <FaShoppingCart />, color: "#F59E0B" }, // Yellow
    { title: "Total Vendors", count: stats.totalVendors, icon: <FaUserTie />, color: "#EF4444" }, // Red
  ];

  return (
    // LAYOUT FIX: Removed 'flex min-h-screen' and kept only background and padding
    // The parent Dashboard component will handle min-h-screen
    <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-full">
      
      {/* Content Area */}
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
          Welcome to ERP Dashboard
        </h1>

        {/* Statistics Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading dashboard statistics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* --- Placeholder Sections for Expansion --- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Sales/Activity Card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Insights</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Display graphical representation of monthly sales or pending payments here.
                </p>
                {/* 

[Image of simple business dashboard charts and graphs]
 */}
            </div>

            {/* Notifications/Tasks Card */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Tasks</h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>- Verify recent vendor payments.</li>
                    <li>- Follow up on open sales orders.</li>
                    <li>- Inventory low alerts.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}