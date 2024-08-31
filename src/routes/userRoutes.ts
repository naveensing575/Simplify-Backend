import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'

const userController = new UserController()
const router = Router()

router.get('/profile', authMiddleware, userController.getUserProfile)
router.put('/profile', authMiddleware, userController.updateUserProfile)

export default router
