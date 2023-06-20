import { Router } from 'express'
import userController from '../controllers/user.js'
import multer from 'multer'
import { profileStorage } from '../middleware/multerStorage.js'
import { AuthenticatedMiddleware, AuthenticatedAdminMiddleware, AuthenticatedHotelAdminMiddleware, AuthenticatedUserMiddleware } from '../middleware/authenticated.js'

const router = Router()
const uploadOptions = multer({storage: profileStorage})

const path = '/user'

router.patch(`${path}/:id`, AuthenticatedUserMiddleware, userController.updateUser)

router.get(
    `${path}/:id`,
    AuthenticatedUserMiddleware ,
    userController.getOneUser
)

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

router.get(
    `${path}/active-users`,
    AuthenticatedHotelAdminMiddleware ,
    userController.totalUsers
)

router.get(
    `${path}/get-all-users`,
    AuthenticatedAdminMiddleware ,
    userController.getAllUsers
)

router.post(
    `${path}/search-user`,
    AuthenticatedAdminMiddleware ,
    userController.searchUser
)

router.patch(
    `${path}/hotels/assign-hotels`,
    AuthenticatedAdminMiddleware,
    userController.assignHotels
)

export default router