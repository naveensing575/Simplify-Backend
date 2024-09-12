import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface IGetUserAuthInfoRequest extends Request {
  user?: { userId: string; role: string } // Include role in the user info
}

// Middleware to verify JWT and attach the userId and role to req.user
const authMiddleware = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' })
  }

  const token = authHeader.split(' ')[1] // Extract the token from Bearer

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' })
  }

  try {
    const secretKey = authConfig.jwtToken
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload

    // Attach userId from the decoded token payload to the request object
    if (decoded && typeof decoded === 'object' && decoded.userId) {
      const userId = decoded.userId as string

      // Fetch the user's role from the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true }, // Select only userId and role
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      req.user = { userId: user.id, role: user.role } // Attach userId and role to the request object

      next() // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: 'Invalid token payload' })
    }
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

// Middleware to check if the user has the required role
export const roleMiddleware = (requiredRoles: string[]) => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole || !requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'You do not have the required permissions' })
    }

    next()
  }
}

export default authMiddleware
