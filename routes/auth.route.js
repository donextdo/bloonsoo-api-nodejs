import { Router } from 'express'

import authController from '../controllers/auth.js'

import { AuthenticatedMiddleware } from '../middleware/authenticated.js'

const router = Router()

const path = '/auth'

router.post(
    `${path}/signup`, 
    authController.signup
)

router.post(
    `${path}/signin`, 
    authController.signin
)

router.post(
    `${path}/admin/login`, 
    authController.adminLogin
)

router.get(
    `${path}/user`, 
    AuthenticatedMiddleware, 
    authController.getAuthUser
)

router.post(
    `${path}/verify-email`,
    authController.verifyEmail
)

router.post(
    `${path}/send-password-reset-email`,
    authController.sendResetPasswordMail
)

router.post(
    `${path}/reset-password`,
    authController.resetPassword
)

export default router