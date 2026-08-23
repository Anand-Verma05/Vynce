import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey=process.env.STEAM_API_KEY
const apiSecret=process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("api key or secret is missiing");}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try{
            await streamClient.upsertUsers([userData]);
            return userData
    }catch(err){
        console.log("error upserting stream user",err);
        }
}

export const generateStreamToken=(userId)=>{
    try{
        //ensure is is a astiring
        const userIdstr=userId.toString();
        return streamClient.createToken(userIdstr);
    }catch(err){
        console.error("error genreating stream token",err);

    }
    
}

