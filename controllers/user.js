import User from '../models/user.js'

const updateUser = async (req, res, next) => {
    try {
        
        const id = req.params.id

        const user = User.findById(id)

        if(!user) return res.status(404).json({
            code: 'NO_USER_FOUND',
            message: `no user found with given id ${id}`
        })

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        const { password, ...userInfo } = updatedUser._doc

        res.status(200).json(userInfo)

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}


const setProfilePic = async (req, res, next) => {
    try {
        const file = req.file

        if(!file) {
            return res.status(400).json({message: "Please add an image"})
        }

        const imgPath = `${req.protocol}://${req.get('host')}/public/profile/${file.filename}`

        const profilePic = {
            profilePic: imgPath
        }

        const id = req.params.id

        const user = User.findById(id)

        if(!user) return res.status(404).json({
            code: 'NO_USER_FOUND',
            message: `no user found with given id ${id}`
        })

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: profilePic
            },
            {
                new: true,
                runValidators: true
            }
        )

        const { password, ...userInfo } = updatedUser._doc

        res.status(200).json(userInfo)

    } catch (error) {
        res.status(500).json(error.message)
    }
}


export default {
    updateUser,
    setProfilePic
}