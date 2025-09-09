const express = require("express");
const dotenv = require("dotenv");

const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");

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

// show route

app.get("/listings/:id" , async (req , res)=>{
    const { id }= req.params;
    const stuffData = await Listing.findById(id)
    res.render("listings/show" , {stuffData})
    // console.log(stuffData , "okkkkkkk")
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