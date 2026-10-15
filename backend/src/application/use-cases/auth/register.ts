import { prisma } from '../../../infrastructure/database/prisma-client'
import bcrypt from 'bcryptjs'
import { RegisterInput, RegisterOutput } from '../../dto/auth.dto'

export class RegisterUseCase {
  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    })

    if (existingUser) {
      throw new AppError('Email already registered', 409)
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        phone: input.phone,
        role: 'CUSTOMER'
      }
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}