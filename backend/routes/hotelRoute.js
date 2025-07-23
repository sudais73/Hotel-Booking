import express from 'express'
import { protect } from '../middleware/Auth.js'
import { registerHotel } from '../controllers/hotelController.js'
const hotelRouter = express.Router()
hotelRouter.post('/add-hotel', protect, registerHotel)

export default hotelRouter