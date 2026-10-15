import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up duplicate tours from previous seed runs
  const fixedTourIds = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  ]
  await prisma.tourItinerary.deleteMany({ where: { tourId: { notIn: fixedTourIds } } })
  await prisma.tourImage.deleteMany({ where: { tourId: { notIn: fixedTourIds } } })
  await prisma.bookingTour.deleteMany({ where: { tourId: { notIn: fixedTourIds } } })
  await prisma.tourPackage.deleteMany({ where: { id: { notIn: fixedTourIds } } })
  console.log('Duplicate tours cleaned')

  // ============================================
  // USERS
  // ============================================
  const passwordHash = await bcrypt.hash('Admin@123', 12)
  const customerPasswordHash = await bcrypt.hash('Customer@123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hoteltours.com' },
    update: {},
    create: {
      email: 'admin@hoteltours.com',
      passwordHash,
      name: 'System Admin',
      phone: '919999999999',
      role: 'ADMIN'
    }
  })

  const customer = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      passwordHash: customerPasswordHash,
      name: 'John Doe',
      phone: '918888888888',
      role: 'CUSTOMER'
    }
  })

  console.log('Users seeded')

  // ============================================
  // ROOM TYPES
  // ============================================
  const standardRoom = await prisma.roomType.upsert({
    where: { name: 'Standard' },
    update: {},
    create: {
      name: 'Standard',
      description: 'Comfortable room with basic amenities',
      basePrice: 2500,
      maxGuests: 2
    }
  })

  const deluxeRoom = await prisma.roomType.upsert({
    where: { name: 'Deluxe' },
    update: {},
    create: {
      name: 'Deluxe',
      description: 'Spacious room with premium amenities and city view',
      basePrice: 4500,
      maxGuests: 2
    }
  })

  const suiteRoom = await prisma.roomType.upsert({
    where: { name: 'Suite' },
    update: {},
    create: {
      name: 'Suite',
      description: 'Luxury suite with separate living area and balcony',
      basePrice: 8000,
      maxGuests: 4
    }
  })

  const premiumRoom = await prisma.roomType.upsert({
    where: { name: 'Premium' },
    update: {},
    create: {
      name: 'Premium',
      description: 'Top-floor premium room with panoramic views',
      basePrice: 12000,
      maxGuests: 3
    }
  })

  console.log('Room types seeded')

  // ============================================
  // ROOMS
  // ============================================
  const rooms = [
    { number: '101', floor: 1, roomTypeId: standardRoom.id },
    { number: '102', floor: 1, roomTypeId: standardRoom.id },
    { number: '103', floor: 1, roomTypeId: standardRoom.id },
    { number: '201', floor: 2, roomTypeId: deluxeRoom.id },
    { number: '202', floor: 2, roomTypeId: deluxeRoom.id },
    { number: '203', floor: 2, roomTypeId: deluxeRoom.id },
    { number: '301', floor: 3, roomTypeId: suiteRoom.id },
    { number: '302', floor: 3, roomTypeId: suiteRoom.id },
    { number: '401', floor: 4, roomTypeId: premiumRoom.id },
    { number: '402', floor: 4, roomTypeId: premiumRoom.id }
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: {},
      create: {
        number: room.number,
        floor: room.floor,
        roomTypeId: room.roomTypeId,
        status: 'AVAILABLE'
      }
    })
  }

  console.log('Rooms seeded')

  // ============================================
  // ROOM IMAGES
  // ============================================
  const allRooms = await prisma.room.findMany()

  for (const room of allRooms) {
    const existingImages = await prisma.roomImage.count({
      where: { roomId: room.id }
    })

    if (existingImages === 0) {
      await prisma.roomImage.createMany({
        data: [
          {
            roomId: room.id,
            url: `/uploads/rooms/${room.number}_1.jpg`,
            caption: `${room.number} - Main View`,
            sortOrder: 0,
            isPrimary: true
          },
          {
            roomId: room.id,
            url: `/uploads/rooms/${room.number}_2.jpg`,
            caption: `${room.number} - Bathroom`,
            sortOrder: 1,
            isPrimary: false
          }
        ]
      })
    }
  }

  console.log('Room images seeded')

  // ============================================
  // TOUR PACKAGES
  // ============================================
  const adventureTour = await prisma.tourPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Mountain Adventure Trek',
      description: 'Exciting 3-day trek through scenic mountain trails with camping and bonfire night.',
      durationDays: 3,
      durationNights: 2,
      price: 12000,
      category: 'ADVENTURE',
      maxGroupSize: 15,
      isFeatured: true
    }
  })

  const culturalTour = await prisma.tourPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Heritage Cultural Tour',
      description: 'Immerse yourself in local culture with visits to historical sites, temples, and traditional villages.',
      durationDays: 4,
      durationNights: 3,
      price: 18000,
      category: 'CULTURAL',
      maxGroupSize: 20,
      isFeatured: true
    }
  })

  const beachTour = await prisma.tourPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Beach Paradise Getaway',
      description: 'Relax at pristine beaches with water sports, sunset cruises, and seafood dinners.',
      durationDays: 3,
      durationNights: 2,
      price: 15000,
      category: 'BEACH',
      maxGroupSize: 12,
      isFeatured: false
    }
  })

  const wildlifeTour = await prisma.tourPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Wildlife Safari Expedition',
      description: 'Experience the thrill of spotting exotic wildlife in their natural habitat with expert guides.',
      durationDays: 5,
      durationNights: 4,
      price: 28000,
      category: 'WILDLIFE',
      maxGroupSize: 10,
      isFeatured: true
    }
  })

  console.log('Tour packages seeded')

  // ============================================
  // TOUR ITINERARIES
  // ============================================
  await prisma.tourItinerary.createMany({
    data: [
      // Adventure Tour
      { tourId: adventureTour.id, dayNumber: 1, title: 'Arrival & Base Camp', description: 'Arrive at base camp, safety briefing, acclimatization walk.', accommodation: 'Camping Tents', meals: 'Lunch, Dinner' },
      { tourId: adventureTour.id, dayNumber: 2, title: 'Summit Trek', description: 'Full day trek to summit with packed lunch. Stunning views.', accommodation: 'Camping Tents', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: adventureTour.id, dayNumber: 3, title: 'Descent & Departure', description: 'Morning descent, certificate ceremony, departure.', accommodation: 'None', meals: 'Breakfast' },

      // Cultural Tour
      { tourId: culturalTour.id, dayNumber: 1, title: 'City Heritage Walk', description: 'Guided walk through old city, local markets, and historic monuments.', accommodation: 'Heritage Hotel', meals: 'Lunch, Dinner' },
      { tourId: culturalTour.id, dayNumber: 2, title: 'Temple & Art Trail', description: 'Visit ancient temples, local art galleries, craft workshops.', accommodation: 'Heritage Hotel', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: culturalTour.id, dayNumber: 3, title: 'Village Experience', description: 'Traditional village visit, local cuisine cooking class.', accommodation: 'Homestay', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: culturalTour.id, dayNumber: 4, title: 'Farewell & Departure', description: 'Morning at leisure, souvenir shopping, departure.', accommodation: 'None', meals: 'Breakfast' },

      // Beach Tour
      { tourId: beachTour.id, dayNumber: 1, title: 'Beach Arrival', description: 'Arrive at beach resort, evening beach walk and sunset.', accommodation: 'Beach Resort', meals: 'Lunch, Dinner' },
      { tourId: beachTour.id, dayNumber: 2, title: 'Water Sports Day', description: 'Snorkeling, jet skiing, beach volleyball tournament.', accommodation: 'Beach Resort', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: beachTour.id, dayNumber: 3, title: 'Sunset Cruise & Departure', description: 'Morning at leisure, afternoon sunset cruise, departure.', accommodation: 'None', meals: 'Breakfast, Lunch' },

      // Wildlife Tour
      { tourId: wildlifeTour.id, dayNumber: 1, title: 'Arrival & Briefing', description: 'Arrive at jungle lodge, wildlife briefing, evening nature walk.', accommodation: 'Jungle Lodge', meals: 'Lunch, Dinner' },
      { tourId: wildlifeTour.id, dayNumber: 2, title: 'Morning Safari', description: 'Early morning jeep safari, bird watching, afternoon rest.', accommodation: 'Jungle Lodge', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: wildlifeTour.id, dayNumber: 3, title: 'Elephant Camp', description: 'Visit elephant sanctuary, forest trek with guides.', accommodation: 'Jungle Lodge', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: wildlifeTour.id, dayNumber: 4, title: 'Night Safari', description: 'Evening night safari, campfire stories, stargazing.', accommodation: 'Jungle Lodge', meals: 'Breakfast, Lunch, Dinner' },
      { tourId: wildlifeTour.id, dayNumber: 5, title: 'Departure', description: 'Morning bird watching, farewell, departure.', accommodation: 'None', meals: 'Breakfast' }
    ]
  })

  console.log('Tour itineraries seeded')

  // ============================================
  // SAMPLE BOOKINGS
  // ============================================
  const room101 = await prisma.room.findUnique({ where: { number: '101' } })
  const room201 = await prisma.room.findUnique({ where: { number: '201' } })
  const existingBooking1 = await prisma.booking.findUnique({ where: { bookingNumber: 'BK-2026-001' } })
  const existingBooking2 = await prisma.booking.findUnique({ where: { bookingNumber: 'BK-2026-002' } })

  if (room101 && room201 && !existingBooking1 && !existingBooking2) {
    const booking1 = await prisma.booking.create({
      data: {
        customerId: customer.id,
        bookingNumber: 'BK-2026-001',
        status: 'CONFIRMED',
        totalAmount: 7000,
        notes: 'Anniversary celebration',
        rooms: {
          create: {
            roomId: room101.id,
            checkIn: new Date('2026-10-15'),
            checkOut: new Date('2026-10-17'),
            pricePerNight: 2500,
            totalNights: 2,
            totalPrice: 5000
          }
        },
        payment: {
          create: {
            amount: 7000,
            method: 'UPI',
            status: 'COMPLETED',
            transactionId: 'UPI-TXN-001',
            paidAt: new Date('2026-09-20')
          }
        }
      }
    })

    const booking2 = await prisma.booking.create({
      data: {
        customerId: customer.id,
        bookingNumber: 'BK-2026-002',
        status: 'PENDING',
        totalAmount: 27000,
        notes: 'Family vacation',
        rooms: {
          create: {
            roomId: room201.id,
            checkIn: new Date('2026-11-01'),
            checkOut: new Date('2026-11-03'),
            pricePerNight: 4500,
            totalNights: 2,
            totalPrice: 9000
          }
        },
        tours: {
          create: {
            tourId: adventureTour.id,
            travelDate: new Date('2026-11-03'),
            numberOfPeople: 2,
            pricePerPerson: 12000,
            totalPrice: 24000
          }
        }
      }
    })

    console.log('Sample bookings seeded')
  }

  console.log('Database seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })