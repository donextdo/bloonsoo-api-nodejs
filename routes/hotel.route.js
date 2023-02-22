import { Router } from 'express'

import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import { 
    createHotel, 
    setCoverPhoto, 
    addGalleryPhotos, 
    getAllHotels, 
    addFacilities, 
    addPolicies, 
    finalize, 
    getHotelById,
    deleteHotel, 
    approveHotel,
    publishHotel,
    unPublishHotel,
    getHotels,
    getMyHotels,
    rejectHotel,
    inactiveHotel,
    activeHotelCount,
    getAnnonymousHotels
} from '../controllers/hotel.js'

import { 
    AuthenticatedMiddleware, 
    AuthenticatedAdminMiddleware, 
    AuthenticatedHotelAdminMiddleware 
} from '../middleware/authenticated.js'

const uploadOptions = multer({storage: storage})

const router = Router()

const path = '/hotel'

router.get(path, getAllHotels)

router.get(
    `${path}/:id`, 
    getHotelById
)

router.post(
    `${path}/create`, 
    AuthenticatedMiddleware, 
    createHotel
)

router.patch(
    `${path}/facilities/:id`, 
    AuthenticatedMiddleware, 
    addFacilities
)

router.patch(
    `${path}/coverphoto/:id`, 
    AuthenticatedMiddleware, 
    uploadOptions.single('cover_img'), 
    setCoverPhoto
)

router.patch(
    `${path}/gallery/:id`, 
    AuthenticatedMiddleware, 
    uploadOptions.single('gallery_img'), 
    addGalleryPhotos
)

router.patch(
    `${path}/policies/:id`, 
    AuthenticatedMiddleware, 
    addPolicies
)

router.patch(
    `${path}/finalize/:id`, 
    AuthenticatedMiddleware, 
    finalize
)

router.patch(
    `${path}/approve/:id`,
    AuthenticatedAdminMiddleware,
    approveHotel
)

router.patch(
    `${path}/reject/:id`,
    AuthenticatedAdminMiddleware,
    rejectHotel
)

router.patch(
    `${path}/inactive/:id`,
    AuthenticatedAdminMiddleware,
    inactiveHotel
)

router.delete(
    `${path}/:id`, 
    AuthenticatedAdminMiddleware, 
    deleteHotel
)

router.patch(
    `${path}/publish/:id`, 
    AuthenticatedHotelAdminMiddleware, 
    publishHotel
)

router.patch(
    `${path}/unpublish/:id`, 
    AuthenticatedHotelAdminMiddleware, 
    unPublishHotel
)

router.get(
    `${path}/get/all`, 
    AuthenticatedAdminMiddleware, 
    getHotels
)

router.get(
    `${path}/get/my`, 
    AuthenticatedMiddleware, 
    getMyHotels
)

router.get(
    `${path}/get/active/count`, 
    AuthenticatedMiddleware, 
    activeHotelCount
)

router.get(
    `${path}/get/user-not-exist/list`,
    AuthenticatedAdminMiddleware,
    getAnnonymousHotels
)

export default router