// ===== server.js =====
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const userRoutes = require("./Routes/userRoutes");
const propertyRoutes = require("./Routes/propertyRoutes");
const ratingRoutes = require("./Routes/ratingRoutes");

dotenv.config();
connectDB();

const app = express();

// Increase payload limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration - Updated to include localhost:5173
app.use(
 app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://aayush45123.github.io",
      "https://aayush45123.github.io/Rent-Mate",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Routes
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/ratings", ratingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📊 Health check available at http://localhost:${PORT}/api/health`
  );
  console.log(
    `🏠 Property routes available at http://localhost:${PORT}/api/property`
  );
  console.log(`👤 User routes available at http://localhost:${PORT}/api/user`);
});
