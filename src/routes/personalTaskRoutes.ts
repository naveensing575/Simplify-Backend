import { Router, Request, Response } from 'express'
import { PersonalTaskController } from '../controllers/personalTaskController'
import authMiddleware from '../middlewares/authMiddleware'
import { IGetUserAuthInfoRequest } from '../types/index'

const personalTaskController = new PersonalTaskController()
const router = Router()

// Get all personal tasks for the authenticated user
router.get('/', authMiddleware, (req: Request, res: Response) => {
  return personalTaskController.getAllTasks(req as IGetUserAuthInfoRequest, res)
})

// Create a new personal task for the authenticated user
router.post('/', authMiddleware, (req: Request, res: Response) => {
  return personalTaskController.createTask(req as IGetUserAuthInfoRequest, res)
})

// Update an existing personal task for the authenticated user
router.put('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return personalTaskController.updateTask(req as IGetUserAuthInfoRequest, res)
})

// Delete an existing personal task for the authenticated user
router.delete('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return personalTaskController.deleteTask(req as IGetUserAuthInfoRequest, res)
})

export default router
