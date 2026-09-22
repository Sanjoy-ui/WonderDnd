require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const sampleListings = require("./seedData");

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/WonderDnd";

const seedDB = async () => {
    try {
        console.log("Connecting to MongoDB for seeding:", mongoURI.replace(/:([^:@]{4})[^:@]*@/, ":****@"));
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB.");

        const deletedCount = await Listing.deleteMany({});
        console.log(`Cleared ${deletedCount.deletedCount} existing listings.`);

        const inserted = await Listing.insertMany(sampleListings);
        console.log(`Successfully seeded ${inserted.length} listings into database!`);

        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
