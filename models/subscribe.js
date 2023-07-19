const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubscribeSchema = new Schema({

    email: {
        type: String,
        unique: true,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },

   
});

const Subscribe = mongoose.model("subscribe", SubscribeSchema);
module.exports = Subscribe;
