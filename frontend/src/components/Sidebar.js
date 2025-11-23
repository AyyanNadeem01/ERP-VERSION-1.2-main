import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaFileInvoiceDollar, FaShoppingCart, FaUserTie, FaBook, FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  const links = [
    { name: "Home", path: "/dashboard", icon: <FaHome /> },
    { name: "Items", path: "/dashboard/items", icon: <FaBoxOpen /> },
    { name: "Clients", path: "/dashboard/clients", icon: <FaUsers /> },
    { name: "Ledger", path: "/dashboard/ledger", icon: <FaFileInvoiceDollar /> },
    { name: "Sales", path: "/dashboard/sales", icon: <FaShoppingCart /> },
    { name: "Manage Vendors", path: "/dashboard/vendors", icon: <FaUserTie /> },
    { name: "Vendor Ledgers", path: "/dashboard/vendor-ledger", icon: <FaBook /> },
    { name: "Company Settings", path: "/dashboard/company", icon: <FaCog /> },
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/company`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCompany(res.data);
      } catch (err) {
        console.error("Failed to fetch company:", err);
      }
    };
    fetchCompany();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    // CHANGE 1: Used 'h-screen' to ensure the sidebar takes the exact viewport height.
    <div className="w-64 bg-gray-100 dark:bg-gray-900 flex flex-col justify-between h-screen shadow-lg">
      
      {/* Top Section: Logo & Navigation Container */}
      {/* Added flex-col and overflow-hidden to manage internal scrolling */}
      <div className="flex flex-col overflow-hidden">
        
        {/* Logo & Company Name (Fixed Height) */}
        {/* Added flex-shrink-0 to prevent this section from shrinking */}
        <div className="flex flex-col items-center justify-center py-6 flex-shrink-0">
          {company?.logo ? (
            <img
              src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${company.logo}`}
              alt={company.name || "Company Logo"}
              className="h-16 w-16 rounded-full shadow mb-2 object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700 mb-2 flex items-center justify-center text-gray-600 dark:text-gray-300">
              Logo
            </div>
          )}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {company?.name || "Your Company"}
          </span>
        </div>

        {/* Navigation */}
        {/* CHANGE 2: Removed 'max-h-[calc(100vh-200px)]' and added 'flex-1' to make it fill available space. */}
        <nav className="flex flex-col space-y-2 mt-6 px-4 overflow-y-auto flex-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 p-3 rounded-md transition-colors
                  ${isActive ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"}`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Toggle + Logout (Fixed Position) */}
      {/* Added flex-shrink-0 to prevent this section from shrinking */}
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3 flex-shrink-0">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}