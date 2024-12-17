const express = require("express");
const router= express.Router();
const WrapAsync = require("../utils/wrapAsyc.js");
const Listing =require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const ListingControler=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfigs.js");
const upload = multer({ storage })



 router.route("/")
 .get(WrapAsync(ListingControler.index))
 .post(isLoggedIn,upload.single("listing[images]"),validateListing, WrapAsync(ListingControler.createListing));
// .post(upload.single('listing[images]'),(req,res)=>{
//     res.send(req.file);
// })
 router.route("/new")
 .get(isLoggedIn,(ListingControler.renderNewForm));
 router.route("/:id")
.get(WrapAsync(ListingControler.renderShowListing))
.put(isLoggedIn,isOwner,upload.single("listing[images]"),validateListing, WrapAsync(ListingControler.UpdateListing))
.delete(isLoggedIn,isOwner,(ListingControler.deleteListing));
router.route("/:id/edit")
.get(isLoggedIn,isOwner,WrapAsync(ListingControler.renderEditListing));






/*index route*/
//  router.get("/",WrapAsync(ListingControler.index));
 // new Route
//    router.get("/new",isLoggedIn,(ListingControler.renderNewForm))
// show route 
//  router.get("/:id",WrapAsync(ListingControler.renderShowListing));
/* Create route*/
//  router.post("/",isLoggedIn,validateListing, WrapAsync(ListingControler.createListing));
/* edit route*/
// router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(ListingControler.renderEditListing));
/* update route*/
 //router.put("/:id",isLoggedIn,isOwner,validateListing, WrapAsync(ListingControler.UpdateListing));
/* delete */
//  router.delete("/:id",isLoggedIn,isOwner,(ListingControler.deleteListing));
module.exports = router