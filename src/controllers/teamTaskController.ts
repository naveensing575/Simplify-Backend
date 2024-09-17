import { Response } from 'express'
import { TeamTaskService } from '../services/teamTaskService'
import { IGetUserAuthInfoRequest } from '../middlewares/authMiddleware' // Import your custom request type

const teamTaskService = new TeamTaskService()

export class TeamTaskController {
  // Controller for fetching team tasks
  async getTeamTasks(req: IGetUserAuthInfoRequest, res: Response) {
    const { teamId } = req.params

    try {
      const tasks = await teamTaskService.getTeamTasks(teamId)
      res.status(200).json(tasks)
    } catch (error) {
      console.error('Controller: Error fetching team tasks:', error)
      res.status(500).json({ message: 'Error fetching team tasks' })
    }
  }

  // Controller for creating a new team task
  async createTeamTask(req: IGetUserAuthInfoRequest, res: Response) {
    const { teamId } = req.params
    const { title, description, status, priority, dueDate, assigneeIds } =
      req.body

    if (!title || !status || !priority) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      const task = await teamTaskService.createTeamTask(teamId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeIds,
        userId: req.user?.userId!, // Add userId from the request object
      })
      res.status(201).json(task)
    } catch (error) {
      console.error('Controller: Error creating team task:', error)
      res.status(500).json({ message: 'Error creating team task' })
    }
  }

  // Controller for updating a team task
  async updateTeamTask(req: IGetUserAuthInfoRequest, res: Response) {
    const { teamId, taskId } = req.params
    const { title, description, status, priority, dueDate, assigneeIds } =
      req.body

    try {
      const task = await teamTaskService.updateTeamTask(teamId, taskId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeIds,
      })
      res.status(200).json(task)
    } catch (error) {
      console.error('Controller: Error updating team task:', error)
      res.status(500).json({ message: 'Error updating team task' })
    }
  }

  // Controller for deleting a team task
  async deleteTeamTask(req: IGetUserAuthInfoRequest, res: Response) {
    const { teamId, taskId } = req.params

    try {
      const task = await teamTaskService.deleteTeamTask(teamId, taskId)
      res.status(200).json(task)
    } catch (error) {
      console.error('Controller: Error deleting team task:', error)
      res.status(500).json({ message: 'Error deleting team task' })
    }
  }
}
