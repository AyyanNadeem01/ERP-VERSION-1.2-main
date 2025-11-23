import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { userId, password });
      login(res.data.token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h2>

        <InputField label="User ID" type="text" value={userId} onChange={setUserId} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
