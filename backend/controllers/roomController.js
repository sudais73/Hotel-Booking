import {v2 as cloudinary} from 'cloudinary'
import Hotel from "../models/Hotel.js";
import Room from '../models/Room.js';

// api to create a new room for a hotel//

export const createRoom = async(req, res)=>{
    try {
        
        const {roomType,pricePerNight, amenities} = req.body;
        const {owner} = req.auth.userId;
        const hotel = await Hotel.findOne({owner})
        if(!hotel){
            res.json({success:false,msg:"Hotel is Not found"})
        }


        // upload img to cloudinary/
        const uploadImages = req.files.map( async(file)=>{
           const response = await cloudinary.uploader.upload(file.path);
           return response.secure_url;
        })
        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel:hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({success:true, msg:"Room Created Successfully"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}
// api to get all rooms//


export const getRooms = async(req, res)=>{
    try {
        const rooms = await Room.find({isAvailable:true}).populate({
            path:'hotel',
            populate:{
                path:'owner',
                select:'image'
            }
        }).sort({createdAt: -1});

        res.json({success:true, rooms})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}


// api to get all rooms for specific hotels//
export const getOwnersRooms = async(req, res)=>{
    try {
        const hotelData = await Hotel({owner:req.auth.userId});
        const rooms = await Room.find({hotel:hotelData._id.toString()}).populate('hotel')
         res.json({success:true, rooms})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
        
    }
}

// api to toggle availability of a rooms
export const toggleRoomAvailability = async(req, res)=>{
    try {
        const {roomId} = req.body;
        const roomsData = await Room.findById(roomId);
        roomsData.isAvailable = !roomsData.isAvailable;
         res.json({success:true, msg:"Room availability is updated"})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
        
    }
}