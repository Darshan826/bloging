const express = require('express');
const AdminCtl = require('../controller/adminCtl');
const Admin = require('../models/AdminModel');
const router = express.Router();
const passport = require('passport');

const {check} = require('express-validator')


// nestedRoutes of category  ;
router.use('/category',passport.checkLoginAdmin,require('./categoryRoutes'));

// nestedRoutes of blog 
router.use('/blog',passport.checkLoginAdmin,require('./blogRoutes'));

// login system ------------

router.get('/login',AdminCtl.login);

router.post('/checkLogin',passport.authenticate('local',{failureRedirect:'/login'}),AdminCtl.checkLogin);

router.get('/logOut',AdminCtl.logOut);

//---------------------

// profile show ---------------

router.get('/myProfile',passport.checkLoginAdmin,AdminCtl.myProfile);

// ----------------------

// change password --------------------

router.get('/checkPassword',passport.checkLoginAdmin,AdminCtl.checkPassword);

router.post('/verifyNewPassword',AdminCtl.verifyNewPassword);

//-----------------------

// forget password ==-----------------------------

router.get('/checkEmail',AdminCtl.checkEmail);

router.post('/verifyEmail',AdminCtl.verifyEmail);

router.get('/checkOtp',AdminCtl.checkOtp);

router.post('/verifyOtp',AdminCtl.verifyOtp);

router.get('/forgetPassword',AdminCtl.forgetPassword);

router.post('/setNewPassword',AdminCtl.setNewPassword);

//--------------------------

router.get('/dashBoard',passport.checkLoginAdmin,AdminCtl.dashBoard);

router.get('/addAdmin',passport.checkLoginAdmin,AdminCtl.addAdmin);

router.post('/insertAdmin',Admin.uploadAdminImage,[
    check('fName').notEmpty().withMessage("First Name is required").isLength({min:2}).withMessage("Minimum 2 charaters required"),
    check('lName').notEmpty().withMessage("Last Name is required").isLength({min:2}).withMessage("Minimum 2 charaters required"),
    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("enter Valid email").custom(async (value)=>{
        let checkEmail = await Admin.find({email: value}).countDocuments();
        if(checkEmail>0){
            throw new Error('Admin email is already exist');
        }
    }),
    check('password').notEmpty().withMessage("password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/).withMessage("one lowercase, one uppercase, one digit, special Character and minimum 8-20 characters"),
    check('gender').notEmpty().withMessage("Select Gender"),
    check('hobby').notEmpty().withMessage("Select Any one Hobby"),
    check('city').notEmpty().withMessage('Select City'),
    check('about').notEmpty().withMessage('Enter About Section some Charaters')
],AdminCtl.insertAdmin);

router.get('/viewAdmin',passport.checkLoginAdmin,AdminCtl.viewAdmin);

router.get('/deleteAdmin/:id',AdminCtl.deleteAdmin);

router.get('/updateAdmin/:id',passport.checkLoginAdmin,AdminCtl.updateAdmin);

router.post('/editAdmin',Admin.uploadAdminImage,AdminCtl.editAdmin);


router.use("/", require('./UserRoutes'));

module.exports = router;