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

const toggleLike= async (req,res)=>{
    try{
        const {id:postId}=req.params;
        const userId=req.user._id;

        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"Post not found"
            })
        }

        const alreadyLiked=post.likes.some( (id)=> id.toString()===userId.toString());

        if(alreadyLiked){
            post.likes.pull(userId);
        }else{
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            success:true,
            liked:!alreadyLiked,
            likesCount:post.likes.length
        })

    }catch(err){
        console.log("Error in toggleLike controller",err.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const toggleSavePost= async(req,res)=>{
    try{
        const {id:postId}=req.params;
        const userId=req.user._id;

        const post=await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                message:"Post not found"
            })
        }

        const user=await User.findById(userId);

        const alreadySaved=user.savedPosts.some( (id)=> id.toString()===postId.toString());

        if(alreadySaved){
            user.savedPosts.pull(postId);
        }else{
            user.savedPosts.push(postId);
        }
        await user.save();

        res.status(200).json({
            success:true,
            saved:!alreadySaved,
            savedPostsCount:user.savedPosts.length
        })

    }
    catch(err){ 
        console.log("Error in toggleSavePost controller",err.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

const getSavedPosts=async(req,res)=>{
    try{
        const userId=req.user._id;

        const user=await User.findById(userId).populate({
            path:"savedPosts",
            populate:{
                path:"author",
                select:"fullName username profilePic"
            }
        });

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            posts:user.savedPosts
        })



    }
    catch(err){
        console.log("Error in getSavedPosts controller",err.message);
        return res.status(500).json({
            message:"Internal server error"
        })
    }

}

export {createPost,getPosts,toggleLike,toggleSavePost,getSavedPosts};