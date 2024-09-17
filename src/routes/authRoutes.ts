import { Router } from 'express'
import { AuthController } from '../controllers/authController'

const authController = new AuthController()
const router = Router()

// Auth routes
router.post('/signup', authController.signup)
router.post('/login', authController.login)

export default router
