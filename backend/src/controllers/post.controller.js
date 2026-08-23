import Post from "../models/Post.js";
import User from "../models/User.js";

async function createPost(req,res){
    try{
        const {caption,mediaUrl,mediaType}=req.body;

        if(!mediaUrl || !mediaType){
            return res.status(400).json({
                message:"mediaUrl and mediaType are required"
            })
        }

        if(!["image","video"].includes(mediaType)){
            return res.status(400).json({
                message:"mediaType must be either image or video"
            })
        }

        const post =await Post.create({
            author:req.user._id,
            caption:caption || "",
            mediaUrl,
            mediaType


        })

        const populatedPost=post.populate("author","fullName username profilePic ");
        res.status(201).json({
            success:true,
            post:populatedPost
        });

    }
    catch(err){
        console.log("Error in createPost controller",err.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

async function getPosts(req,res){
    try{
        const posts=await Post.find().populate("author","fullName username profilePic").sort({createdAt:-1});
        
        res.status(200).json({
            success:true,
            posts
        })
    
    }
    catch(err){
        console.log("Error in getPosts controller",err.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }

}



export {createPost,getPosts}