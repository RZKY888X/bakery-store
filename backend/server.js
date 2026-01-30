// ============================================================================
// backend/server.js
// ============================================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic health check
app.get('/', (req, res) => {
  res.send('Bakery Store Backend is running!');
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    /* 
       Ensure directory exists. 
       Note: fs.mkdirSync with recursive:true is safe to run even if dir exists.
    */
    const fs = require('fs');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// Direct Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    console.log("Processing upload...");
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("Upload success:", fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/payment')); // Xendit Payment Route

// 404 Handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server v2 (Upload Fix) running on port ${port}`);
});
