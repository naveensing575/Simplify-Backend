// src/controllers/authController.ts
import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  try {
    const { token, user } = await authService.signup(email, password, name)
    res.status(201).json({ token, user })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const { token, user } = await authService.login(email, password)
    res.status(200).json({ token, user })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  const response = authService.logout()
  res.status(200).json(response)
}
