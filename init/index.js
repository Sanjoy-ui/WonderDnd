const mongoose = require("mongoose")
const sampleListing = require("./data.js");
const Listing = require("../models/listing.js")

MONGODB_URL = 'mongodb://127.0.0.1:27017/WonderDnd'
async function connectdb() {
    await mongoose.connect(MONGODB_URL);
}

connectdb().then((res)=>{
    console.log("db connected")
}).catch( err => console.log(err))

const initdb = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListing)
    console.log("data successfully inserted");
}

initdb()