import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { IGetUserAuthInfoRequest } from '../types/index'

const userService = new UserService()

export class UserController {
  // Get user profile
  async getUserProfile(req: Request, res: Response) {
    const typedReq = req as IGetUserAuthInfoRequest

    try {
      const userId = typedReq.user?.userId // Extract userId as string

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      // Fetch user profile based on userId
      const user = await userService.getUserProfile(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      console.error('Error retrieving user profile:', error)
      res.status(500).json({ message: 'Error retrieving user profile' })
    }
  }

  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    const typedReq = req as IGetUserAuthInfoRequest

    try {
      const userId = typedReq.user?.userId // Extract userId as string

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      // Update the user profile based on userId and request body
      const updatedUser = await userService.updateUserProfile(userId, req.body)

      res.status(200).json(updatedUser)
    } catch (error) {
      console.error('Error updating user profile:', error)
      res.status(500).json({ message: 'Error updating user profile' })
    }
  }
}
