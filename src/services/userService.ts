import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserService {
  // Fetch user profile by userId from token (UUID as string)
  async getUserProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }, // UUID is a string
        select: {
          id: true,
          email: true,
          name: true,
          role: true, // Ensure 'role' is selected
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      return user // Role is included in the user object
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
        select: {
          id: true,
          email: true,
          name: true,
          role: true, // Ensure 'role' is selected in case you need to return it
        },
      })

      return updatedUser
    } catch (error) {
      throw new Error('Error updating user profile')
    }
  }

  // Fetch all users with their roles
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
      return users
    } catch (error) {
      throw new Error('Error fetching users')
    }
  }
}
