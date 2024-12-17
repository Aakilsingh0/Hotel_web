const Review= require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
 
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success"," New Review is Added!");
    res.redirect(`/listings/${listing._id}`)
 }
 module.exports.deleteReview=async(req,res)=>{
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
   res.send("this is delete");
 }