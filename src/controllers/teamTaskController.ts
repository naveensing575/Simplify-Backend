import { Request, Response } from 'express'
import { TeamTaskService } from '../services/teamTaskService'

const teamTaskService = new TeamTaskService()

export class TeamController {
  // Controller for fetching team tasks
  async getTeamTasks(req: Request, res: Response) {
    const { teamId } = req.params

    try {
      const tasks = await teamTaskService.getTeamTasks(teamId)
      res.status(200).json(tasks)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team tasks' })
    }
  }

  // Controller for creating a new team task
  async createTeamTask(req: Request, res: Response) {
    const { teamId } = req.params
    const taskData = req.body

    try {
      const task = await teamTaskService.createTeamTask(teamId, taskData)
      res.status(201).json(task)
    } catch (error) {
      res.status(500).json({ message: 'Error creating team task' })
    }
  }

  // Controller for updating a team task
  async updateTeamTask(req: Request, res: Response) {
    const { teamId, taskId } = req.params
    const taskData = req.body

    try {
      const task = await teamTaskService.updateTeamTask(
        teamId,
        taskId,
        taskData,
      )
      res.status(200).json(task)
    } catch (error) {
      res.status(500).json({ message: 'Error updating team task' })
    }
  }

  // Controller for deleting a team task
  async deleteTeamTask(req: Request, res: Response) {
    const { teamId, taskId } = req.params

    try {
      const task = await teamTaskService.deleteTeamTask(teamId, taskId)
      res.status(200).json(task)
    } catch (error) {
      res.status(500).json({ message: 'Error deleting team task' })
    }
  }
}
