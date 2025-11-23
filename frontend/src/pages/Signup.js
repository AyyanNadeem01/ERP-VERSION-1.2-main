import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Signup() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await api.post("/auth/signup", { userId, password });
      toast.success("Signup successful. You can now login.");
      navigate("/"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Signup
        </h2>

        <InputField label="User ID" type="text" value={userId} onChange={setUserId} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 mt-2 rounded-lg hover:bg-green-700 transition"
        >
          Signup
        </button>

        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
