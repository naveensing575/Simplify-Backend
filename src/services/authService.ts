// src/services/authService.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string

// Ensure JWT_SECRET is defined
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const signup = async (email: string, password: string, name: string) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        auth0Id: hashedPassword, // Store hashed password in auth0Id field
      },
    })

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    })

    return { token, user }
  } catch (error: any) {
    console.error('Error during signup:', error.message)
    throw new Error('Error during signup')
  }
}

export const login = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.auth0Id)

    if (!isMatch) {
      throw new Error('Invalid credentials')
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    })

    return { token, user }
  } catch (error: any) {
    console.error('Error during login:', error.message)
    throw new Error('Error during login')
  }
}
