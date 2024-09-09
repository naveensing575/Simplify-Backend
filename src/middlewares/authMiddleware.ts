import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

export interface IGetUserAuthInfoRequest extends Request {
  user?: { userId: number }
}

// Middleware to verify JWT and attach the userId to req.user
const authMiddleware = (
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
      req.user = { userId: decoded.userId } // Use userId from the token payload
    } else {
      return res.status(403).json({ message: 'Invalid token payload' })
    }

    next() // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
