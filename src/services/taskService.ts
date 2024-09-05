import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class TaskService {
  async getAllTasks(userId: number) {
    try {
      console.log('Service: Fetching tasks for userId:', userId)
      const tasks = await prisma.task.findMany({
        where: { userId },
      })
      console.log('Service: Tasks fetched for userId:', userId)
      return tasks
    } catch (error: any) {
      console.error('Service: Error retrieving tasks:', error.message)
      throw new Error('Error retrieving tasks')
    }
  }

  async createTask(
    userId: number,
    data: {
      title: string
      description?: string
      status: string
      priority: string
      dueDate?: Date
    },
  ) {
    try {
      console.log(
        'Service: Creating task for userId:',
        userId,
        'with data:',
        data,
      )
      const task = await prisma.task.create({
        data: {
          ...data,
          userId,
        },
      })
      console.log('Service: Task created for userId:', userId)
      return task
    } catch (error: any) {
      console.error('Service: Error creating task:', error.message)
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
      console.log('Service: Updating taskId:', taskId, 'for userId:', userId)
      const task = await prisma.task.update({
        where: { id: taskId, userId },
        data,
      })
      console.log('Service: Task updated for userId:', userId)
      return task
    } catch (error: any) {
      console.error('Service: Error updating task:', error.message)
      throw new Error('Error updating task')
    }
  }

  async deleteTask(taskId: number, userId: number) {
    try {
      console.log('Service: Deleting taskId:', taskId, 'for userId:', userId)
      await prisma.task.delete({
        where: { id: taskId, userId },
      })
      console.log('Service: Task deleted for userId:', userId)
    } catch (error: any) {
      console.error('Service: Error deleting task:', error.message)
      throw new Error('Error deleting task')
    }
  }
}
