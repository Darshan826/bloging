const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');

const imgpath = "/uploads/users";


const CommentSchema= mongoose.Schema({
    postId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required : true
    },
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    comment:{
        type : String,
        required : true
    },
    image:{
        type : String,
        required : true
    },
    likes:[
        { 
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
        }
    ],

    dislikes : [
        { 
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
        }
    ],
    status:{
        type : Boolean,
        default:true
    }

},{timestamps:true});

const userStorage =multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imgpath))
    },
    filename :(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now())
    }
})

CommentSchema.statics.uploadImage = multer({storage: userStorage}).single('image');
CommentSchema.statics.imagePath = imgpath;


const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;