const express = require('express');

const routes = express.Router();

const userCtl = require('../controller/userCtl');

const CommentModel = require('../models/CommentModel');

const passport = require('passport');

routes.get("/userRegister", async(req,res)=>{
    return res.render('userPanel/UserRegister');
})


routes.get("/userLogin", async (req,res)=>{
    return res.render('userPanel/UserLogin');
})

routes.post("/addUserData",[],userCtl.addUserData);

routes.post("/checkUserData",passport.authenticate("userAuth",{failureRedirect:"/userLogin",failureFlash:"Invalid email & password"}) ,userCtl.checkUserData);


routes.get("/",userCtl.home);

routes.get("/singlePost/:id", userCtl.singlePost);

routes.post("/addComments", CommentModel.uploadImage,userCtl.addComments);

routes.get("/setLikesByUsers/:commentId", userCtl.setLikesByUsers);
routes.get("/setDislikesByUsers/:commentId", userCtl.setDislikesByUsers);


module.exports = routes;