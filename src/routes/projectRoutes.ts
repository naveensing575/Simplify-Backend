import { Router } from 'express'
import * as projectController from '../controllers/projectController'
import authMiddleware from '../middlewares/authMiddleware'

const router = Router()

// Create a new project
router.post('/', authMiddleware, projectController.createProject)

// Get a single project by ID
router.get('/:projectId', authMiddleware, projectController.getProjectById)

// Get all projects
router.get('', authMiddleware, projectController.getAllProjects)

// Update a project by ID
router.put('/:projectId', authMiddleware, projectController.updateProject)

// Delete a project by ID
router.delete('/:projectId', authMiddleware, projectController.deleteProject)

export default router
