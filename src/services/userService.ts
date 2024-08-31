import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserService {
  async getUserProfile(auth0Id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { auth0Id },
      })
      return user
    } catch (error) {
      throw new Error('Error retrieving user profile')
    }
  }

  async updateUserProfile(
    auth0Id: string,
    data: { email?: string; name?: string },
  ) {
    try {
      const user = await prisma.user.update({
        where: { auth0Id },
        data,
      })
      return user
    } catch (error) {
      throw new Error('Error updating user profile')
    }
  }
}
