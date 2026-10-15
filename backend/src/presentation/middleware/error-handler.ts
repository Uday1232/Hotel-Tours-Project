import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: unknown
}

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  console.error(`[Error] ${req.method} ${req.path}:`, err.message)

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}