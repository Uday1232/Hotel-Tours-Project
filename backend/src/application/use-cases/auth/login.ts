import { prisma } from '../../../infrastructure/database/prisma-client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../../infrastructure/config/env'
import { LoginInput, LoginOutput } from '../../dto/auth.dto'

export class LoginUseCase {
  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403)
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401)
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    function parseExpiresIn(value: string): number {
      const match = value.match(/^(\d+)([smhd])$/)
      if (!match) return 604800
      const num = parseInt(match[1])
      switch (match[2]) {
        case 's': return num
        case 'm': return num * 60
        case 'h': return num * 60 * 60
        case 'd': return num * 24 * 60 * 60
        default: return 604800
      }
    }

    const options: jwt.SignOptions = {
      expiresIn: parseExpiresIn(env.JWT_EXPIRES_IN)
    }

    const token = jwt.sign(payload, env.JWT_SECRET, options)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}