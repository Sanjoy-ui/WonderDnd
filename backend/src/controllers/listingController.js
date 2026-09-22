const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const ExpressErrors = require("../utils/ExpressErrors");

// @desc    Fetch all listings (with search & category filters)
// @route   GET /api/listings
exports.getAllListings = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (category && category !== "All") {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ];
        }

        const listings = await Listing.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: listings.length,
            data: listings,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
exports.getListingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ExpressErrors(400, `Invalid ID format: ${id}`));
        }

        const listing = await Listing.findById(id);

        if (!listing) {
            return next(new ExpressErrors(404, "Listing not found"));
        }

        res.status(200).json({
            success: true,
            data: listing,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new listing
// @route   POST /api/listings
exports.createListing = async (req, res, next) => {
    try {
        // Support both req.body.listing or raw req.body
        const listingData = req.body.listing || req.body;

        if (!listingData.title || !listingData.price || !listingData.location || !listingData.country) {
            return next(new ExpressErrors(400, "Please provide all required fields: title, price, location, country"));
        }

        // Format image properly if string was provided
        if (typeof listingData.image === "string") {
            listingData.image = {
                filename: "listingimage",
                url: listingData.image,
            };
        }

        const newListing = new Listing(listingData);
        await newListing.save();

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            data: newListing,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ExpressErrors(400, `Invalid ID format: ${id}`));
        }

        const updateData = req.body.stuffData || req.body.listing || req.body;

        if (typeof updateData.image === "string") {
            updateData.image = {
                filename: "listingimage",
                url: updateData.image,
            };
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedListing) {
            return next(new ExpressErrors(404, "Listing not found"));
        }

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            data: updatedListing,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
exports.deleteListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ExpressErrors(400, `Invalid ID format: ${id}`));
        }

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            return next(new ExpressErrors(404, "Listing not found"));
        }

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully",
            data: deletedListing,
        });
    } catch (error) {
        next(error);
    }
};
