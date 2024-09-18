import { Router } from 'express'
import * as projectController from '../controllers/projectController'

const router = Router()

// Create a new project
router.post('/', projectController.createProject)

// Get a single project by ID
router.get('/:projectId', projectController.getProjectById)

// Get all projects
router.get('', projectController.getAllProjects)

// Update a project by ID
router.put('/:projectId', projectController.updateProject)

// Delete a project by ID
router.delete('/:projectId', projectController.deleteProject)

export default router
