import mongoose from 'mongoose'

const OfferSchema = new mongoose.Schema(
    {
        offer_code: {
            type: String,
            required: true,
            unique: true,
            
          },
          expiredate: {
            type: Date,
          },
          startdate: {
            type: Date,
          },
          days: {
            type: String,
          },
          discount: {
            type: Number,
            required: true
          },
          note: {
            type: String,
          },
          hotel_id: {
            type: String,
          },
          hotel_name:{
            type: String
          }
    },
    {
        timestamps: true
    }
)

const Offer = mongoose.model("Offer", OfferSchema);

export default Offer