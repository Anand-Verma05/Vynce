import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute=async(req,res,next)=>{
    console.log("Reached middleware");
try{
    const token =req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            message:"not toke projvided"
        })
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({
            message:"Unauthorized - invalid token"
        })
    }

    const user=await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(401).json({
            message:"Unauthorized - user not found"
        })
    }
    req.user=user;

    next()
}catch(err){
    console.log("error in protectRoute middleware",err);
    res.status(500).json({
        message:
        "server errr"
    })
}

}