const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const listingRoutes = require("./routes/listingRoutes");
const ExpressErrors = require("./utils/ExpressErrors");

const app = express();
const PORT = process.env.PORT || 8576;

// Connect to Database
connectDB();

// CORS configuration (flexible for local and AWS deployments)
const corsOptions = {
    origin: process.env.CORS_ORIGIN === "*" 
        ? "*" 
        : (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*"),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AWS Health Check Route (for ALB, EC2, ECS, or Beanstalk)
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "WonderDnd-Backend-API",
        environment: process.env.NODE_ENV || "development",
    });
});

// Root API Route
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to WonderDnd REST API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            listings: "/api/listings",
        },
    });
});

// Mount Routes
app.use("/api/listings", listingRoutes);

// Catch-all 404 handler for unmatched routes
app.use("*", (req, res, next) => {
    next(new ExpressErrors(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV !== "production") {
        console.error(`[Error] ${statusCode} - ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 WonderDnd API running on port ${PORT}`);
    console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📋 Listings API: http://localhost:${PORT}/api/listings`);
    console.log(`========================================`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
});

module.exports = app;
