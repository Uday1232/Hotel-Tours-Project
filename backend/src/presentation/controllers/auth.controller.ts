import { Request, Response, NextFunction } from 'express'
import { RegisterUseCase } from '../../application/use-cases/auth/register'
import { LoginUseCase } from '../../application/use-cases/auth/login'

const registerUseCase = new RegisterUseCase()
const loginUseCase = new LoginUseCase()

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerUseCase.execute(req.body)
    res.status(201).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginUseCase.execute(req.body)
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user }
    })
  } catch (error) {
    next(error)
  }
}