import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function CompanySettings() {
  const [company, setCompany] = useState(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState(null); // file upload
  const [preview, setPreview] = useState(""); // preview image

  // Fetch existing company
  const fetchCompany = async () => {
    try {
      const res = await api.get("/company");
      setCompany(res.data);
      setName(res.data.name);
      setAddress(res.data.address);
      setTagline(res.data.tagline);
      setPreview(res.data.logo ? res.data.logo : "");
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No company yet.");
      }
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // CREATE or UPDATE company
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("tagline", tagline);
    formData.append("address", address);
    if (logo) formData.append("logo", logo);

    try {
      let res;
      if (company) {
        // update
        res = await api.put("/company", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Company updated!");
      } else {
        // create
        res = await api.post("/company", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Company created!");
      }
      setCompany(res.data);
      fetchCompany();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving company");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Company Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Logo Upload */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Company Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />

          {preview && (
            <img
              src={`${process.env.REACT_APP_API_URL.replace("/api", "")}${company.logo}`}
              alt="Logo Preview"
              className="mt-3 w-24 h-24 rounded object-cover border"
            />
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {company ? "Update Company" : "Create Company"}
        </button>
      </form>
    </div>
  );
}
