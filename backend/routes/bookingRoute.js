import express from 'express'
import { checkAvailabilityApi, createBooking, getHotelBookings, getUserBooking } from '../controllers/bookingController.js'
import { protect } from '../middleware/Auth.js'
const bookingRouter = express.Router()

bookingRouter.post('/check-availability', checkAvailabilityApi)
bookingRouter.post('/book', protect, createBooking)
bookingRouter.get('/user', protect, getUserBooking)
bookingRouter.get('/hotel', protect, getHotelBookings)

export default bookingRouter