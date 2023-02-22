import { Router } from 'express'
import userController from '../controllers/user.js'
import multer from 'multer'
import { profileStorage } from '../middleware/multerStorage.js'
import { AuthenticatedMiddleware, AuthenticatedAdminMiddleware, AuthenticatedUserMiddleware } from '../middleware/authenticated.js'

const router = Router()
const uploadOptions = multer({storage: profileStorage})

const path = '/user'

router.patch(`${path}/:id`, AuthenticatedUserMiddleware, userController.updateUser)

router.patch(
    `${path}/profilepic/:id`, 
    AuthenticatedUserMiddleware, 
    uploadOptions.single('profilePic'),
    userController.setProfilePic
)

router.post(
    `${path}/create-hotel-admin`,
    AuthenticatedAdminMiddleware,
    userController.addHotelAdmin
)

export default router