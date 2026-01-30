const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

// Upload endpoint
router.post('/', (req, res, next) => {
    console.log("Upload request received");
    next();
}, upload.single('image'), (req, res) => {
  try {
    console.log("File uploaded successfully:", req.file);
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the URL to access the file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("File URL generated:", fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload processing error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
