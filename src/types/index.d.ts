import { Request } from 'express'
import { User } from '@prisma/client'

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    sub: string
    email?: string
    name?: string
  }
  prisma?: PrismaClient
}
