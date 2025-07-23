import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
connectDB()
const app = express()
app.use(cors()) // enable cors//
// middlewares
app.use(express.json())
app.use(clerkMiddleware())
// Api to listen clerk//
app.use("/api/clerk", clerkWebhooks)


app.get('/', (req,res)=>res.send("Api is working fine"))
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log(`Server is listening to port ${PORT}`))