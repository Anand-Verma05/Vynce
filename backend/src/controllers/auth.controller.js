import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import bcrypt from "bcryptjs";
export async function signup(req,res){
    const {email,password,fullName, username} = req.body;
    console.log("Signup controller reached");
    console.log(req.body);
    try{
        if(!email || !password || !fullName || !username){
            return res.status(400).json({
                message:"All fields are required"
            });}

            if(password.length<4){
                return res.status(400).json({
                    message:"Password must be at least 6 characters long"});}
            
            const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return res.status(400).json({
                    message:"Invalid email format"
                });
            }

            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({
                    message:"Email already exists please enter another email"
                });
            }

            const idx=Math.floor(Math.random()*100)+1;

            const randomAvator=`https://i.pravatar.cc/150?img=${idx}`

            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);
            const newUser=await User.create({
                fullName,
                username:username.toLowerCase(),
                email,
                password :hashedPassword,
                profilePic:randomAvator
            });

            //create user in the stream also 


            try{
                await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic|| ""
            });
            console.log(`Steam use createf ofr ${newUser.fullName}`);
            }catch(err){
                console.log("error creating steamuser",err);
            }


            


            const token=jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

            res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
});
            res.status(201).json({success:true,user:newUser});

        }catch(err){
            console.log("error in signup process")
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }

}

export async function login(req,res){

    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const user=await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        // const isPasswrodCorrect=await user.matchPassword(password);
        const isPasswrodCorrect=await bcrypt.compare(password,user.password);

        if(!isPasswrodCorrect){
            return res.status(401).json({
                message:"invalid email or pass"
            });
        }

         const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

           res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
});

            res.status(200).json({
                success:true,
                user
            })

    }catch(err){
        console.log("Error in loginh controller",err.message);
        return res.status(500).json({
            message:"Interenal server Error"
        })


    }

}

export async function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    }) 

}

export async function onboard(req, res) {
    console.log("Reached onboard controller");

    try {
        const userId = req.user._id;

        const {
            fullName,
            username,
            bio,
            location
        } = req.body;

        if (!fullName || !username || !bio || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !username && "username",
                    !bio && "bio",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        // Check whether username is already taken
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                username: username.toLowerCase(),
                bio,
                location,
                isOnboarded: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update user in Stream Chat
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            });

            console.log(
                `Stream user updated for ${updatedUser.fullName}`
            );

        } catch (err) {
            console.log("Error updating Stream user", err);
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (err) {
        console.log("Onboarding Error", err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}