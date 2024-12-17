const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({})
    res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.renderShowListing = async (req, res, next) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" }, })
        .populate("owner");
    if (!listing) {
        req.flash("error", " Listing  is not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing  created!")
    res.redirect("/listings");
}
module.exports.renderEditListing=async(req,res)=>{
    let {id}=req.params;
    id = id.trim();
    const listing=await  Listing.findById(id);
    if(!listing)
        {
          req.flash("error"," Listing  is not exist!");
          res.redirect("/listings");
        }
        let OrignalImageUrl=listing.image.url;
        OrignalImageUrl.replace("/upload","/upload/h_300,w_300/e_blur:500")

    res.render("./listings/edit.ejs",{listing, OrignalImageUrl})
}
module.exports.UpdateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename}
        await listing.save();
    }
  
    req.flash("success"," Listing  updated!")
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res,next)=>{
    let {id}=req.params;
  let deletedListing=  await Listing.findByIdAndDelete(id);
  console.log( deletedListing);
  req.flash("success"," Listing  deleted!")
  res.redirect("/listings");
}