import express from 'express'
import { TeamController } from '../controllers/teamTaskController'

const teamController = new TeamController()
const router = express.Router()

router.get('/:teamId/tasks', teamController.getTeamTasks)
router.post('/:teamId/tasks', teamController.createTeamTask)
router.put('/:teamId/tasks/:taskId', teamController.updateTeamTask)
router.delete('/:teamId/tasks/:taskId', teamController.deleteTeamTask)

export default router
