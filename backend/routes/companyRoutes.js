const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const { createCompany, getMyCompany, updateCompany, deleteCompany } = require("../controllers/companyController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/", authenticateToken, upload.single("logo"), createCompany);
router.get("/", authenticateToken, getMyCompany);
router.put("/", authenticateToken, upload.single("logo"), updateCompany);
router.delete("/", authenticateToken, deleteCompany);

module.exports = router;
