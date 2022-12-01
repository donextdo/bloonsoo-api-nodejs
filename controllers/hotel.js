import Hotel from '../models/hotel.js'

export const createHotel = async (req, res) => {
    const newHotel = new Hotel({
        property_name: req.body.property_name,
        star_rating: req.body.star_rating,
        contact_name: req.body.contact_name,
        contact_phone_number: req.body.contact_phone_number,
        contact_phone_number_alternative: req.body.contact_phone_number_alternative,
        is_own_multiple_hotels: req.body.is_own_multiple_hotels,
        use_channel_manager: req.body.use_channel_manager,
        property_address: req.body.property_address
    })

    try {

        const hotel = await newHotel.save()

        res.status(201).json(hotel)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



export const setCoverPhoto = async (req, res) => {
    const file = req.file

    if(!file) {
        return res.status(400).json({message: "Please add an image"})
    }

    const imgPath = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`

    const coverImg = {
        cover_image: imgPath
    }

    try {
        
        const hotelExist = await Hotel.findById(req.params.id)

        if(!hotelExist) return res.status(404).json({message: `Cannot find hotel with id ${req.params.id}`})

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                $set: coverImg
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(201).json(hotel)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const getAllHotels = async (req, res) => {
    try {
        
        const hotels = await Hotel.find()

        res.status(200).json(hotels)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const addFacilities = async (req, res) => {

    try {
        
        const hotelExist = await Hotel.findById(req.params.id)

        if(!hotelExist) return res.status(404).json({message: `Cannot find hotel with id ${req.params.id}`})

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(201).json(hotel)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
