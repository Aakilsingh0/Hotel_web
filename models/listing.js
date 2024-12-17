const mongoose=require("mongoose");
const { type } = require("os");
const Review = require("./review.js");
const { url } = require("inspector");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
      type:String,
      require :true  
    },
    description:String,
    image:{
      url:String,
      filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews :[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{

  if(listing){
    await Review.deleteMany({_id :{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;



