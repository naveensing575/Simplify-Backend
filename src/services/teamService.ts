import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateTeamData {
  name: string
  description?: string
  members: string[]
  projectId?: string
}

interface UpdateTeamData {
  name?: string
  description?: string
  members?: string[]
  projectId?: string
}

export class TeamService {
  async createTeam(data: CreateTeamData) {
    try {
      const team = await prisma.team.create({
        data: {
          name: data.name,
          description: data.description,
          projects: data.projectId
            ? { connect: { id: data.projectId } }
            : undefined,
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

  async getAllTeams() {
    try {
      const teams = await prisma.team.findMany({
        include: {
          projects: { select: { id: true, title: true } },
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

  async getTeamDetails(teamId: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          projects: { select: { id: true, title: true } },
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

  async updateTeam(teamId: string, data: UpdateTeamData) {
    try {
      const updateData: any = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.projectId && {
          projects: { connect: { id: data.projectId } },
        }),
      }

      if (data.members?.length) {
        updateData.members = {
          deleteMany: {},
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

  async deleteTeam(teamId: string) {
    try {
      await prisma.teamMember.deleteMany({
        where: { teamId },
      })

      const deletedTeam = await prisma.team.delete({
        where: { id: teamId },
      })

      return deletedTeam
    } catch (error) {
      console.error('Error deleting team:', error)
      throw new Error('Error deleting team')
    }
  }

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
