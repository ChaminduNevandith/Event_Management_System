import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Clean up existing data
  await prisma.expenseSplit.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.itineraryItem.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.tripMember.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.user.deleteMany()
  
  // Create test user
  const user1 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      displayName: 'Jane',
      isEmailVerified: true,
    }
  })
  
  const user2 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Smith',
      displayName: 'Johnny',
      isEmailVerified: true,
    }
  })
  
  // Create sample trip
  const trip = await prisma.trip.create({
    data: {
      title: 'Summer in Japan',
      description: 'Two weeks exploring Tokyo, Kyoto, and Osaka.',
      status: 'UPCOMING',
      startDate: new Date('2024-07-01T00:00:00Z'),
      endDate: new Date('2024-07-15T00:00:00Z'),
      timezone: 'Asia/Tokyo',
      members: {
        create: [
          { userId: user1.id, role: 'OWNER' },
          { userId: user2.id, role: 'MEMBER' }
        ]
      },
      destinations: {
        create: [
          {
            name: 'Tokyo',
            orderIndex: 0,
            startDate: new Date('2024-07-01T00:00:00Z'),
            endDate: new Date('2024-07-06T00:00:00Z'),
          },
          {
            name: 'Kyoto',
            orderIndex: 1,
            startDate: new Date('2024-07-06T00:00:00Z'),
            endDate: new Date('2024-07-10T00:00:00Z'),
          }
        ]
      }
    },
    include: {
      destinations: true
    }
  })
  
  // Create sample expense
  await prisma.expense.create({
    data: {
      tripId: trip.id,
      title: 'Airbnb Tokyo',
      amount: 1200,
      currency: 'USD',
      category: 'ACCOMMODATION',
      payerId: user1.id,
      splits: {
        create: [
          { userId: user1.id, amount: 600 },
          { userId: user2.id, amount: 600 }
        ]
      }
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
