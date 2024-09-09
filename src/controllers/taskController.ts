import { Response } from 'express'
import { TaskService } from '../services/taskService'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskService = new TaskService()

export class TaskController {
  // Get all tasks for the authenticated user
  async getAllTasks(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId // Get userId from middleware (UUID)

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

  // Create a new task for the authenticated user
  async createTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId // Get userId from middleware (UUID)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const { title, description, status, priority, dueDate, assigneeId } =
        req.body

      // Validate required fields
      if (!title || !status || !priority) {
        return res.status(400).json({ message: 'Required fields are missing' })
      }

      // Create the task using the service
      const newTask = await taskService.createTask(userId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined, // Convert dueDate to Date object
        assigneeId, // Assignee can be optional
      })

      res.status(201).json(newTask)
    } catch (error: any) {
      console.error('Error creating task:', error.message)
      res.status(500).json({ message: 'Error creating task' })
    }
  }

  // Update an existing task for the authenticated user
  async updateTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId // Get userId from middleware (UUID)
      const taskId = req.params.taskId // Get the taskId from route parameters (UUID)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const { title, description, status, priority, dueDate, assigneeId } =
        req.body

      // Update the task using the service
      const updatedTask = await taskService.updateTask(taskId, userId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined, // Convert dueDate to Date object
        assigneeId, // Assignee can be optional
      })

      res.status(200).json(updatedTask)
    } catch (error: any) {
      console.error('Error updating task:', error.message)
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  // Delete an existing task for the authenticated user
  async deleteTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId // Get userId from middleware (UUID)
      const taskId = req.params.taskId // Get the taskId from route parameters (UUID)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      // Delete the task using the service
      await taskService.deleteTask(taskId, userId)
      res.status(204).send() // No content to send after successful delete
    } catch (error: any) {
      console.error('Error deleting task:', error.message)
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}
