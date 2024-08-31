import express, { Request, Response, NextFunction } from 'express'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
import dbConfig from './config/db'
import { PrismaClient } from '@prisma/client'

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Initialize the Prisma client
let prisma: PrismaClient

// Middleware to attach Prisma client to the request object
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!prisma) {
    prisma = await dbConfig()
  }
  ;(req as any).prisma = prisma // Type assertion here
  next()
})

// Route handlers
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)

// Default route for health check or root access
app.get('/', (req, res) => {
  res.status(200).send('Simplify API is running')
})

export default app
