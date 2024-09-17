import { Request } from 'express'
import { PrismaClient, UserRole } from '@prisma/client'

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    userId: string
    sub: string
    email?: string
    name?: string
    role?: UserRole
  }
  prisma?: PrismaClient
}
