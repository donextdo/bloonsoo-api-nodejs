import { Router } from 'express'

import { createRoom, getAllRooms, getRoomsByProperyId, deleteRoom } from '../controllers/room.js'

const router = Router()

router.get('/', getAllRooms)

router.post('/create', createRoom)

router.get('/bypropertyid/:id', getRoomsByProperyId)

router.delete('/:id', deleteRoom)

export default router