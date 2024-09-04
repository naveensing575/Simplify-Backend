import { Response } from 'express'
import { TaskService } from '../services/taskService'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskService = new TaskService()

export class TaskController {
  async getAllTasks(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      console.log('Fetching tasks for userId:', userId)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const tasks = await taskService.getAllTasks(userId)
      res.status(200).json(tasks)
    } catch (error: any) {
      console.error('Error retrieving tasks:', error.message)
      res.status(500).json({ message: 'Error retrieving tasks' })
    }
  }

  async createTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      console.log('Creating task for userId:', userId, 'with data:', req.body)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const newTask = await taskService.createTask(userId, req.body)
      res.status(201).json(newTask)
    } catch (error: any) {
      console.error('Error creating task:', error.message)
      res.status(500).json({ message: 'Error creating task' })
    }
  }

  async updateTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = parseInt(req.params.taskId)
      console.log('Updating taskId:', taskId, 'for userId:', userId)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const updatedTask = await taskService.updateTask(taskId, userId, req.body)
      res.status(200).json(updatedTask)
    } catch (error: any) {
      console.error('Error updating task:', error.message)
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  async deleteTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = parseInt(req.params.taskId)
      console.log('Deleting taskId:', taskId, 'for userId:', userId)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      await taskService.deleteTask(taskId, userId)
      res.status(204).send()
    } catch (error: any) {
      console.error('Error deleting task:', error.message)
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}
