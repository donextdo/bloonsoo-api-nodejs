import { Router } from 'express'
import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import { createRoom, getAllRooms, getRoomsByProperyId, deleteRoom, addGalleryPhotos, getRoomGroupsByType } from '../controllers/room.js'

const uploadOptions = multer({storage: storage})

const router = Router()

router.get('/', getAllRooms)

router.post('/create', createRoom)

router.get('/bypropertyid/:id', getRoomsByProperyId)

router.get('/group/:id', getRoomGroupsByType)

router.delete('/:id', deleteRoom)

router.post('/gallery', uploadOptions.single('gallery_img'), addGalleryPhotos)

export default router