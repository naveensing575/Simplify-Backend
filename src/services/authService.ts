// src/services/authService.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string

export const signup = async (email: string, password: string, name: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      auth0Id: hashedPassword,
    },
  })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  })

  return { token, user }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isMatch = await bcrypt.compare(password, user.auth0Id)

  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  })

  return { token, user }
}

export const logout = () => {
  // Implement logic if needed, like token blacklisting
  return { message: 'Logged out successfully' }
}
