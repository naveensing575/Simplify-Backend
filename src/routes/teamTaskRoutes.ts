import express from 'express'
import { TeamTaskController } from '../controllers/teamTaskController'
import authMiddleware from '../middlewares/authMiddleware'

const teamTaskController = new TeamTaskController()
const router = express.Router()

// Fetch all tasks for a team
router.get('/:teamId/tasks', authMiddleware, teamTaskController.getTeamTasks)

// Create a task for a team
router.post('/:teamId/tasks', authMiddleware, teamTaskController.createTeamTask)

// Update a team task
router.put(
  '/:teamId/tasks/:taskId',
  authMiddleware,
  teamTaskController.updateTeamTask,
)

// Delete a team task
router.delete(
  '/:teamId/tasks/:taskId',
  authMiddleware,
  teamTaskController.deleteTeamTask,
)

export default router
