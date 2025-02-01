const Category = require('../models/CategoryModel');
const Blog = require('../models/BlogModel');
const CommentModel = require('../models/CommentModel');
const User = require('../models/UserModel');

module.exports.home = async (req,res) =>{
    try{    
        let allCategory = await Category.find({status:true});
        let allBlogs;
        if(req.query.catId){
             allBlogs = await Blog.find({status:true,categoryId:req.query.catId});
        }
        else{
             allBlogs = await Blog.find({status:true});
        }
        console.log(allCategory);
        return res.render("userPanel/home",{
            allCategory,allBlogs
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.singlePost = async (req,res) =>{
    try{
        let postId = req.params.id;
        let postWiseComments = await CommentModel.find({postId:req.params.id,status:true});
        return res.render('userPanel/singlepost',{
            postId,postWiseComments
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.addComments = async (req,res) =>{
 
    var image = '';
    if(req.file){
        image = CommentModel.imagePath+"/"+req.file.filename
    }
    req.body.image = image;

    let addCom = await CommentModel.create(req.body);
    if(addCom){
        let blogDetails = await Blog.findById(req.body.postId);
        blogDetails.commentIds.push(addCom._id);
        await Blog.findByIdAndUpdate(req.body.postId, blogDetails);
    }
    return res.redirect('back');
}


module.exports.addUserData = async (req,res)=>{
    try{
        
        if(req.body.password == req.body.cpass){
            let userData = await User.create(req.body);
            if(userData){
                console.log("User Register Successfully");
                return res.redirect('back');
            }
            else{
                console.log("user not registered");
                return res.redirect('back');
            }
        }
        else{
            console.log("Password and confirm password not match");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checkUserData = async (req,res) =>{
    try{
        return res.redirect('/');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.setLikesByUsers = async (req,res) =>{
    try{
        let singleComment = await CommentModel.findById(req.params.commentId);
        if(singleComment){
            let likesUserAlreadyExist = singleComment.likes.includes(req.user._id);
            if(likesUserAlreadyExist){
                //remove user id into likes
                let newData = singleComment.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singleComment.likes = newData;
            }
            else{
                //add user Id into Likes
                singleComment.likes.push(req.user._id);
            }
            await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment);

            let dislikesUserAlreadyExist = singleComment.dislikes.includes(req.user._id);
            if(dislikesUserAlreadyExist){
                let newData = singleComment.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singleComment.dislikes = newData;
                await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment);
            }
            return res.redirect('back');

        }
        else{
            console.log("Comment Not Found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.setDislikesByUsers=  async (req,res)=>{
    try{
        let singleComment = await CommentModel.findById(req.params.commentId);
        if(singleComment){
            let likesUserAlreadyExist = singleComment.dislikes.includes(req.user._id);
            if(likesUserAlreadyExist){
                //remove user id into likes
                let newData = singleComment.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singleComment.dislikes = newData;
            }
            else{
                //add user Id into Likes
                singleComment.dislikes.push(req.user._id);
            }
            await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment);


            let UserAlreadyExist = singleComment.likes.includes(req.user._id);
            if(UserAlreadyExist){
                let newData = singleComment.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singleComment.likes = newData;
                await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment);
            }

            return res.redirect('back');
        }
        else{
            console.log("Comment Not Found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}