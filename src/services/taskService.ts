import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TaskService {
  async getAllTasks(userId: number) {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
      })
      return tasks
    } catch (error) {
      throw new Error('Error retrieving tasks')
    }
  }

  async createTask(
    userId: number,
    data: {
      title: string
      description?: string
      status?: string
      priority?: string
      dueDate?: Date
    },
  ) {
    try {
      const task = await prisma.task.create({
        data: {
          ...data,
          userId,
        },
      })
      return task
    } catch (error) {
      throw new Error('Error creating task')
    }
  }

  async updateTask(
    taskId: number,
    userId: number,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      dueDate?: Date
    },
  ) {
    try {
      const task = await prisma.task.update({
        where: { id: taskId, userId },
        data,
      })
      return task
    } catch (error) {
      throw new Error('Error updating task')
    }
  }

  async deleteTask(taskId: number, userId: number) {
    try {
      await prisma.task.delete({
        where: { id: taskId, userId },
      })
    } catch (error) {
      throw new Error('Error deleting task')
    }
  }
}
