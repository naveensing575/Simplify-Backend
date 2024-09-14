import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TeamTaskService {
  // Fetch team details along with tasks
  async getTeamTasks(teamId: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          tasks: {
            include: {
              assignees: { select: { id: true, name: true } }, // Include assignee names
            },
          },
          members: true, // Include team members if needed
        },
      })

      if (!team) {
        throw new Error('Team not found')
      }

      return team.tasks
    } catch (error: any) {
      console.error('Service: Error fetching team tasks:', error.message)
      throw new Error('Error fetching team tasks')
    }
  }

  // Create a task for a specific team
  async createTeamTask(teamId: string, taskData: any) {
    try {
      const task = await prisma.task.create({
        data: {
          ...taskData,
          teamId,
        },
      })
      return task
    } catch (error: any) {
      console.error('Service: Error creating team task:', error.message)
      throw new Error('Error creating team task')
    }
  }

  // Update a task for a specific team
  async updateTeamTask(teamId: string, taskId: string, taskData: any) {
    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...taskData,
          teamId, // Ensure task is still related to the team
        },
      })

      return task
    } catch (error: any) {
      console.error('Service: Error updating team task:', error.message)
      throw new Error('Error updating team task')
    }
  }

  // Delete a task for a specific team
  async deleteTeamTask(teamId: string, taskId: string) {
    try {
      const task = await prisma.task.delete({
        where: { id: taskId },
      })
      return task
    } catch (error: any) {
      console.error('Service: Error deleting team task:', error.message)
      throw new Error('Error deleting team task')
    }
  }
}
