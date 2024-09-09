import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TaskService {
  [x: string]: any
  // Fetch all tasks for a given user (UUID), including the assignee's name
  async getAllTasks(userId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        include: {
          assignee: {
            select: {
              id: true,
              name: true, // Include the assignee's name and id in the response
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

  // Create a new task for a given user (UUID), assigning directly to a user if an assignee is provided
  async createTask(
    userId: string,
    data: {
      title: string
      description?: string
      status: string
      priority: string
      dueDate?: Date
      assigneeId?: string // This should reference the `User` table's `id`
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
      }

      // If assigneeId is provided, connect the task to the user
      if (data.assigneeId) {
        taskData.assignee = { connect: { id: data.assigneeId } }
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

  // Update an existing task for a given user (UUID)
  async updateTask(
    taskId: string, // UUID for task
    userId: string, // UUID for ownership check
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      dueDate?: Date
      assigneeId?: string // Reference the assignee's user ID directly
    },
  ) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId, // Ensure the task belongs to this user
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

      // If assigneeId is provided, connect the task to the new assignee
      if (data.assigneeId) {
        updateData.assignee = { connect: { id: data.assigneeId } }
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
}
