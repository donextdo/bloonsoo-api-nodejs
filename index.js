import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import { config } from 'dotenv'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url';

import hotelRoute from './routes/hotel.js'
import roomRoute from './routes/room.js'
import authRoute from './routes/auth.js'
import bookingRoute from './routes/booking.js'

import passport from 'passport'
import('./utils/strategy.js')

config()

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('dev'))

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)

app.use('/public', express.static(__dirname + '/public'))

app.use('/api/hotel/', hotelRoute)
app.use('/api/rooms/', roomRoute)
app.use('/api/auth/', authRoute)
app.use('/api/booking/', bookingRoute)

const port = process.env.PORT || 9000

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(port, console.log(`Database connection ready and server running on port ${port}`))
    })
    .catch((err) => {
        console.log(err.message)
    })