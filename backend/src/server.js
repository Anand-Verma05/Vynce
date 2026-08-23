import express  from 'express';
import dotenv from "dotenv"
import dns from "node:dns";
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import connectDB from "./lib/db.js";
const app=express();

const PORT=process.env.PORT;
const __directoryname=path.resolve();


 app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__directoryname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__directoryname,"../frontend/dist/index.html"));
    })
}

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})
