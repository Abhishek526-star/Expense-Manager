import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";



dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRE_TIME = '24h';

export default async function authMiddleware(req, res, next){
    // Get token from header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        });
    }
    const token = authHeader.split(" ")[1];
    try{
        const payload = JWT.verify(token, JWT_SECRET);
        const user = await User.findById(payload.userId).select("-password");
        if(!user){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }
        req.user = user;
        next();
    }
    catch(err){
        console.error("JWT verification failed:", err);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
}