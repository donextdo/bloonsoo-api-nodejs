import User from '../models/user.js'

const getAuthUser = (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(404).json({
                success: false,
                message: "Please login"
            })
        }

        res.status(200).json(req.user)

    } catch (error) {
        res.status(500).json(error.message)
    }
}

export default {
    getAuthUser
}