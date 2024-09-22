import { Response } from 'express'
import { TeamService } from '../services/teamService'
import { IGetUserAuthInfoRequest } from '../types'

const teamService = new TeamService()

export class TeamController {
  // Create a new team
  async createTeam(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { name, description, members, projectId } = req.body

      if (!name) {
        return res.status(400).json({ message: 'Team name is required' })
      }

      if (!Array.isArray(members) || members.length === 0) {
        return res
          .status(400)
          .json({ message: 'At least one member is required' })
      }

      const newTeam = await teamService.createTeam({
        name,
        description,
        members,
        projectId, // Pass projectId to service
      })
      return res.status(201).json(newTeam)
    } catch (error) {
      console.error('Error creating team:', error)
      return res.status(500).json({ message: 'Error creating team' })
    }
  }

  // Get all teams
  async getAllTeams(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const teams = await teamService.getAllTeams()
      return res.status(200).json(teams)
    } catch (error) {
      console.error('Error fetching teams:', error)
      return res.status(500).json({ message: 'Error fetching teams' })
    }
  }

  // Get details of a specific team
  async getTeamDetails(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { teamId } = req.params
      const team = await teamService.getTeamDetails(teamId)

      return res.status(200).json(team)
    } catch (error) {
      console.error('Error fetching team details:', error)
      return res.status(500).json({ message: 'Error fetching team details' })
    }
  }

  // Update a team
  async updateTeam(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { teamId } = req.params
      const { name, description, members, projectId } = req.body

      if (!name && !description && !members && !projectId) {
        return res
          .status(400)
          .json({ message: 'At least one field must be updated' })
      }

      const updatedTeam = await teamService.updateTeam(teamId, {
        name,
        description,
        members,
        projectId, // Pass projectId to service
      })
      return res.status(200).json(updatedTeam)
    } catch (error) {
      console.error('Error updating team:', error)
      return res.status(500).json({ message: 'Error updating team' })
    }
  }

  // Delete a team
  async deleteTeam(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { teamId } = req.params

      const deletedTeam = await teamService.deleteTeam(teamId)
      return res
        .status(200)
        .json({ message: 'Team deleted successfully', deletedTeam })
    } catch (error) {
      console.error('Error deleting team:', error)
      return res.status(500).json({ message: 'Error deleting team' })
    }
  }

  // Get members of a specific team
  async getTeamMembers(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { teamId } = req.params
      const members = await teamService.getTeamMembers(teamId)

      return res.status(200).json(members)
    } catch (error) {
      console.error('Error fetching team members:', error)
      return res.status(500).json({ message: 'Error fetching team members' })
    }
  }
}
