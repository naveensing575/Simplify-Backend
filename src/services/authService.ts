import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string

// Ensure JWT_SECRET is defined
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const signup = async (
  email: string,
  password: string,
  name: string,
  role: UserRole = 'MEMBER',
) => {
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

    // Create a new user with default role 'MEMBER'
    const user = await prisma.user.create({
      data: {
        email,
        name,
        auth0Id: hashedPassword, // Store hashed password in auth0Id field
        role: role, // Role defaults to MEMBER, can be overridden (e.g., by an admin)
      },
    })

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    // Return token and required user information (id, name, email, role)
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
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
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    // Return token and required user information (id, name, email, role)
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error: any) {
    console.error('Error during login:', error.message)
    throw new Error('Error during login')
  }
}
