import { Router, Request, Response } from 'express'
import { TaskController } from '../controllers/taskController'
import authMiddleware from '../middlewares/authMiddleware'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskController = new TaskController()
const router = Router()

// Get all tasks for a user or team
router.get('/', authMiddleware, (req: Request, res: Response) => {
  return taskController.getAllTasks(req as IGetUserAuthInfoRequest, res)
})

// Create a new task for a user or team
router.post('/', authMiddleware, (req: Request, res: Response) => {
  return taskController.createTask(req as IGetUserAuthInfoRequest, res)
})

// Update an existing task for a user or team
router.put('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return taskController.updateTask(req as IGetUserAuthInfoRequest, res)
})

// Delete an existing task for a user or team
router.delete('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return taskController.deleteTask(req as IGetUserAuthInfoRequest, res)
})

export default router
