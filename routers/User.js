const express= require("express")
const router=express.Router();
const User=require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");
const UserControlles=require("../controllers/Users");
//rendersingup
router.get("/singup",(UserControlles.renderSingup));
//singup
router.post("/singup",wrapAsyc(UserControlles.singup));
//renderlogin
router.get("/login",(UserControlles.renderlogin));
//login
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),(UserControlles.login));

//logout
router.get("/logout",(UserControlles.logout))
module.exports=router;
