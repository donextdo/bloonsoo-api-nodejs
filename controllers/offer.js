import Offer from "../models/offer.js";

export const addOffer = async (req, res, next) => {
    try {
        
        const {
            offer_code,
            expiredate,
            startdate,
            days,
            discount,
            note,
            hotel_id,
            hotel_name,
          } = req.body;

        const existingOffer = await Offer.findOne({ offer_code });
        console.log(existingOffer)
        
        if (existingOffer) {
            return res.status(400).json({ error: 'Offer code already exists' });
        }

        const newOffer = new Offer({
            offer_code: offer_code,
            expiredate: expiredate,
            startdate: startdate,
            days: days,
            discount: discount,
            note: note,
            hotel_id: hotel_id,
            hotel_name:hotel_name
        });

        let response = await newOffer.save();
        if (response) {
            res.status(200).json({ message: 'Offer saved successfully' });
        }

    }
    catch (error) {
        next(error)
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllOffer = async(req, res) => {
    try {
        
        const rooms = await Offer.find()

        res.status(200).json(rooms)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}