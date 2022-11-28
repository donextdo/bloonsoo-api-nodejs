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
    cover_image: {
        type: String
    }
    
}, {timestamps: true})

const Hotel = mongoose.model("Hotel", HotelSchema);

export default Hotel