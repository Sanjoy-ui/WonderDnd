const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override')

const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
app.use(methodOverride('_method'))
app.set("view engine", "ejs")
app.set("views" , path.join(__dirname, "views"))
app.use(express.urlencoded({extended : true}))

app.get("/", (req,res)=>{
    res.send("Im root");
})
// index route
app.get("/listings", async (req , res)=> {
    const allListings = await Listing.find()
    // console.log(allListings);
    res.render("listings/index" , {data_Collections : allListings});
})

// new route 
app.get("/listings/new", (req, res)=>{
    res.render("listings/new" )
})

// create route 

app.post("/listings", async(req, res)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save().then(res=> console.log(res))
    
    res.redirect("listings")
})

// show route
// okk

app.get("/listings/:id" , async (req , res)=>{
    const { id }= req.params;
    const stuffData = await Listing.findById(id)
    res.render("listings/show" , {stuffData})
    // console.log(stuffData , "okkkkkkk")
})


// edit route 

app.get("/listings/:id/edit", async(req,res)=>{
    
    const { id }= req.params;
    const stuffData = await Listing.findById(id)
    
    res.render("listings/edit.ejs" , {stuffData})
})

app.put("/listings/:id", async (req,res)=>{
    const {id} =req.params
    console.log(req.body.stuffData)
    // await Listing.findByIdAndUpdate(id , {...req.body.stuffData})
    res.redirect("listings")
})

// app.get("/listingTest" ,  (req,res)=>{
//     const sampleListing = new Listing({
//         title : "House 4bhk",
//         description : "big good house",
//         price: 25000,
//         location : "teliamura",
//         country : "india"
//     })
//     sampleListing.save().then((res)=>{
//         console.log(sampleListing)
//     }).catch((error)=>{
//         console.log(error)
//     })
//     res.send("done ")
// })

MONGODB_URL = 'mongodb://127.0.0.1:27017/WonderDnd'
async function connectdb() {
    await mongoose.connect(MONGODB_URL);
}

app.listen(8576, ()=>{
    console.log(`Server is running on port 8576`);
    connectdb().then(res=> console.log("db connected" )).catch(err => console.log("db error"))
})