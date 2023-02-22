import { Router } from 'express'
import commissionController from '../controllers/commission.controller.js'
import { AuthenticatedMiddleware, AuthenticatedUserMiddleware, AuthenticatedAdminMiddleware } from '../middleware/authenticated.js'

const router = Router()

const path = '/commission'

router.post(
    `${path}/update`,
    AuthenticatedAdminMiddleware,
    commissionController.changeCommisonRate
)

router.get(
    `${path}/rate`,
    AuthenticatedMiddleware,
    commissionController.getCommissionRate
)

router.get(
    path,
    AuthenticatedAdminMiddleware,
    commissionController.getCommissionData
)


router.get(
    `${path}/total`,
    AuthenticatedAdminMiddleware,
    commissionController.getTotalCommission
)


export default router