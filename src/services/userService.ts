import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserService {
  // Fetch user profile by userId from token (UUID as string)
  async getUserProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }, // UUID is a string
      })

      if (!user) {
        throw new Error('User not found')
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    } catch (error) {
      throw new Error('Error retrieving user profile')
    }
  }

  // Update user profile by userId from token (UUID as string)
  async updateUserProfile(
    userId: string,
    data: { email?: string; name?: string },
  ) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      })

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      }
    } catch (error) {
      throw new Error('Error updating user profile')
    }
  }
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      return users
    } catch (error) {
      throw new Error('Error fetching users')
    }
  }
}
