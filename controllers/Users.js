const User=require("../models/user");
const passport = require("passport");

module.exports.renderSingup=(req,res)=>{
    res.render("Users/singup.ejs");
}
module.exports.singup=async(req,res)=>{
    try{
     let {username,email,password}=req.body;
 
     const newUser= new User({username,email});
     const registerUser= await User.register(newUser,password);
     console.log(registerUser);
     req.login(registerUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","user register successfully..");
         res.redirect("/listings");
     })
    }catch(e){
     req.flash("error",e.message);
     res.redirect("/singup");
    }
 }

 module.exports.renderlogin=(req,res)=>{
    res.render("Users/Login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to my site");
    let redirectUrl=res.locals.redirectUrl ||"/listings"
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");

    })

}