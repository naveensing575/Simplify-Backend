import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client'

const prisma = new PrismaClient()

export class TeamTaskService {
  // Fetch team tasks along with their assignees
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
  async createTeamTask(
    teamId: string,
    taskData: {
      title: string
      description?: string
      status: TaskStatus // Use the TaskStatus enum
      priority: TaskPriority // Use the TaskPriority enum
      dueDate?: Date
      assigneeIds?: string[]
      userId: string // Ensure the task creator is included
    },
  ) {
    try {
      const task = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          teamId,
          userId: taskData.userId, // Include userId as the task creator
          assignees: {
            connect: taskData.assigneeIds?.map((id) => ({ id })),
          },
        },
      })
      return task
    } catch (error: any) {
      console.error('Service: Error creating team task:', error.message)
      throw new Error('Error creating team task')
    }
  }

  // Update a task for a specific team
  async updateTeamTask(
    teamId: string,
    taskId: string,
    taskData: {
      title?: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: Date
      assigneeIds?: string[]
    },
  ) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          teamId, // Ensure task belongs to the team
        },
      })

      if (!task) {
        throw new Error('Task not found or does not belong to this team')
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          assignees: {
            set: taskData.assigneeIds?.map((id) => ({ id })), // Reset and assign new assignees
          },
        },
      })

      return updatedTask
    } catch (error: any) {
      console.error('Service: Error updating team task:', error.message)
      throw new Error('Error updating team task')
    }
  }

  // Delete a task for a specific team
  async deleteTeamTask(teamId: string, taskId: string) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          teamId, // Ensure task belongs to the team
        },
      })

      if (!task) {
        throw new Error('Task not found or does not belong to this team')
      }

      const deletedTask = await prisma.task.delete({
        where: { id: taskId },
      })
      return deletedTask
    } catch (error: any) {
      console.error('Service: Error deleting team task:', error.message)
      throw new Error('Error deleting team task')
    }
  }
}
