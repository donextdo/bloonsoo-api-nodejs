import mongoose from 'mongoose'

const CommissionRateSchema = new mongoose.Schema({
    commission_rate: {
        type: Number,
        default: 10
    }
})

const CommissionRate = mongoose.model("CommissionRate", CommissionRateSchema);

export default CommissionRate