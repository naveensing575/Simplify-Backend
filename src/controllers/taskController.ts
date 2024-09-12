import { Response } from 'express'
import { TaskService } from '../services/taskService'
import { IGetUserAuthInfoRequest } from '../types/index'

const taskService = new TaskService()

export class TaskController {
  // Get all tasks for the authenticated user or team
  async getAllTasks(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const teamId = req.query.teamId as string | undefined

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const tasks = await taskService.getAllTasks(userId, teamId)
      res.status(200).json(tasks)
    } catch (error: any) {
      console.error('Error retrieving tasks:', error.message)
      res.status(500).json({ message: 'Error retrieving tasks' })
    }
  }

  // Create a new task for the authenticated user or team
  async createTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const {
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeIds,
        teamId,
      } = req.body

      if (!title || !status || !priority) {
        return res.status(400).json({ message: 'Required fields are missing' })
      }

      const newTask = await taskService.createTask(userId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeIds,
        teamId, // Optional for team-based tasks
      })

      res.status(201).json(newTask)
    } catch (error: any) {
      console.error('Error creating task:', error.message)
      res.status(500).json({ message: 'Error creating task' })
    }
  }

  // Update an existing task for the authenticated user or team
  async updateTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = req.params.taskId
      const {
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeIds,
        teamId,
      } = req.body

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      const updatedTask = await taskService.updateTask(taskId, userId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeIds,
        teamId,
      })

      res.status(200).json(updatedTask)
    } catch (error: any) {
      console.error('Error updating task:', error.message)
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  // Delete an existing task for the authenticated user or team
  async deleteTask(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const userId = req.user?.userId
      const taskId = req.params.taskId
      const teamId = req.body.teamId

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' })
      }

      await taskService.deleteTask(taskId, userId, teamId)
      res.status(204).send()
    } catch (error: any) {
      console.error('Error deleting task:', error.message)
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}
