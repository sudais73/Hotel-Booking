

// function to check the availability of room//

import Booking from "../models/booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const checkAvailability = async({checkInDate,checkOutDate, room})=>{

    try {
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate},
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.log(error.message)
        res.json({success:false , msg:error.message})
    }
}
// api to check availability of room//

//post/api/bookings/check-availability//

export const checkAvailabilityApi = async(req,res)=>{
    try {
        const {checkInDate,checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate,checkOutDate, room})
        res.json({success:true, isAvailable})
    } catch (error) {
        console.log(error.message)
        res.json({success:false , msg:error.message})
    }
}


// api to create a new booking//

//post/api/booking/book//
export const createBooking = async(req,res)=>{
    try {
        const{checkInDate,checkOutDate, room} = req.body;
        const user = req.user._id;

        // before booking check availability//
         const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
             room})

             if(!isAvailable){
                res.json({
                    success:false, msg:"This room is not available"
                })
             }

             // get total price from room//
             const roomData = await Room.findById(room).populate('hotel');
             let totalPrice  = roomData.pricePerNight;
             // calculate totalPrice based on the nights//
             const checkIn = new Date(checkInDate)
             const checkOut = new Date(checkOutDate)
             const timeDiff = checkOut.getTime() - checkIn.getTime();
            const nights = Math.cell(timeDiff / (1000*3600*24));
            totalPrice *= nights;
            const booking = await Booking.create({
                user,
                room,
                hotel:roomData.hotel._id,
                guests:+guests,
                checkInDate,
                checkOutDate,
                totalPrice,
            })

            res.json({success:true, msg:'Booking created successfully'})
    } catch (error) {
        console.log(error.message)
        res.json({success:false , msg:error.message})
    }
}


// api to get all booking for a user//
export const getUserBooking = async(req,res)=>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate('room hotel').sort({createdAt: -1})
        res.json({success:true, bookings})
    } catch (error) {
        console.log(error.message)
        res.json({success:false , msg:error.message})
        
    }
}

export const getHotelBookings = async(req,res)=>{

    try {
         const hotel = await Hotel.findOne({owner:req.auth.userId});
    if(!hotel){
        res.json({success:false, msg:'Hotel Not found'})
    }

    const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel,user").sort({createdAt: -1})

    //total booking//
    const totalBookings = bookings.length;
    // total revenue//
    const totalRevenue = bookings.reduce((acc, booking)=>acc+booking.totalPrice,0)

    res.json({
        success:true, dashboardData:{
            bookings,
            totalBookings,
            totalRevenue,

        }
    })


        
    } catch (error) {
         console.log(error.message)
        res.json({success:false , msg:error.message})
    }
   
}
