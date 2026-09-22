const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");

// /api/listings
router
    .route("/")
    .get(listingController.getAllListings)
    .post(listingController.createListing);

// /api/listings/:id
router
    .route("/:id")
    .get(listingController.getListingById)
    .put(listingController.updateListing)
    .delete(listingController.deleteListing);

module.exports = router;
