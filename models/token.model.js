import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        requied: true,
        unique: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const VerifyToken = mongoose.model('VerifyToken', TokenSchema)

export default VerifyToken