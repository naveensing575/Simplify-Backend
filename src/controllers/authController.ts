import { Request, Response } from 'express'
import { signup, login } from '../services/authService'

export class AuthController {
  // User signup
  async signup(req: Request, res: Response) {
    const { email, password, name, role } = req.body

    try {
      // Call the signup service
      const result = await signup(email, password, name, role)

      // Return the result to the client
      return res.status(201).json(result)
    } catch (error: any) {
      console.error('Error during signup:', error.message)
      return res
        .status(500)
        .json({ message: error.message || 'Error during signup' })
    }
  }

  // User login
  async login(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      // Call the login service
      const result = await login(email, password)

      // Return the result to the client
      return res.status(200).json(result)
    } catch (error: any) {
      console.error('Error during login:', error.message)
      return res
        .status(401)
        .json({ message: error.message || 'Error during login' })
    }
  }
}
