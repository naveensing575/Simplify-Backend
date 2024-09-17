import { Response } from 'express'
import { PersonalTaskService } from '../services/personalTaskService'
import { IGetUserAuthInfoRequest } from '../types/index'
import { TaskStatus, TaskPriority } from '@prisma/client'

const personalTaskService = new PersonalTaskService()

export class PersonalTaskController {
  // Utility function to map lowercase statuses from frontend to Prisma's enum
  private mapStatus(status: string): TaskStatus {
    const statusMap: { [key: string]: TaskStatus } = {
      todo: TaskStatus.TODO,
      'in-progress': TaskStatus.IN_PROGRESS,
      review: TaskStatus.REVIEW,
      done: TaskStatus.DONE,
    }
    return statusMap[status] || TaskStatus.TODO // Default to 'TODO' if not found
  }

  // Utility function to map lowercase priorities from frontend to Prisma's enum
  private mapPriority(priority: string): TaskPriority {
    const priorityMap: { [key: string]: TaskPriority } = {
      low: TaskPriority.LOW,
      medium: TaskPriority.MEDIUM,
      high: TaskPriority.HIGH,
    }
    return priorityMap[priority] || TaskPriority.LOW // Default to 'LOW' if not found
  }

  // Get all personal tasks for the authenticated user
  async getAllTasks(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const tasks = await personalTaskService.getAllTasks(userId)
      res.status(200).json(tasks)
    } catch (error: any) {
      console.error('Error retrieving personal tasks:', error.message)
      res.status(500).json({ message: 'Error retrieving tasks' })
    }
  }

  // Create a new personal task for the authenticated user
  async createTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const { title, description, status, priority, dueDate } = req.body

      if (!title || !status || !priority) {
        return res.status(400).json({ message: 'Required fields are missing' })
      }

      const mappedStatus = this.mapStatus(status)
      const mappedPriority = this.mapPriority(priority)

      const newTask = await personalTaskService.createTask(userId, {
        title,
        description,
        status: mappedStatus,
        priority: mappedPriority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      })

      res.status(201).json(newTask)
    } catch (error: any) {
      console.error('Error creating personal task:', error.message)
      res.status(500).json({ message: 'Error creating task' })
    }
  }

  // Update an existing personal task for the authenticated user
  async updateTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = req.params.taskId
      const { title, description, status, priority, dueDate } = req.body

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const mappedStatus = status ? this.mapStatus(status) : undefined
      const mappedPriority = priority ? this.mapPriority(priority) : undefined

      const updatedTask = await personalTaskService.updateTask(taskId, userId, {
        title,
        description,
        status: mappedStatus,
        priority: mappedPriority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      })

      res.status(200).json(updatedTask)
    } catch (error: any) {
      console.error('Error updating personal task:', error.message)
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  // Delete an existing personal task for the authenticated user
  async deleteTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = req.params.taskId

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      await personalTaskService.deleteTask(taskId, userId)
      res.status(204).send()
    } catch (error: any) {
      console.error('Error deleting personal task:', error.message)
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}
