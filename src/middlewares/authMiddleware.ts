import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { IGetUserAuthInfoRequest } from '../types/index'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.AUTH0_CLIENT_SECRET as string,
    )

    // Type assertion to cast req as IGetUserAuthInfoRequest
    ;(req as IGetUserAuthInfoRequest).user = {
      sub: (decodedToken as any).sub,
      // Add other properties if needed
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
