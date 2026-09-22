const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            filename: {
                type: String,
                default: "listingimage",
            },
            url: {
                type: String,
                default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
                set: (v) =>
                    !v || v === ""
                        ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
                        : v,
            },
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be greater than or equal to 0"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "Trending",
                "Beachfront",
                "Iconic Cities",
                "Mountains",
                "Castles",
                "Camping",
                "Arctic",
                "Luxury",
                "Farms",
                "Lakefront",
                "General",
            ],
            default: "General",
        },
    },
    {
        timestamps: true,
    }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
