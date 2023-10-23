import { Router } from 'express'
import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import { 
    createRoom,
    getAllRooms,
    getRoomsByProperyId, 
    deleteRoom, 
    addGalleryPhotos, 
    getRoomGroupsByType,
    deleteGalleryPhoto 
} from '../controllers/room.js'

const uploadOptions = multer({storage: storage})

const router = Router()

const path = '/rooms'

router.get(
    path, 
    getAllRooms
)

router.post(
    `${path}/create`, 
    createRoom
)

router.get(
    `${path}/bypropertyid/:id`, 
    getRoomsByProperyId
)

router.get(
    `${path}/group/:id`, 
    getRoomGroupsByType
)

router.delete(
    `${path}/:id`, 
    deleteRoom
)

router.post(
    `${path}/gallery/:id`, 
    uploadOptions.single('gallery_img'), 
    addGalleryPhotos
)

router.delete(
    `${path}/gallery/delete/:id`, 
    deleteGalleryPhoto
)

export default router