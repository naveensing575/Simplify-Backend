import { PrismaClient, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new project
export const createProject = async (data: {
  title: string
  description?: string
  ownerId: string
  teamId?: string
}) => {
  return prisma.project.create({
    data,
  })
}

// Fetch a project by ID, including its owner, team, taskBoards, and tasks
export const getProjectById = async (projectId: string) => {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true,
      team: {
        include: {
          members: true,
        },
      },
      taskBoards: true,
      tasks: true, // Use 'tasks' instead of 'Task'
    },
  })
}

// Fetch all projects, including their owner, team, taskBoards, and tasks
export const getAllProjects = async () => {
  return prisma.project.findMany({
    include: {
      owner: true,
      team: {
        include: {
          members: true,
        },
      },
      taskBoards: true,
      tasks: true, // Use 'tasks' instead of 'Task'
    },
  })
}

// Update a project by ID, allowing updates to the title, description, and status
export const updateProject = async (
  projectId: string,
  data: Partial<{
    title: string
    description?: string
    status?: ProjectStatus
  }>,
) => {
  return prisma.project.update({
    where: { id: projectId },
    data,
  })
}

// Delete a project by ID
export const deleteProject = async (projectId: string) => {
  return prisma.project.delete({
    where: { id: projectId },
  })
}
