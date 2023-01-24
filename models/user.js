import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'hotel-admin'],
            default: 'user'
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash

    next()
})

UserSchema.methods.isValidPassword = async function (
    password
){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", UserSchema);

export default User