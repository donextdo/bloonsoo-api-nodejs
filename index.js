import App from "./app.js";
import { config } from "dotenv";
import validateEnv from "./utils/validateEnv.js";

import hotelRoute from "./routes/hotel.route.js";
import roomRoute from "./routes/room.route.js";
import authRoute from "./routes/auth.route.js";
import bookingRoute from "./routes/booking.route.js";
import userRoute from "./routes/user.route.js";
import commissionRoute from "./routes/commission.route.js";
import { Server } from "socket.io";
import http from "http";
import axios from "axios";
import sendEmail from "./utils/email/sendEmail.js";
import reviewRouter from './routes/review.js'

import("./utils/strategy.js");

validateEnv();
config();

const port = process.env.PORT || 9000;

// sendEmail()

const routes = [
  hotelRoute,
  roomRoute,
  authRoute,
  bookingRoute,
  userRoute,
  commissionRoute,
  reviewRouter
];

const app = new App(routes, port);

const server = http.createServer(app);
const io = new Server(server);

async function searchHotels(query) {
  try {
    const response = await axios.get("http://localhost:9000/api/hotel");
    const hotels = response.data;
    console.log("response , ", response);
    if (!hotels) {
      console.error("Products not found in API response.");
      return [];
    }
    // const filteredHotels = hotels.filter(
    //   (hotel) =>
    //     hotel.property_address.street_address
    //       .toLowerCase()
    //       .includes(query.toLowerCase()) ||
    //     hotel.property_name.toLowerCase().includes(query.toLowerCase())
    // );
    const filteredHotels = hotels.filter((hotel) => {
      const streetAddress =
        hotel.property_address?.street_address?.toLowerCase() || "";
      const propertyName = hotel.property_name?.toLowerCase() || "";

      return (
        streetAddress.includes(query.toLowerCase()) ||
        propertyName.includes(query.toLowerCase())
      );
    });

    if (filteredHotels.length === 0) {
      const locationCoordinates = await getCoordinates(query);
      if (!locationCoordinates) {
        console.error(
          "Failed to retrieve coordinates for the location:",
          query
        );
        return [];
      }

      const { latitude, longitude } = locationCoordinates;

      const nearbyResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000,
            type: "lodging",
            key: "AIzaSyALJN3bDbGEk8ppXieiWNnwHVYM_8ntKng",
          },
        }
      );
      console.log("nearbyResponse : ", nearbyResponse);
      const nearbyHotels = nearbyResponse.data.results.map((result) => ({
        property_name: result.name,
        street_address: result.vicinity,
        city: result.vicinity,
      }));
      console.log("Nearby Hotels:", nearbyHotels);

      const matchedHotels = nearbyHotels
        .map((nearbyHotel) => {
          const matchedHotel = hotels.find(
            (hotel) =>
              hotel.property_name
                .toLowerCase()
                .includes(nearbyHotel.property_name.toLowerCase()) ||
              hotel.property_address.street_address
                .toLowerCase()
                .includes(query.toLowerCase())
          );

          if (matchedHotel) {
            return {
              property_name: matchedHotel.property_name,
              city: matchedHotel.property_address.city,
              street_address: matchedHotel.property_address.street_address,
              id: matchedHotel._id,
            };
          }

          return null;
        })
        .filter(Boolean);
      console.log("Matched Hotels:", matchedHotels);
      return matchedHotels;
    } else {
      const searchResults = filteredHotels.map((hotel) => ({
        property_name: hotel.property_name,
        city: hotel.property_address.city,
        street_address: hotel.property_address.street_address,
        id: hotel._id,
      }));

      console.log("Search Results:", searchResults);
      return searchResults;
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

io.on("connection", (socket) => {
  console.log("A client connected.");

  socket.on("search", async (query) => {
    console.log(`Received search query: ${query}`);

    const results = await searchHotels(query);

    socket.emit("searchResults", results);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});

async function getCoordinates(location) {
  const apiKey = "AIzaSyALJN3bDbGEk8ppXieiWNnwHVYM_8ntKng";
  const encodedLocation = encodeURIComponent(location);

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`
    );

    const { results } = response.data;
    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
  } catch (error) {
    console.error("Failed to retrieve coordinates:", error);
  }

  return null;
}

const portt = 5000;
server.listen(portt, () => {
  console.log(`Server listening on port ${portt}.`);
});
app.listen();

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
