import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TeamService {
  // Create a new team
  async createTeam(data: { name: string; description?: string }) {
    try {
      const team = await prisma.team.create({
        data: {
          name: data.name,
          description: data.description,
        },
      })
      return team
    } catch (error) {
      console.error('Error creating team:', error)
      throw new Error('Error creating team')
    }
  }

  // Fetch all teams
  async getAllTeams() {
    try {
      const teams = await prisma.team.findMany({
        include: {
          members: {
            select: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
      })
      return teams
    } catch (error) {
      console.error('Error fetching teams:', error)
      throw new Error('Error fetching teams')
    }
  }

  // Fetch details of a specific team by teamId
  async getTeamDetails(teamId: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            select: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
          tasks: true, // Optionally include tasks related to the team
        },
      })

      if (!team) {
        throw new Error('Team not found')
      }

      return team
    } catch (error) {
      console.error('Error fetching team details:', error)
      throw new Error('Error fetching team details')
    }
  }

  // Fetch members of a specific team
  async getTeamMembers(teamId: string) {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId },
        include: {
          user: {
            select: { id: true, name: true, role: true },
          },
        },
      })
      return members
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw new Error('Error fetching team members')
    }
  }
}
