// import Hotel from "../models/Hotel.js";
// import UserModel from "../models/User.js";

// export const registerHotel = async(req, res)=>{
//     try {
//         const{name, address,contact,city} = req.body;
//         const owner = req.auth.userId
//         // check is user already registered//
//         const hotel = await Hotel.findOne({owner});
//         if(hotel){
//             return res.json({success:false, msg:"Hotel Already Registered"})
//         }
//         await Hotel.create({name,address,contact,city,owner})
//         await UserModel.findByIdAndUpdate(owner, {role:"hotelOwner"})
//         res.json({success:true, msg:"Hotel Registered Successfully"})
//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false, msg:error.message})
//     }
// }



import Hotel from "../models/Hotel.js";
import UserModel from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    // 1. Validate input
    const { name, address, contact, city } = req.body;
    const owner = req.user._id; // Comes from protect middleware

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // 2. Check for existing hotel registration
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.status(409).json({
        success: false,
        message: "You have already registered a hotel"
      });
    }

    // 3. Create hotel and update user role (transaction recommended)
    const newHotel = await Hotel.create({ 
      name, 
      address, 
      contact, 
      city, 
      owner 
    });

    await UserModel.findByIdAndUpdate(
      owner,
      { role: "hotelOwner" },
      { new: true }
    );

    // 4. Success response
    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      data: {
        hotelId: newHotel._id,
        name: newHotel.name,
        city: newHotel.city
      }
    });

  } catch (error) {
    console.error("Hotel registration error:", error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};