import Hotel from "../models/Hotel.js";
import UserModel from "../models/User.js";

export const registerHotel = async(req, res)=>{
    try {
        const{name, address,contact,city} = req.body;
        const owner = req.user._id
        // check is user already registered//
        const hotel = await Hotel.findOne({owner});
        if(hotel){
            res.json({success:false, msg:"Hotel Already Registered"})
        }
        await Hotel.create({name,address,contact,city,owner})
        await UserModel.findByIdAndUpdate(owner,{role:"hotelOwner"})
        res.json({success:true, msg:"Hotel Registered Successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}

