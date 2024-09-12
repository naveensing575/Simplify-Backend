import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TaskService {
  // Fetch all tasks for a given user or team, including assignee's name
  async getAllTasks(userId: string, teamId?: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          OR: [
            { userId }, // Personal tasks
            { teamId }, // Team-based tasks
          ],
        },
        include: {
          assignees: {
            select: {
              id: true,
              name: true, // Include assignee names
            },
          },
        },
      })
      return tasks
    } catch (error: any) {
      console.error('Service: Error retrieving tasks:', error.message)
      throw new Error('Error retrieving tasks')
    }
  }

  // Create a new task for a given user or team, assigning to multiple users if provided
  async createTask(
    userId: string,
    data: {
      title: string
      description?: string
      status: string
      priority: string
      dueDate?: Date
      assigneeIds?: string[] // Multiple assignees
      teamId?: string // Optional team ID for team tasks
    },
  ) {
    try {
      const taskData: any = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        userId, // Assign the task to the creator
        teamId: data.teamId ?? undefined, // Add teamId if provided
      }

      if (data.assigneeIds?.length) {
        taskData.assignees = {
          connect: data.assigneeIds.map((id) => ({ id })),
        }
      }

      const task = await prisma.task.create({
        data: taskData,
      })
      return task
    } catch (error: any) {
      console.error('Service: Error creating task:', error.message)
      throw new Error('Error creating task')
    }
  }

  // Update an existing task for a given user or team
  async updateTask(
    taskId: string,
    userId: string,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      dueDate?: Date
      assigneeIds?: string[]
      teamId?: string
    },
  ) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          OR: [{ userId }, { teamId: data.teamId }], // Check for user or team ownership
        },
      })

      if (!task) {
        throw new Error('Task not found or you do not have access to this task')
      }

      const updateData: any = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      }

      if (data.assigneeIds?.length) {
        updateData.assignees = {
          set: data.assigneeIds.map((id) => ({ id })), // Reset and reassign assignees
        }
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
      })

      return updatedTask
    } catch (error: any) {
      console.error('Service: Error updating task:', error.message)
      throw new Error('Error updating task')
    }
  }

  // Delete an existing task for a given user or team
  async deleteTask(taskId: string, userId: string, teamId?: string) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          OR: [{ userId }, { teamId }], // Ensure user or team has ownership
        },
      })

      if (!task) {
        throw new Error('Task not found or you do not have access to this task')
      }

      await prisma.task.delete({
        where: { id: taskId },
      })
    } catch (error: any) {
      console.error('Service: Error deleting task:', error.message)
      throw new Error('Error deleting task')
    }
  }
}
