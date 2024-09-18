import { Request, Response } from 'express'
import * as projectService from '../services/projectService'

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, ownerId, teamId } = req.body
    const newProject = await projectService.createProject({
      title,
      description,
      ownerId,
      teamId,
    })
    res.status(201).json(newProject)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const project = await projectService.getProjectById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(project)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects()
    res.status(200).json(projects)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const data = req.body
    const updatedProject = await projectService.updateProject(projectId, data)
    res.status(200).json(updatedProject)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    await projectService.deleteProject(projectId)
    res.status(204).json()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
