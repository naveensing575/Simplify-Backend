// src/services/authService.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const signup = async (email: string, password: string, name: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  // Hash the password and store it in the auth0Id field
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      auth0Id: hashedPassword, // Using auth0Id to store the hashed password as per schema
    },
  })

  // Generate a JWT token
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

  // Compare the password with the hashed password stored in auth0Id
  const isMatch = await bcrypt.compare(password, user.auth0Id)

  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  })

  return { token, user }
}
