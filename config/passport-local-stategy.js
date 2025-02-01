const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const Admin = require('../models/AdminModel');
const User = require('../models/UserModel');

passport.use(new LocalStategy({usernameField:'email'}, async function(email,password,done){
    
    
    const AdminData = await Admin.findOne({email:email});
  
    if(AdminData){
        if(AdminData.password==password){
            return done(null,AdminData);
        }else{
            return done(null,false);
        }
    }else{
        return done(null,false);
    }
}))



passport.use("userAuth",new LocalStategy({usernameField:'email'}, async function(email,password,done){
    console.log("middelware");
    console.log(email,password);
    const UserData = await User.findOne({email:email});
    console.log(UserData);
    console.log("Test");
    if(UserData){
        if(UserData.password==password){
            return done(null,UserData);
        }else{
            return done(null,false);
        }
    }else{
        return done(null,false);
    }
}))


passport.serializeUser(function(user,done){
    return done(null,user.id);
})

passport.deserializeUser(async function(id,done){
    const adminData= await Admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }else{
        const userData = await User.findById(id);
        if(userData){
            return done(null,userData);
        }
        else{
            return done(null,false);
        }
    }
});


passport.setAuthAdminData = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.adminData = req.user;
    }
    next();
}

passport.checkLoginAdmin = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect('/login');
    }
}

module.exports = passport;