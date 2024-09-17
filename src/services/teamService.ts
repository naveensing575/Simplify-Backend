import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateTeamData {
  name: string
  description?: string
  members: string[] // List of user IDs
}

interface UpdateTeamData {
  name?: string
  description?: string
  members?: string[] // Updated list of user IDs (optional)
}

export class TeamService {
  // Create a new team
  async createTeam(data: CreateTeamData) {
    try {
      const team = await prisma.team.create({
        data: {
          name: data.name,
          description: data.description,
          members: {
            create: data.members.map((userId) => ({
              user: { connect: { id: userId } },
            })),
          },
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

  // Update a team
  async updateTeam(teamId: string, data: UpdateTeamData) {
    try {
      const updateData: any = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
      }

      if (data.members?.length) {
        updateData.members = {
          deleteMany: {}, // Remove existing members
          create: data.members.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        }
      }

      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: updateData,
      })

      return updatedTeam
    } catch (error) {
      console.error('Error updating team:', error)
      throw new Error('Error updating team')
    }
  }

  // Delete a team
  async deleteTeam(teamId: string) {
    try {
      // Delete members first (because of foreign key constraints)
      await prisma.teamMember.deleteMany({
        where: { teamId },
      })

      // Then delete the team
      const deletedTeam = await prisma.team.delete({
        where: { id: teamId },
      })

      return deletedTeam
    } catch (error) {
      console.error('Error deleting team:', error)
      throw new Error('Error deleting team')
    }
  }

  // Fetch members of a specific team
  async getTeamMembers(teamId: string) {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId },
        include: {
          user: {
            select: { id: true, name: true, role: true }, // Include roles
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
