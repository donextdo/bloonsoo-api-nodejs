import mongoose from 'mongoose'


const AddressSchema = new mongoose.Schema({
    street_address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    }
})

const ParkingSchema = new mongoose.Schema({
    parking_type: {
        type: String
    },
    parking_type_2: {
        type: String
    },
    parking_type_3: {
        type: String
    },
    reservation: {
        type: Boolean
    },
    parking_price: {
        type: String
    }
})

const ExtraBedSchema = new mongoose.Schema({
    no_of_beds: {
        type: Number
    },
    accommodate_guests: [{
        type: String
    }]
})


const HotelSchema = new mongoose.Schema({
    property_name: {
        type: String,
        required: true
    },
    star_rating: {
        type: String,
        required: true
    },
    contact_name:  {
        type: String,
        required: true
    },
    contact_phone_number: {
        type: String,
        required: true
    },
    contact_phone_number_alternative: {
        type: String,
    },
    is_own_multiple_hotels: {
        type: Boolean,
        default: false
    },
    use_channel_manager: {
        type: Boolean,
        default: false
    },
    property_address: {
        type: AddressSchema,
        required: true
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    cover_image: {
        type: String
    },
    parking: {
        type: Boolean,
        default: false
    },
    parking_details: {
        type: ParkingSchema,
    },
    breakfast: {
        type: Boolean
    },
    languages: [{
        type: String
    }],
    extra_beds: {
        type: Boolean
    },
    extra_beds_options: {
        type: ExtraBedSchema
    },
    amenities: [{
        type: String
    }]

    
}, {timestamps: true})

const Hotel = mongoose.model("Hotel", HotelSchema);

export default Hotel