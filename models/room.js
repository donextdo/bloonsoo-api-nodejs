import mongoose from 'mongoose'


const BedSchema = new mongoose.Schema({
    bed_type: {
        type: String,
        required: true,
    },
    no_of_beds: {
        type: Number,
        required: true
    }
})


const RoomSchema = new mongoose.Schema({
    property_id: {
        type: String,
        required: true
    },
    room_type: {
        type: String,
        required: true
    },
    room_name: {
        type: String,
        required: true
    },
    smoking_policy: {
        type: String,
        required: true
    },
    nbr_of_rooms: {
        type: Number,
        required: true
    },
    beds: [{
        type: BedSchema,
        required: true
    }],
    room_size: {
        type: String,
    },
    price_for_one_night: {
        type: String,
        required: true
    },
    facilities: [{
        type: String,
        required: true
    }],
    gallery_images: [{
        type: String
    }]
    
}, {timestamps: true})

const Room = mongoose.model("Room", RoomSchema);

export default Room