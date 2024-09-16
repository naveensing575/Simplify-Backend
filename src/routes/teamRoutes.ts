import { Router, Request, Response } from 'express'
import { TeamController } from '../controllers/teamController'
import authMiddleware from '../middlewares/authMiddleware'
import { IGetUserAuthInfoRequest } from '../types/index'

const teamController = new TeamController()
const router = Router()

// Create a new team
router.post('/', authMiddleware, (req: Request, res: Response) => {
  return teamController.createTeam(req as IGetUserAuthInfoRequest, res)
})

// Get all teams
router.get('/', authMiddleware, (req: Request, res: Response) => {
  return teamController.getAllTeams(req as IGetUserAuthInfoRequest, res)
})

// Get details of a specific team
router.get('/:teamId', authMiddleware, (req: Request, res: Response) => {
  return teamController.getTeamDetails(req as IGetUserAuthInfoRequest, res)
})

// Update a specific team
router.put('/:teamId', authMiddleware, (req: Request, res: Response) => {
  return teamController.updateTeam(req as IGetUserAuthInfoRequest, res)
})

// Delete a specific team
router.delete('/:teamId', authMiddleware, (req: Request, res: Response) => {
  return teamController.deleteTeam(req as IGetUserAuthInfoRequest, res)
})

// Get members of a specific team
router.get(
  '/:teamId/members',
  authMiddleware,
  (req: Request, res: Response) => {
    return teamController.getTeamMembers(req as IGetUserAuthInfoRequest, res)
  },
)

export default router
