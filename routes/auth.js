import { Router } from 'express'

import authController from '../controllers/auth.js'

import { AuthenticatedMiddleware } from '../middleware/authenticated.js'

const router = Router()

router.post('/signup', authController.signup)

router.post('/signin', authController.signin)

router.post('/admin/login', authController.adminLogin)

router.get('/user', AuthenticatedMiddleware, authController.getAuthUser)

export default router