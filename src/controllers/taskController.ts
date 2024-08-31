import { Response } from 'express'
import { TaskService } from '../services/taskService'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskService = new TaskService()

export class TaskController {
  async getAllTasks(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = parseInt(req.user.sub) // Assuming `sub` is the user's ID
      const tasks = await taskService.getAllTasks(userId)
      res.status(200).json(tasks)
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving tasks' })
    }
  }

  async createTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = parseInt(req.user.sub)
      const newTask = await taskService.createTask(userId, req.body)
      res.status(201).json(newTask)
    } catch (error) {
      res.status(500).json({ message: 'Error creating task' })
    }
  }

  async updateTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = parseInt(req.user.sub)
      const taskId = parseInt(req.params.taskId)
      const updatedTask = await taskService.updateTask(taskId, userId, req.body)
      res.status(200).json(updatedTask)
    } catch (error) {
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  async deleteTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = parseInt(req.user.sub)
      const taskId = parseInt(req.params.taskId)
      await taskService.deleteTask(taskId, userId)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}
