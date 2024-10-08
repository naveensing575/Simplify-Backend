import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client'

const prisma = new PrismaClient()

export class PersonalTaskService {
  // Utility function to map Prisma enum statuses back to frontend string statuses
  private mapPrismaStatusToFrontend(status: TaskStatus): string {
    const statusMap: { [key in TaskStatus]: string } = {
      [TaskStatus.TODO]: 'todo',
      [TaskStatus.IN_PROGRESS]: 'in-progress',
      [TaskStatus.REVIEW]: 'review',
      [TaskStatus.DONE]: 'done',
    }
    return statusMap[status] || 'todo'
  }

  // Utility function to map Prisma enum priorities back to frontend string priorities
  private mapPrismaPriorityToFrontend(priority: TaskPriority): string {
    const priorityMap: { [key in TaskPriority]: string } = {
      [TaskPriority.LOW]: 'low',
      [TaskPriority.MEDIUM]: 'medium',
      [TaskPriority.HIGH]: 'high',
    }
    return priorityMap[priority] || 'low'
  }

  // Fetch all tasks for a given user (personal tasks only)
  async getAllTasks(userId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId, // Only personal tasks
        },
      })

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Convert the task objects to include the user's name as assignee
      // and map status and priority back to frontend format
      const tasksWithAssigneeName = tasks.map((task) => ({
        ...task,
        status: this.mapPrismaStatusToFrontend(task.status), // Map status back to frontend format
        priority: this.mapPrismaPriorityToFrontend(task.priority), // Map priority back to frontend format
        assignee: user.name,
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

      // Return the task with the assignee name and map status and priority
      return {
        ...task,
        status: this.mapPrismaStatusToFrontend(task.status), // Map status back to frontend format
        priority: this.mapPrismaPriorityToFrontend(task.priority), // Map priority back to frontend format
        assignee: user.name,
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

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      return {
        ...updatedTask,
        status: this.mapPrismaStatusToFrontend(updatedTask.status), // Map status back to frontend format
        priority: this.mapPrismaPriorityToFrontend(updatedTask.priority), // Map priority back to frontend format
        assignee: user?.name || 'Unknown',
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
