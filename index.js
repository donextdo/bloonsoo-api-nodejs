import App from "./app.js";
import { config } from "dotenv";
import validateEnv from "./utils/validateEnv.js";

import hotelRoute from './routes/hotel.route.js'
import roomRoute from './routes/room.route.js'
import authRoute from './routes/auth.route.js'
import bookingRoute from './routes/booking.route.js'
import userRoute from './routes/user.route.js'
import commissionRoute from './routes/commission.route.js'

import sendEmail from "./utils/email/sendEmail.js";

import('./utils/strategy.js')

validateEnv()
config()

const port = process.env.PORT || 9000

// sendEmail()

const routes = [
    hotelRoute,
    roomRoute,
    authRoute,
    bookingRoute,
    userRoute,
    commissionRoute
]

const app = new App(routes, port)

app.listen()

// const app = express()

// app.use(helmet())
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
// app.use(cors())
// app.options('*', cors())
// app.use(express.json())
// app.use(morgan('dev'))

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename)

// app.use('/public', express.static(__dirname + '/public'))

// app.use('/api/hotel/', hotelRoute)
// app.use('/api/rooms/', roomRoute)
// app.use('/api/auth/', authRoute)
// app.use('/api/booking/', bookingRoute)
// app.use('/api/user/', userRoute)

// const port = process.env.PORT || 9000

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         app.listen(port, console.log(`Database connection ready and server running on port ${port}`))
//     })
//     .catch((err) => {
//         console.log(err.message)
//     })