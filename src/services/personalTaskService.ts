import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client'

const prisma = new PrismaClient()

export class PersonalTaskService {
  // Fetch all tasks for a given user (personal tasks only)
  async getAllTasks(userId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId, // Only personal tasks
        },
      })

      // Fetch the user's name once and use it as the assignee for all tasks
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }, // Fetch the user's name
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Convert the task objects to include the user's name as assignee
      const tasksWithAssigneeName = tasks.map((task) => ({
        ...task,
        assignee: user.name, // Use the fetched user's name as the assignee
      }))

      return tasksWithAssigneeName
    } catch (error: any) {
      console.error('Service: Error retrieving personal tasks:', error.message)
      throw new Error('Error retrieving personal tasks')
    }
  }

  // Create a new personal task for a given user
  async createTask(
    userId: string,
    data: {
      title: string
      description?: string
      status: TaskStatus
      priority: TaskPriority
      dueDate?: Date
    },
  ) {
    try {
      // Fetch the user's name to use as the assignee
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const task = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
          userId,
        },
      })

      // Return the task with the assignee name
      return {
        ...task,
        assignee: user.name, // Include the assignee's name in the return
      }
    } catch (error: any) {
      console.error('Service: Error creating personal task:', error.message)
      throw new Error('Error creating personal task')
    }
  }

  // Update an existing personal task for a given user
  async updateTask(
    taskId: string,
    userId: string,
    data: {
      title?: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: Date
    },
  ) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId, // Ensure the task belongs to the user
        },
      })

      if (!task) {
        throw new Error('Task not found or you do not have access to this task')
      }

      // Update the task
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
        },
      })

      // Fetch the user's name to return as assignee
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      return {
        ...updatedTask,
        assignee: user?.name || 'Unknown', // Return the assignee's name
      }
    } catch (error: any) {
      console.error('Service: Error updating personal task:', error.message)
      throw new Error('Error updating personal task')
    }
  }

  // Delete an existing personal task for a given user
  async deleteTask(taskId: string, userId: string) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId, // Ensure the task belongs to the user
        },
      })

      if (!task) {
        throw new Error('Task not found or you do not have access to this task')
      }

      await prisma.task.delete({
        where: { id: taskId },
      })
      return { message: 'Task deleted successfully' }
    } catch (error: any) {
      console.error('Service: Error deleting personal task:', error.message)
      throw new Error('Error deleting personal task')
    }
  }
}
