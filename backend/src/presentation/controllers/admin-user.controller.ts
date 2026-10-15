import { Request, Response, NextFunction } from 'express'
import { AdminUserUseCase } from '../../application/use-cases/admin/admin-user'

const adminUserUseCase = new AdminUserUseCase()

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string | undefined
    const result = await adminUserUseCase.getAllUsers(page, limit, search)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getUserById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await adminUserUseCase.getUserById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function toggleUserStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await adminUserUseCase.toggleUserStatus(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateUserRole(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { role } = req.body
    if (!role || !['ADMIN', 'CUSTOMER'].includes(role)) {
      throw new AppError('Invalid role. Must be ADMIN or CUSTOMER', 400)
    }
    const result = await adminUserUseCase.updateUserRole(req.params.id, role)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}