import { Router } from 'express'
import * as authController from '../controllers/authControllers.js'
import { validateRegister } from '../middleware/validateRequest.js'
import { rateLimiter } from '../middleware/rateLimiter.js'

const publicRouter = Router()

// Pastikan semua middleware dan controller kompatibel dengan Express
publicRouter.post(
  '/register',
  rateLimiter,
  validateRegister,
  authController.register
)
publicRouter.post('/login', rateLimiter, authController.login)

export { publicRouter }
