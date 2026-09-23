const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/WonderDnd";

    try {
        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log(`MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
};

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
});

module.exports = connectDB;
