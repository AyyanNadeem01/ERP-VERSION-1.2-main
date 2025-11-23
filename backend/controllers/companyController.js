const Company = require("../models/Company");
const path = require("path");
const fs = require("fs");

// ----------------------- CREATE -----------------------
const createCompany = async (req, res) => {
  try {
    const { name, address, tagline } = req.body;
    let logo = "";

    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }

    const existingCompany = await Company.findOne({ user: req.user.id });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists for this user" });
    }

    const company = new Company({
      name: name || "Your Company",
      address: address || "Lahore, Pakistan",
      tagline: tagline || "Best Company",
      logo,
      user: req.user.id,
    });

    await company.save();
    res.status(201).json(company);
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- READ -----------------------
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) return res.status(404).json({ message: "No company found" });

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- UPDATE -----------------------
const updateCompany = async (req, res) => {
  try {
    const { name, address, tagline } = req.body;
    let logo;

    const company = await Company.findOne({ user: req.user.id });
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (req.file) {
      if (company.logo && fs.existsSync(path.join(__dirname, "../", company.logo))) {
        fs.unlinkSync(path.join(__dirname, "../", company.logo));
      }
      logo = `/uploads/${req.file.filename}`;
    }

    company.name = name || company.name;
    company.address = address || company.address;
    company.tagline = tagline || company.tagline;
    if (logo) company.logo = logo;

    await company.save();
    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- DELETE -----------------------
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({ user: req.user.id });
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Delete logo if exists
    if (company.logo && fs.existsSync(path.join(__dirname, "../", company.logo))) {
      fs.unlinkSync(path.join(__dirname, "../", company.logo));
    }

    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- EXPORT -----------------------
module.exports = { 
  createCompany,
  getMyCompany,
  updateCompany,
  deleteCompany
};
