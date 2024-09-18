import { PrismaClient, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

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
      Task: true,
    },
  })
}

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
      Task: true,
    },
  })
}

// Fix type mismatch when updating the project status
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

// Delete the project
export const deleteProject = async (projectId: string) => {
  return prisma.project.delete({
    where: { id: projectId },
  })
}
