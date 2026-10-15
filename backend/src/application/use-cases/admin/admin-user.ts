import { prisma } from '../../../infrastructure/database/prisma-client'

export class AdminUserUseCase {
  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { bookings: true, reviews: true }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    const safeUsers = users.map(u => {
      const { passwordHash, ...rest } = u
      return rest
    })

    return {
      users: safeUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true, reviews: true }
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            rooms: { include: { room: { include: { roomType: true } } } },
            tours: { include: { tour: true } },
          }
        }
      }
    })

    if (!user) throw new AppError('User not found', 404)

    const { passwordHash, ...safeUser } = user
    return safeUser
  }

  async toggleUserStatus(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new AppError('User not found', 404)

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    })

    const { passwordHash, ...safeUser } = updated
    return safeUser
  }

  async updateUserRole(id: string, role: 'ADMIN' | 'CUSTOMER') {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new AppError('User not found', 404)

    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    })

    const { passwordHash, ...safeUser } = updated
    return safeUser
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}