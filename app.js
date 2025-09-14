const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');

const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate")

app.engine("ejs" ,ejsMate )
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "/public")))

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(`Invalid ID format: ${id}`);
    }
    
    next();
};

app.get("/", (req, res) => {
    res.send("Im root");
});

// Index route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find();
        
        res.render("listings/index", { data_Collections: allListings });
        console.log("work")
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Error fetching listings");
    }
});

// New route (MUST come before /listings/:id)
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Create route
app.post("/listings", async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log("New listing created:", newListing);
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).send("Error creating listing");
    }
});

// Show route (with validation middleware)
app.get("/listings/:id", validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const stuffData = await Listing.findById(id);
        
        if (!stuffData) {
            return res.status(404).send("Listing not found");
        }
        
        res.render("listings/show", { stuffData });
        console.log("first")
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Error fetching listing");
    }
});

// Edit route (with validation middleware)
app.get("/listings/:id/edit", validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const stuffData = await Listing.findById(id);
        
        if (!stuffData) {
            return res.status(404).send("Listing not found");
        }
        
        res.render("listings/edit", { stuffData });
    } catch (error) {
        console.error("Error fetching listing for edit:", error);
        res.status(500).send("Error fetching listing");
    }
});

// Update route (with validation middleware)
app.put("/listings/:id", validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Update data:", req.body.stuffData);
        
        const updatedListing = await Listing.findByIdAndUpdate(
            id, 
            { ...req.body.stuffData }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }
        
        res.redirect("/listings");
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Error updating listing");
    }
});

// delete route 

app.delete("/listings/:id" , validateObjectId , async (req, res)=>{
    try {
        const {id} = req.params;
        const deleted = await Listing.findByIdAndDelete(id );
        console.log(deleted);
        res.redirect("/listings");

    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Error updating listing");
    }
})

// Test route (commented out - uncomment if needed)
// app.get("/listingTest", (req, res) => {
//     const sampleListing = new Listing({
//         title: "House 4bhk",
//         description: "big good house",
//         price: 25000,
//         location: "teliamura",
//         country: "india"
//     });
//     
//     sampleListing.save()
//         .then((result) => {
//             console.log("Sample listing created:", result);
//         })
//         .catch((error) => {
//             console.log("Error creating sample listing:", error);
//         });
//     
//     res.send("Test listing creation attempted");
// });

const MONGODB_URL = 'mongodb://127.0.0.1:27017/WonderDnd';

async function connectdb() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

app.listen(8576, () => {
    console.log(`Server is running on port 8576`);
    connectdb();
});