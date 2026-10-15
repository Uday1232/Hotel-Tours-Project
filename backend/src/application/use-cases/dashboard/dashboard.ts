import { prisma } from '../../../infrastructure/database/prisma-client'

export class DashboardStatsUseCase {
  async getOverview() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalTours,
      activeTours,
      totalCustomers,
      totalBookings,
      monthlyBookings,
      yearlyBookings,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      prisma.room.count({ where: { isActive: true } }),
      prisma.room.count({ where: { status: 'AVAILABLE', isActive: true } }),
      prisma.room.count({ where: { status: 'OCCUPIED', isActive: true } }),
      prisma.room.count({ where: { status: 'MAINTENANCE', isActive: true } }),
      prisma.tourPackage.count({ where: { isActive: true } }),
      prisma.tourPackage.count({ where: { isActive: true, isFeatured: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfYear } } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } }, _sum: { amount: true } })
    ])

    return {
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        maintenance: maintenanceRooms,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
      },
      tours: {
        total: totalTours,
        featured: activeTours
      },
      customers: {
        total: totalCustomers
      },
      bookings: {
        total: totalBookings,
        monthly: monthlyBookings,
        yearly: yearlyBookings
      },
      revenue: {
        total: Number(totalRevenue._sum.amount) || 0,
        monthly: Number(monthlyRevenue._sum.amount) || 0
      }
    }
  }

  async getBookingSummary() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [roomBookings, tourBookings, monthlyRoomBookings, monthlyTourBookings] = await Promise.all([
      prisma.bookingRoom.count(),
      prisma.bookingTour.count(),
      prisma.bookingRoom.count({ where: { booking: { createdAt: { gte: startOfMonth } } } }),
      prisma.bookingTour.count({ where: { booking: { createdAt: { gte: startOfMonth } } } })
    ])

    const [roomRevenue, tourRevenue] = await Promise.all([
      prisma.bookingRoom.aggregate({ _sum: { totalPrice: true } }),
      prisma.bookingTour.aggregate({ _sum: { totalPrice: true } })
    ])

    return {
      rooms: {
        total: roomBookings,
        monthly: monthlyRoomBookings,
        revenue: Number(roomRevenue._sum.totalPrice) || 0
      },
      tours: {
        total: tourBookings,
        monthly: monthlyTourBookings,
        revenue: Number(tourRevenue._sum.totalPrice) || 0
      }
    }
  }

  async getRevenueByMonth(year: number) {
    const months = []
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(year, i, 1)
      const endDate = new Date(year, i + 1, 0, 23, 59, 59)

      const [roomRevenue, tourRevenue] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'COMPLETED', createdAt: { gte: startDate, lte: endDate } },
          _sum: { amount: true }
        }),
        prisma.bookingTour.aggregate({
          where: { booking: { createdAt: { gte: startDate, lte: endDate }, status: { in: ['CONFIRMED', 'COMPLETED'] } } },
          _sum: { totalPrice: true }
        })
      ])

      months.push({
        month: i + 1,
        roomRevenue: Number(roomRevenue._sum.amount) || 0,
        tourRevenue: Number(tourRevenue._sum.totalPrice) || 0,
        totalRevenue: (Number(roomRevenue._sum.amount) || 0) + (Number(tourRevenue._sum.totalPrice) || 0)
      })
    }
    return months
  }

  async getOccupancyRate(days: number = 30) {
    const result = []
    const totalRooms = await prisma.room.count({ where: { isActive: true } })

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const occupiedRooms = await prisma.bookingRoom.count({
        where: {
          booking: { status: { in: ['PENDING', 'CONFIRMED'] } },
          checkIn: { lte: date },
          checkOut: { gt: date }
        }
      })

      result.push({
        date: date.toISOString().split('T')[0],
        occupied: occupiedRooms,
        available: totalRooms - occupiedRooms,
        rate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
      })
    }
    return result
  }

  async getRecentBookings(limit: number = 10) {
    return prisma.booking.findMany({
      take: limit,
      include: {
        customer: { select: { name: true, email: true } },
        rooms: { include: { room: { select: { number: true } } } },
        tours: { include: { tour: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getTopTours(limit: number = 5) {
    const tours = await prisma.tourPackage.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { bookings: true } },
        bookings: { select: { totalPrice: true } }
      }
    })

    const sorted = tours
      .map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        totalBookings: t._count.bookings,
        totalRevenue: t.bookings.reduce((sum: number, b: { totalPrice: any }) => sum + Number(b.totalPrice), 0)
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, limit)

    return sorted
  }

  async getBookingCalendar(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        rooms: {
          some: {
            OR: [
              { checkIn: { lte: end }, checkOut: { gte: start } }
            ]
          }
        }
      },
      include: {
        customer: { select: { name: true, email: true } },
        rooms: {
          include: { room: { select: { number: true, floor: true } } }
        },
        tours: {
          include: { tour: { select: { name: true, category: true } } }
        }
      }
    })

    const calendar: Record<string, any[]> = {}

    for (const booking of bookings) {
      for (const roomBooking of booking.rooms) {
        const checkIn = new Date(roomBooking.checkIn)
        const checkOut = new Date(roomBooking.checkOut)

        const current = new Date(checkIn)
        while (current < checkOut) {
          const dateKey = current.toISOString().split('T')[0]

          if (!calendar[dateKey]) {
            calendar[dateKey] = []
          }

          calendar[dateKey].push({
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber,
            type: 'room',
            customer: booking.customer,
            room: roomBooking.room,
            checkIn: roomBooking.checkIn,
            checkOut: roomBooking.checkOut,
            status: booking.status
          })

          current.setDate(current.getDate() + 1)
        }
      }

      for (const tourBooking of booking.tours) {
        const dateKey = new Date(tourBooking.travelDate).toISOString().split('T')[0]

        if (!calendar[dateKey]) {
          calendar[dateKey] = []
        }

        calendar[dateKey].push({
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          type: 'tour',
          customer: booking.customer,
          tour: tourBooking.tour,
          numberOfPeople: tourBooking.numberOfPeople,
          status: booking.status
        })
      }
    }

    return calendar
  }
}