import express from 'express'
import { protect } from '../middleware/Auth.js'
import { createRoom, getOwnersRooms, getRooms, toggleRoomAvailability,  } from '../controllers/roomController.js'
import upload from '../middleware/multer.js'
const roomRouter = express.Router()

roomRouter.post('/add-room', upload.array('images', 4), protect, createRoom)
roomRouter.get('/get-rooms', getRooms)
roomRouter.get('/get-owner-rooms',  protect, getOwnersRooms)
roomRouter.post('/toggle-availability',  protect, toggleRoomAvailability)

export default roomRouter