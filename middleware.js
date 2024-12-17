const Listing =require("./models/listing");
const {listingSchema,reviewSchema} = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js"); 

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.originalUrl);
        req.flash("error","must be login to create listing..");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next )=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not admin ");
    res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.validateListing = (req,res,next)=>{
    const {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let listing= await Listing.findById(reviewId);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not admin ");
    res.redirect(`/listings/${id}`);
   }
   next();
}