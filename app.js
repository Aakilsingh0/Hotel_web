if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET)
const express = require("express");
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate= require("ejs-mate")
const path = require("path");
const WrapAsync = require("./utils/wrapAsyc.js");
const ExpressError = require("./utils/ExpressError.js"); 
const {listingSchema,reviewSchema} = require("./Schema.js");
const Review= require("./models/review.js");
const listingsRouter = require("./routers/listing.js");
const reviewsRouter = require("./routers/review.js");
const userRouter = require("./routers/User.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy =require("passport-local");
const User=require("./models/user.js");



const db=process.env.ATLASDB
const app=express();
const port=8080;
const store=MongoStore.create({
    mongoUrl: db,
    crypto:{
       secret:process.env.SECRET,
    },
    touchAfter:24*3600,


});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION",error);
})
const sessionOption= {
    store,
    secret:process.env.SECRET, 
    resave:false,
     saveUninitialized:true,
     cookie:{
        expires: Date.now() +7 * 24 * 60 * 60 * 1000,
        maxAge: +7 * 24 * 60 * 60 * 1000,
        httpOnly:true
     }
    }

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();

});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


main().then(()=>{
        console.log("database is connected...");
}).catch((err)=>
{
    console.log(err);
})
async function main() {
    await mongoose.connect(db)
}

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not Found!"))
})


app.use((err,req,res,next)=>{
    const {statusCode=500,message="something went wrond!"}=err;
res.status(statusCode).send(message);
});
app.listen(port,()=>{
    console.log(`port is working on ${port}`)
});