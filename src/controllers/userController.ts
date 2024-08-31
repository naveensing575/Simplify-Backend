import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { IGetUserAuthInfoRequest } from '../types/index'

const userService = new UserService()

export class UserController {
  async getUserProfile(req: Request, res: Response) {
    const typedReq = req as IGetUserAuthInfoRequest

    try {
      const auth0Id = typedReq.user.sub
      const user = await userService.getUserProfile(auth0Id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile' })
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    const typedReq = req as IGetUserAuthInfoRequest // Type assertion here

    try {
      const auth0Id = typedReq.user.sub
      const updatedUser = await userService.updateUserProfile(auth0Id, req.body)

      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile' })
    }
  }
}
