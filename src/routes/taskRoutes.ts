import { Router, Request, Response } from 'express'
import { TaskController } from '../controllers/taskController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskController = new TaskController()
const router = Router()

router.get('/', authMiddleware, (req: Request, res: Response) => {
  return taskController.getAllTasks(req as IGetUserAuthInfoRequest, res)
})

router.post('/', authMiddleware, (req: Request, res: Response) => {
  return taskController.createTask(req as IGetUserAuthInfoRequest, res)
})

router.put('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return taskController.updateTask(req as IGetUserAuthInfoRequest, res)
})

router.delete('/:taskId', authMiddleware, (req: Request, res: Response) => {
  return taskController.deleteTask(req as IGetUserAuthInfoRequest, res)
})

export default router
