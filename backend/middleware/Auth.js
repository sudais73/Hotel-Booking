import UserModel from "../models/User.js";

// middleware to check if the user is authenticated//
export const protect = async(req, res,next)=>{
    const {userId} = req.auth();
    if(!userId){
        res.json({success:false, msg:"Not Authorized"})
    }
    else{
        const user = await UserModel.findById(userId);
        req.user = user;
        next();
    }
} 

