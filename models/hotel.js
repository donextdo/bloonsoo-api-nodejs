import mongoose from 'mongoose'


const AddressSchema = new mongoose.Schema({
    street_address: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    postal_code: {
        type: String,
        // required: true
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

const PoliciesSchema = new mongoose.Schema({
    cancellation_duration: {
        type: Number
    },
    pay_time: {
        type: String
    },
    preventAccidental_bookings: {
        type: Boolean
    },
    check_in_form: {
        type: String
    },
    check_in_untill: {
        type: String
    },
    check_out_form: {
        type: String
    },
    check_out_untill: {
        type: String
    },
    accommodate_children: {
        type: Boolean
    },
    pets: {
        type: Boolean
    }
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
        // required: true
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
        // required: true
    },
    about: {
        type: String
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    cover_image: {
        type: String
    },
    gallery_images: [{
        type: String
    }],
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
    facilities: [{
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
    }],
    policies: {
        type: PoliciesSchema
    },
    credit_card_options: {
        type: Boolean,
        default: false
    },
    is_open_to_bookings: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

const Hotel = mongoose.model("Hotel", HotelSchema);

export default Hotel