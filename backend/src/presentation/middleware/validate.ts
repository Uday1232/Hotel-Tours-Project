import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = source === 'query' ? req.query : req.body
    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      })
      return
    }

    if (source === 'body') {
      req.body = result.data
    }
    next()
  }
}