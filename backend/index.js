import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoute.js';
import hotelRouter from './routes/hotelRoute.js';
import cloudinaryConfig from './configs/cloudinary.js';
import roomRouter from './routes/roomRoute.js';
import bookingRouter from './routes/bookingRoute.js';
connectDB()
cloudinaryConfig()
const app = express()
app.use(cors()) // enable cors//
// middlewares
app.use(express.json())
app.use(clerkMiddleware())

// Api to listen clerk//
app.use("/api/clerk", clerkWebhooks)

app.get('/', (req,res)=>res.send("Api is working fine"))
app.use("/api/user", userRouter)
app.use("/api/hotel", hotelRouter)
app.use("/api/room", roomRouter)
app.use("/api/booking", bookingRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log(`Server is listening to port ${PORT}`))