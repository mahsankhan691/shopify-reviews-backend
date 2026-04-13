const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ──────────────────────────────────────────────
// CORS Configuration
// Allows requests from your Shopify store
// ──────────────────────────────────────────────
const allowedOrigins = [
  // Your Shopify store domains - edit these!
  `https://${process.env.SHOPIFY_STORE_DOMAIN}`,
  `https://www.${process.env.SHOPIFY_STORE_DOMAIN}`,
  // Allow localhost for testing
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────
// MongoDB Connection
// ──────────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
const reviewsRouter = require("./routes/reviews");
app.use("/api/reviews", reviewsRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shopify Reviews API is running 🚀",
    version: "1.0.0",
    endpoints: {
      getReviews: "GET /api/reviews?productId=<productId>",
      postReview: "POST /api/reviews",
      deleteReview: "DELETE /api/reviews/:id",
      approveReview: "PATCH /api/reviews/:id/approve",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: Access denied from this origin",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ──────────────────────────────────────────────
// Start Server (only for local dev - Vercel ignores this)
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
