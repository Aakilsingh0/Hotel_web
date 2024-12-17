const express = require("express");
const router = express.Router({mergeParams:true});
const WrapAsync = require("../utils/wrapAsyc.js");
const Review= require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview}=require("../middleware.js")
const {listingSchema,reviewSchema} = require("../Schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewsControllers=require("../controllers/reviews.js")

/* Reviews 
// post Route */
router.post("/",validateReview, WrapAsync(reviewsControllers.createReview));
 // delete reviews
 router.delete("/:reviewId"),isLoggedIn,isReviewAuthor,WrapAsync(reviewsControllers.deleteReview);

 module.exports = router 