const mongoose = require("mongoose")

const listingSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        filename : {
            type : String,
        },
        url : String,
        // type : String,
        // default : "https://images.pexels.com/photos/30874496/pexels-photo-30874496.jpeg",
        // set : (v)=> v === "" ? "https://images.pexels.com/photos/30874496/pexels-photo-30874496.jpeg" : v ,
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;