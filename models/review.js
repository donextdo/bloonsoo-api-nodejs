const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  hotelId: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    // required: true,
  },
  body: {
    type: String,
    required: true,
  },
  submittedDate: {
    type: Date,
    default: Date.now,
  },
  verifiedPurchase: {
    type: Boolean,
    // required: true,
  },
  imagesOrVideos: [String],
  reviewStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isHelpfulFeedback: {
    type: Boolean,
    default: false,
  },
});

const Reviews = mongoose.model("review", ReviewSchema);

module.exports = Reviews;

// product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
// user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
