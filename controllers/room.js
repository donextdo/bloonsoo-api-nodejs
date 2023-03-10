import Hotel from '../models/hotel.js'
import Room from '../models/room.js'

export const createRoom = async (req, res) => {
    const newRoom = new Room(req.body)

    try {

        const room = await newRoom.save()

        await Hotel.findByIdAndUpdate(
            req.body.property_id,
            {
                $push: {rooms: room.id}
            }
        )

        res.status(201).json(room)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getAllRooms = async(req, res) => {
    try {
        
        const rooms = await Room.find()

        res.status(200).json(rooms)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getRoomsByProperyId = async(req, res) => {
    try {
        
        const rooms = await Room.find({
            property_id: req.params.id
        })

        res.status(200).json(rooms)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getRoomGroupsByType = async(req, res) => {
    try {
        
        const rooms = await Room.aggregate([
            {
                $match: {
                    property_id: req.params.id
                }
            },
            {
                $group: {
                  _id: '$room_type',
                  rooms: { $push: '$$ROOT' }
                }
            }
        ])

        res.status(200).json(rooms)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteRoom = async (req, res) => {
    try {
        
        const roomExist = Room.findById(req.params.id)

        if(!roomExist) return res.status(404).json({message: `Cannot find room with id ${req.params.id}`})

        await Room.findByIdAndDelete(req.params.id)

        res.status(200).json({message: 'Room deleted successfully'})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const addGalleryPhotos = async (req, res) => {
    const file = req.file

    if(!file) {
        return res.status(400).json({message: "Please add an image"})
    }

    const imgPath = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`

    try {

        res.status(201).json(imgPath)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}